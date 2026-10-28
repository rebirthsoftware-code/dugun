import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { getContent } from "@/lib/content";
import "./globals.css";

// Fontlar depoda yerel olarak tutulur: derleme ağ erişimine bağımlı değildir.
const cormorant = localFont({
  variable: "--font-cormorant",
  display: "swap",
  src: [
    { path: "./fonts/CormorantGaramond.woff2", weight: "300 700", style: "normal" },
    { path: "./fonts/CormorantGaramond-Italic.woff2", weight: "300 700", style: "italic" },
  ],
});

const manrope = localFont({
  variable: "--font-manrope",
  display: "swap",
  src: [{ path: "./fonts/Manrope.woff2", weight: "200 800", style: "normal" }],
});

// İçerik panelden yönetildiği için sayfalar istek anında üretilir.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent();
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://dugun-livid.vercel.app");
  return {
    metadataBase: new URL(base),
    title: { default: `${site.fullName} · ${site.city}`, template: `%s · ${site.name}` },
    description: site.description,
    keywords: [`${site.city} düğün salonu`, `${site.district} düğün salonu`, `kına gecesi ${site.city}`, `nişan salonu ${site.city}`, `matine ${site.city}`, `toplantı salonu ${site.city}`, `${site.name} düğün salonu`],
    openGraph: { type: "website", locale: "tr_TR", siteName: site.fullName, title: `${site.name} · ${site.tagline}`, description: site.description },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
    verification: { google: "rKnNdCQRYI9qE7JUA_vEf0tk8nfj1AihNWIiNLXWgyc" },
  };
}

export const viewport: Viewport = {
  themeColor: "#fbfaf7",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${cormorant.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
