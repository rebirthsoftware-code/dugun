import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ViewTransition } from "react";
import { Providers } from "@/components/layout/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/lib/utils";
import "./globals.css";

// Fontlar depoda yerel olarak tutulur: derleme ağ erişimine bağımlı değildir ve CI'da deterministiktir.
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.fullName} · Trabzon`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: ["Trabzon düğün salonu", "Trabzon Meydan düğün salonu", "kına gecesi Trabzon", "nişan salonu Trabzon", "matine Trabzon", "toplantı salonu Trabzon", "Konak düğün salonu"],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: SITE.fullName,
    title: `${SITE.name} · ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0a0a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${cormorant.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>
          <Header />
          <ViewTransition default="slide">
            <main className="flex-1">{children}</main>
          </ViewTransition>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
