/**
 * Statik dışa aktarım sonrası düzeltmeler (GitHub Pages için):
 *  - Uzantısız `opengraph-image` dosyalarını `.png` olarak yeniden adlandırır
 *    (Pages, uzantısız dosyaları octet-stream olarak sunar; sosyal ağ botları bunu görsel saymaz).
 *  - HTML içindeki og:image / twitter:image bağlantılarını buna göre günceller.
 */
import { readdir, rename, readFile, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";

const OUT = new URL("../out/", import.meta.url).pathname;

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const files = await walk(OUT);
let renamed = 0;
for (const f of files) {
  if (f.endsWith("/opengraph-image")) {
    await rename(f, `${f}.png`);
    renamed++;
  }
}
let patched = 0;
for (const f of files) {
  if (!f.endsWith(".html")) continue;
  const html = await readFile(f, "utf8");
  const next = html.replace(/(opengraph-image)(\?[A-Za-z0-9_-]*)?(?=\\?["'])/g, "$1.png");
  if (next !== html) {
    await writeFile(f, next);
    patched++;
  }
}
const sz = (await stat(join(OUT, "index.html"))).size;
console.log(`postexport: ${renamed} OG görseli yeniden adlandırıldı, ${patched} HTML güncellendi (index.html ${sz} B)`);
