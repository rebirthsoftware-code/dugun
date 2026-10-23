/**
 * Veri katmanı. Öncelik sırası:
 *  1) GitHub deposu (DATA_GITHUB_TOKEN): veriler `data` dalındaki JSON dosyalarına yazılır.
 *  2) Upstash Redis (KV_REST_API_URL / KV_REST_API_TOKEN).
 *  3) Bellek içi depo: yalnızca geliştirme/önizleme; sunucu yeniden başlayınca sıfırlanır.
 */
import { Redis } from "@upstash/redis";
import { revalidateTag } from "next/cache";

/* ------------------------------ GitHub ------------------------------ */
const ghToken = process.env.DATA_GITHUB_TOKEN;
const ghRepo =
  process.env.DATA_GITHUB_REPO ??
  (process.env.VERCEL_GIT_REPO_OWNER && process.env.VERCEL_GIT_REPO_SLUG
    ? `${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`
    : "rebirthsoftware-code/dugun");
const ghBranch = process.env.DATA_GITHUB_BRANCH ?? "data";
const ghDir = "data";
const ghApi = process.env.DATA_GITHUB_API ?? "https://api.github.com";
const GH_CACHE_TTL = 5_000; // ms; aynı sunucu örneğinde tekrar okumaları azaltır

type GhEntry = { value: unknown; sha: string | null; at: number };
const ghCache = new Map<string, GhEntry>();

