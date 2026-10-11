# Serenad — Düğün & Davet Salonu

Boğaz'a nazır bir düğün salonu için tasarlanmış, Next.js 16'nın en yeni yeteneklerini sergileyen editoryal bir vitrin sitesi.

## Öne çıkanlar

- **WebGL ipek hero** — React Three Fiber üzerinde özel GLSL (domain-warped fBm) shader; fareye tepki verir, perde açılışıyla senkron.
- **Sinematik hareket** — Motion ile kelime kelime maskeli başlıklar, scroll'a bağlı manifesto, yatay "salon yürüyüşü", üst üste yapışan deneyim kartları, paralaks galeri.
- **Lenis** smooth scroll, manyetik butonlar, özel imleç, tam ekran menü, sayaçlı preloader.
- **Tarih sorgulama** — deterministik uygunluk motoru takvimi doldurur; form `useActionState` + Zod ile doğrulanır ve referans numarası döner. Node.js ortamında dosyanın başına `"use server"` eklenerek aynı imzayla Server Action'a dönüşür.
- **Next.js 16** — App Router, statik dışa aktarım (`output: "export"`), `generateStaticParams`, `ViewTransition`, `next/font`, `next/image` (Unsplash CDN loader), derleme anında üretilen OG görselleri (`ImageResponse`), `sitemap`/`robots`/`manifest`, JSON-LD (EventVenue + FAQPage).
- **Tailwind CSS v4** tasarım tokenları, `prefers-reduced-motion` desteği, erişilebilir etkileşimler.

## Teknoloji

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Motion · Lenis · three / @react-three/fiber · Zod · lucide-react

## Canlı

GitHub Pages: **https://rebirthsoftware-code.github.io/dugun/**

Her push'ta `.github/workflows/deploy.yml` siteyi statik olarak derler ve Pages'e yayınlar.

## Çalıştırma

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm build          # statik çıktı: out/
pnpm build:pages    # /dugun ön ekiyle (GitHub Pages proje sitesi)
pnpm preview        # out/ klasörünü yerelde sunar
pnpm lint
```

Özel alan adında yayınlanacaksa `NEXT_PUBLIC_BASE_PATH` boş bırakılır; workflow bunu Pages ayarından otomatik alır.

## Yapı

```
src/
  app/                 # rotalar, metadata, OG görselleri
    mekanlar/[slug]/   # statik üretilen salon sayfaları
    galeri/            # lightbox'lı galeri
    rezervasyon/       # takvim + talep formu
  components/
    hero/              # SilkCanvas (GLSL) + Hero
    layout/            # Header, Menu, Footer, Preloader, Providers
    sections/          # Manifesto, Venues, Experience, Gallery, Availability, FAQ...
    ui/                # Reveal, Magnetic, Cursor, Button, Marquee
  lib/
    data.ts            # salonlar, hizmetler, galeri, SSS
    availability.ts    # deterministik uygunluk motoru
    actions.ts         # Server Actions (talep + uygunluk)
    schema.ts          # Zod şemaları
```

## Üretime alırken

- `src/lib/utils.ts` içindeki `SITE` sabitlerini (alan adı, telefon, adres) güncelleyin.
- Talep formunu gerçek bir kutuya bağlamak için `NEXT_PUBLIC_INQUIRY_ENDPOINT` değişkenine bir Formspree / Web3Forms adresi verin (workflow'da repo secret olarak tanımlanabilir).
- Görseller Unsplash'tan gelir; müşterinin kendi fotoğraflarını `src/lib/data.ts` üzerinden bağlayın.
