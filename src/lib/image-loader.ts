import type { ImageLoaderProps } from "next/image";

/**
 * Statik dışa aktarımda görsel optimizasyonu Unsplash CDN'ine devredilir:
 * next/image'ın ürettiği her srcset genişliği için uygun `w` ve `q` parametreleri eklenir.
 */
export default function unsplashLoader({ src, width, quality }: ImageLoaderProps) {
  if (!src.startsWith("https://images.unsplash.com/")) return src;
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  return url.toString();
}