function ghHeaders(extra: Record<string, string> = {}) {
  return {
    Authorization: `Bearer ${ghToken}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "konak-panel",
    ...extra,
  };
}
const ghPath = (key: string) => `${ghDir}/${key.replace(/[^a-z0-9_-]/gi, "_")}.json`;
const ghUrl = (key: string) => `${ghApi}/repos/${ghRepo}/contents/${ghPath(key)}`;

const tagOf = (key: string) => `gh:${key}`;

/**
 * Okuma. `force=false` iken Next.js'in paylaşımlı veri önbelleği (60 sn, etiketli) kullanılır;
 * böylece tüm sunucu örnekleri GitHub'a tek istek atar ve saatlik API sınırı aşılmaz.
 * Yazımlar etiketi geçersiz kılar. Hata olursa son bilinen değer ya da varsayılan (null) döner;
 * site asla GitHub yüzünden çökmez. `force=true` (panel, yazım) her zaman taze okur ve hatayı iletir.
 */
async function ghRead(key: string, force = false): Promise<GhEntry> {
  const cached = ghCache.get(key);
  if (!force && cached && Date.now() - cached.at < GH_CACHE_TTL) return cached;
  try {
    const res = await fetch(`${ghUrl(key)}?ref=${encodeURIComponent(ghBranch)}`, {
      headers: ghHeaders(),
      ...(force ? { cache: "no-store" as const } : { next: { revalidate: 60, tags: [tagOf(key)] } }),
    });
    let entry: GhEntry;
    if (res.status === 404) {
      entry = { value: null, sha: null, at: Date.now() };
    } else if (!res.ok) {
      throw new Error(`GitHub okuma hatası ${res.status}: ${(await res.text()).slice(0, 200)}`);
    } else {
      const json = (await res.json()) as { sha: string; content: string; encoding: string };
      const text = Buffer.from(json.content, "base64").toString("utf8");
      entry = { value: text ? JSON.parse(text) : null, sha: json.sha, at: Date.now() };
    }
    ghCache.set(key, entry);
    return entry;
  } catch (err) {
    if (force) throw err;
    console.error("[db] GitHub okunamadı, son bilinen değer kullanılıyor:", err instanceof Error ? err.message : err);
    return cached ?? { value: null, sha: null, at: 0 };
  }
}

let branchEnsured = false;

/** `data` dalı yoksa varsayılan daldan oluşturur (süreç başına bir kez kontrol edilir). */
async function ghEnsureBranch() {
  if (branchEnsured) return;
  const ref = await fetch(`${ghApi}/repos/${ghRepo}/git/ref/heads/${encodeURIComponent(ghBranch)}`, { headers: ghHeaders(), cache: "no-store" });
  if (ref.ok) {
    branchEnsured = true;
    return;
  }
  const repo = await fetch(`${ghApi}/repos/${ghRepo}`, { headers: ghHeaders(), cache: "no-store" });
  if (!repo.ok) throw new Error(`GitHub depo bilgisi alınamadı ${repo.status}`);
  const { default_branch } = (await repo.json()) as { default_branch: string };
  const base = await fetch(`${ghApi}/repos/${ghRepo}/git/ref/heads/${encodeURIComponent(default_branch)}`, { headers: ghHeaders(), cache: "no-store" });
  if (!base.ok) throw new Error(`Varsayılan dal okunamadı ${base.status}`);
  const { object } = (await base.json()) as { object: { sha: string } };
  const create = await fetch(`${ghApi}/repos/${ghRepo}/git/refs`, {
    method: "POST",
    headers: ghHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ ref: `refs/heads/${ghBranch}`, sha: object.sha }),
  });
  if (!create.ok && create.status !== 422) throw new Error(`Dal oluşturulamadı ${create.status}: ${await create.text()}`);
  branchEnsured = true;
}

/** GitHub hız sınırı (403/429) yanıtında beklenecek süre; en fazla 4 sn. */
function retryAfterMs(res: Response) {
  const ra = Number(res.headers.get("retry-after"));
  if (ra > 0) return Math.min(ra * 1000, 4000);
  return 1500;
}

/**
 * Okuma-değiştir-yazma: her denemede dosya taze okunur, `updater` güncel değere uygulanır ve
 * o anki sha ile yazılır. Eşzamanlı yazımda (409/422) baştan tekrar denenir; böylece kayıt ezilmez.
 */
async function ghWrite(key: string, updater: (current: unknown) => unknown) {
  await ghEnsureBranch();
  for (let attempt = 0; attempt < 5; attempt++) {
    const current = await ghRead(key, true);
    const value = updater(current.value);
    const content = Buffer.from(JSON.stringify(value, null, 2) + "\n", "utf8").toString("base64");
    const res = await fetch(ghUrl(key), {
      method: "PUT",
      headers: ghHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        message: `panel: ${key} güncellendi`,
        content,
        branch: ghBranch,
        ...(current.sha ? { sha: current.sha } : {}),
      }),
    });
    if (res.ok) {
      const json = (await res.json()) as { content: { sha: string } };
      ghCache.set(key, { value, sha: json.content.sha, at: Date.now() });
      try {
        revalidateTag(tagOf(key), "max");
      } catch {
        /* server action dışında çağrıldıysa yok say */
      }
      return;
    }
    if (res.status === 409 || res.status === 422) {
      await new Promise((r) => setTimeout(r, 150 * (attempt + 1)));
      continue; // sha çakışması: taze oku ve tekrar uygula
    }
    if ((res.status === 403 || res.status === 429) && attempt < 2) {
      await new Promise((r) => setTimeout(r, retryAfterMs(res)));
      continue; // hız sınırı: kısa bekle ve tekrar dene
    }
    throw new Error(`GitHub yazma hatası ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
  throw new Error("GitHub yazma: eşzamanlı değişiklik nedeniyle kaydedilemedi, tekrar deneyin.");
}

/* ------------------------------ Upstash ----------------------------- */
const kvUrl = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const kvToken = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = !ghToken && kvUrl && kvToken ? new Redis({ url: kvUrl, token: kvToken }) : null;

/* ------------------------------ Bellek ------------------------------ */
const g = globalThis as unknown as { __konakMemory?: Map<string, unknown> };
const mem = g.__konakMemory ?? (g.__konakMemory = new Map<string, unknown>());

/* ------------------------------ API --------------------------------- */
export const dbBackend: "github" | "redis" | "memory" = ghToken ? "github" : redis ? "redis" : "memory";
export const dbConfigured = dbBackend !== "memory";
export const dbDescription =
  dbBackend === "github" ? `GitHub · ${ghRepo} @ ${ghBranch}` : dbBackend === "redis" ? "Upstash Redis" : "Bellek (geçici)";

export async function dbGet<T>(key: string, opts: { fresh?: boolean } = {}): Promise<T | null> {
  if (ghToken) return ((await ghRead(key, opts.fresh)).value as T) ?? null;
  if (redis) return (await redis.get<T>(key)) ?? null;
  return (mem.get(key) as T) ?? null;
}

export async function dbSet<T>(key: string, value: T): Promise<void> {
  if (ghToken) return ghWrite(key, () => value);
  if (redis) {
    await redis.set(key, value);
    return;
  }
  mem.set(key, value);
}

/** Atomik güncelleme: güncel değeri okur, `fn` uygular, yazar. Liste eklemeleri için bunu kullanın. */
export async function dbUpdate<T>(key: string, fn: (current: T | null) => T): Promise<T> {
  if (ghToken) {
    let result!: T;
    await ghWrite(key, (cur) => (result = fn((cur as T) ?? null)));
    return result;
  }
  const next = fn(await dbGet<T>(key));
  await dbSet(key, next);
  return next;
}

export async function dbDel(key: string): Promise<void> {
  if (ghToken) return ghWrite(key, () => null);
  if (redis) {
    await redis.del(key);
    return;
  }
  mem.delete(key);
}
