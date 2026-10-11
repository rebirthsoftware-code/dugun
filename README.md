# Serenad — Düğün & Davet Salonu

Boğaz'a nazır bir düğün salonu için tasarlanmış, Next.js 16'nın en yeni yeteneklerini sergileyen editoryal bir vitrin sitesi.

## Öne çıkanlar

- **WebGL ipek hero** — React Three Fiber üzerinde özel GLSL (domain-warped fBm) shader; fareye tepki verir, perde açılışıyla senkron.
- **Sinematik hareket** — Motion ile kelime kelime maskeli başlıklar, scroll'a bağlı manifesto, yatay "salon yürüyüşü", üst üste yapışan deneyim kartları, paralaks galeri.
- **Lenis** smooth scroll, manyetik butonlar, özel imleç, tam ekran menü, sayaçlı preloader.
- **Tarih sorgulama** — takvim bir Server Function'dan aylık uygunluk haritası çeker; form `useActionState` + Zod ile doğrulanan bir Server Action'a gider ve referans numarası döner.
- **Next.js 16** — App Router, Cache Components + Partial Prefetching, `generateStaticParams`, `ViewTransition`, `next/font`, `next/image` (AVIF/WebP), dinamik OG görselleri (`ImageResponse`), `sitemap`/`robots`/`manifest`, JSON-LD (EventVenue + FAQPage).
- **Tailwind CSS v4** tasarım tokenları, `prefers-reduced-motion` desteği, erişilebilir etkileşimler.

## Teknoloji

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Motion · Lenis · three / @react-three/fiber · Zod · lucide-react

## Çalıştırma

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build && pnpm start
pnpm lint
```

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
- `submitInquiry` içindeki yorumlu noktaya veritabanı / e-posta (ör. Resend) entegrasyonunu ekleyin.
- Görseller Unsplash'tan gelir; müşterinin kendi fotoğraflarını `src/lib/data.ts` üzerinden bağlayın.
