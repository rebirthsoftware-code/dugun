/**
 * Veri katmanı: Upstash Redis (Vercel Marketplace) varsa onu, yoksa bellek içi bir
 * depoyu kullanır. Bellek içi depo yalnızca geliştirme/önizleme içindir; sunucu
 * yeniden başladığında sıfırlanır.
 */
import { Redis } from "@upstash/redis";

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

export const dbConfigured = Boolean(url && token);

const redis = dbConfigured ? new Redis({ url: url!, token: token! }) : null;

const memory = new Map<string, unknown>();
const g = globalThis as unknown as { __konakMemory?: Map<string, unknown> };
const mem = g.__konakMemory ?? (g.__konakMemory = memory);

export async function dbGet<T>(key: string): Promise<T | null> {
  if (redis) return (await redis.get<T>(key)) ?? null;
  return (mem.get(key) as T) ?? null;
}

export async function dbSet<T>(key: string, value: T): Promise<void> {
  if (redis) {
    await redis.set(key, value);
    return;
  }
  mem.set(key, value);
}

export async function dbDel(key: string): Promise<void> {
  if (redis) {
    await redis.del(key);
    return;
  }
  mem.delete(key);
}
