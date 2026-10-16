# Konak Düğün Salonu — Trabzon

Trabzon Meydan'daki Konak Düğün Salonu için tasarlanmış, Next.js 16'nın en yeni yeteneklerini sergileyen editoryal bir vitrin sitesi. Düğün, nişan, kına, matine ve toplantı organizasyonları.

## Öne çıkanlar

- **WebGL ipek hero** — React Three Fiber üzerinde özel GLSL (domain-warped fBm) shader; fareye tepki verir, perde açılışıyla senkron.
- **Sinematik hareket** — Motion ile kelime kelime maskeli başlıklar, scroll'a bağlı manifesto, yatay "salon yürüyüşü", üst üste yapışan deneyim kartları, paralaks galeri.
- **Lenis** smooth scroll, manyetik butonlar, özel imleç, tam ekran menü, sayaçlı preloader.
- **Randevu sistemi** — takvim gerçek doluluk verisinden beslenir (onaylı randevular + kapatılan günler); form `useActionState` + Zod ile doğrulanan bir Server Action'a gider ve talep panele düşer.
- **Next.js 16** — App Router, Server Actions, `proxy.ts` ile korunan yönetim paneli, Upstash Redis veri katmanı, `ViewTransition`, `next/font`, `next/image`, dinamik OG görselleri (`ImageResponse`), `sitemap`/`robots`/`manifest`, JSON-LD (EventVenue + FAQPage).
- **Tailwind CSS v4** tasarım tokenları, `prefers-reduced-motion` desteği, erişilebilir etkileşimler.

## Teknoloji

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Motion · Lenis · three / @react-three/fiber · Zod · lucide-react

## Canlı

Vercel: **https://dugun-livid.vercel.app** · Yönetim paneli: **https://dugun-livid.vercel.app/panel**

Her push'ta Vercel otomatik dağıtır.

## Kurulum (Vercel)

Projenin **Settings → Environment Variables** bölümüne:

| Değişken | Açıklama |
| --- | --- |
| `ADMIN_PASSWORD` | Panel giriş şifresi (zorunlu). |
| `DATA_GITHUB_TOKEN` | GitHub deposunu veri olarak kullanmak için fine-grained token (Contents: Read and write). |
| `ADMIN_SECRET` | İsteğe bağlı; oturum imzası için ayrı bir gizli anahtar. Verilmezse şifre kullanılır. |
| `NEXT_PUBLIC_SITE_URL` | İsteğe bağlı; özel alan adı (örn. `https://konakdugun.com`). |

### Veritabanı seçeneği A: GitHub deposu (önerilen, ek servis gerekmez)

Panel verileri bu deponun `data` dalında JSON dosyaları olarak tutulur (`data/konak_content.json`, `data/konak_reservations.json`,
`data/konak_blocked.json`). Her kayıt bir commit olur; `vercel.json` içindeki `ignoreCommand` sayesinde `data` dalı Vercel'de derleme tetiklemez.

1. GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate new token.
   Repository access: yalnızca bu depo. Permissions → Repository permissions → **Contents: Read and write**.
2. Vercel → Settings → Environment Variables → `DATA_GITHUB_TOKEN` = oluşturduğunuz token. (İsteğe bağlı: `DATA_GITHUB_REPO`
   = `owner/repo`, `DATA_GITHUB_BRANCH` = `data`.)
3. Redeploy. `data` dalı ilk kayıtta otomatik oluşturulur.

### Veritabanı seçeneği B: Upstash Redis

Vercel → Storage → Create Database → Upstash Redis. `KV_REST_API_URL` ve `KV_REST_API_TOKEN` otomatik eklenir.

Veritabanı yokken panel çalışır ama veriler kalıcı olmaz; panelde uyarı görünür.

## Panel

- **Özet**: yeni talepler, bu ay onaylı etkinlikler, kapatılan günler.
- **Randevular**: siteden gelen talepler; durum (Yeni → Görüşüldü → Onaylandı / İptal), not, tek tıkla arama, WhatsApp ve e-posta.
  Onaylı randevunun günü sitede otomatik "dolu", görüşülen talep "son yer" olarak görünür.
- **Takvim**: aylık görünüm; bir güne tıklayarak siteden rezervasyona kapatma/açma.
- **Site içeriği**: iletişim, hero, tanıtım, sayılar, etkinlikler, hizmetler, günün akışı, galeri, yorumlar, SSS ve davet bloğu.
  Görseller https bağlantısı olarak girilir (GitHub raw, Vercel Blob vb.); kaydedince anında yayınlanır. Her bölüm için "Varsayılan" düğmesi vardır.

## Çalıştırma

```bash
pnpm install
ADMIN_PASSWORD=gizli pnpm dev   # http://localhost:3000 · panel: /panel
pnpm build && pnpm start
pnpm lint
```

## Yapı

```
src/
  app/                 # rotalar, metadata, OG görselleri
    (site)/            # herkese açık sayfalar (ana sayfa, etkinlikler, galeri, rezervasyon)
    panel/             # yönetim paneli (giriş, özet, randevular, takvim, içerik)
  components/
    hero/              # SilkCanvas (GLSL) + Hero
    layout/            # Header, Menu, Footer, Preloader, Providers
    sections/          # Manifesto, Venues, Experience, Gallery, Availability, FAQ...
    ui/                # Reveal, Magnetic, Cursor, Button, Marquee
  lib/
    data.ts            # varsayılan içerik (panelden değiştirilebilir)
    content.ts         # içerik katmanı: varsayılan + veritabanı birleşimi
    reservations.ts    # randevu talepleri ve kapatılan günler
    availability.ts    # doluluk → takvim durumu
    db.ts              # Upstash Redis / bellek içi depo
    auth.ts, proxy.ts  # panel oturumu ve koruma
    actions.ts         # site Server Actions · panel-actions.ts: panel Server Actions
    schema.ts          # Zod şemaları
```

## Üretime alırken

- `src/lib/utils.ts` içindeki `SITE` sabitleri (telefon, adres, WhatsApp) Konak'ın bilgileriyle doludur; alan adı bağlanınca `url` alanını güncelleyin.
- Kapasite, süre, metin ve görseller panelden güncellenir; `src/lib/data.ts` yalnızca varsayılanları tutar.
- Görseller Unsplash'tan gelir; müşterinin kendi fotoğraflarını `src/lib/data.ts` üzerinden bağlayın.
