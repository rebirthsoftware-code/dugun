import type { NextConfig } from "next";

/**
 * GitHub Pages için statik dışa aktarım.
 * Proje sitesi (kullanici.github.io/dugun) için NEXT_PUBLIC_BASE_PATH="/dugun" verilir;
 * özel alan adında boş bırakılır.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  // Cache Components bir Node.js sunucusu gerektirir; statik dışa aktarımda tüm sayfalar zaten derleme anında üretilir.
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
