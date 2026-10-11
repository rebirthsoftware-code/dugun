import { unsplash } from "./utils";

/* ------------------------------------------------------------------ */
/* Görsel kütüphanesi: tek yerden yönetilir, müşteri fotoğraflarıyla değiştirilir */
/* ------------------------------------------------------------------ */
export const photos = {
  ballroom: unsplash("1519167758481-83f550bb49b3"), // kristal avizeli balo salonu
  silhouette: unsplash("1537907690979-ee8e01276184"), // altın saatte çift silueti
  kissBW: unsplash("1460978812857-470ed1c77af0"), // siyah-beyaz duvaklı öpücük
  darkTable: unsplash("1522413452208-996ff3f3e740"), // koyu tonlu masa düzeni
  stringLights: unsplash("1527529482837-4698179dc6ce"), // ışıklı akşam yemeği, kadeh
  ringsHands: unsplash("1529634806980-85c3dd6d34ac"), // yüzüklü eller, buket
  barBokeh: unsplash("1484156818044-c040038b0719"), // kadehler, bokeh
  sparklers: unsplash("1513725673171-537abba17912"), // maytap, gece kutlaması
  plate: unsplash("1470338950318-40320a722782"), // fine dining tabak
  fieldWalk: unsplash("1607190074257-dd4b7af0309f"), // gün batımında yürüyen çift
  wineToast: unsplash("1510812431401-41d2bd2722f3"), // şarap kadehleri
  dress: unsplash("1519657337289-077653f724ed"), // pencerede gelinlik
  confettiExit: unsplash("1583939003579-730e3918a45a"),
  lawnChairs: unsplash("1522673607200-164d1b6ce486"),
  tableSetting: unsplash("1519225421980-715cb0215aed"),
  veil: unsplash("1546032996-6dfacbacbf3f"),
  ringsClose: unsplash("1465495976277-4387d4b0b4c6"),
  goldRings: unsplash("1606800052052-a08af7148866"),
  ringsFlowers: unsplash("1515934751635-c81c6bc9a2d8"),
  hands: unsplash("1520854221256-17451cc331bf"),
  coupleBouquet: unsplash("1591604466107-ec97de577aff"),
  arch: unsplash("1529636798458-92182e662485"),
  aisle: unsplash("1469371670807-013ccf25f16a"),
  galata: unsplash("1524231757912-21f4fe3a7200"),
  bosphorusSunset: unsplash("1527838832700-5059252407fa"),
  bouquet: unsplash("1550005809-91ad75fb315f"),
  toast: unsplash("1519671482749-fd09be7ccebf"),
  confettiNight: unsplash("1505236858219-8359eb29e329"),
  candles: unsplash("1525772764200-be829a350797"),
  glasses: unsplash("1511795409834-ef04bbd61622"),
  coupleDark: unsplash("1519741497674-611481863552"),
  beachVeil: unsplash("1537633552985-df8429e8048b"),
  dinner: unsplash("1515169067868-5387ec356754"),
} as const;

export type Venue = {
  slug: string;
  name: string;
  subtitle: string;
  capacity: { seated: number; cocktail: number };
  area: number;
  description: string;
  story: string;
  features: string[];
  image: string;
  gallery: string[];
  accent: string;
  index: string;
};

export const venues: Venue[] = [
  {
    slug: "bogaz-salonu",
    name: "Boğaz Salonu",
    subtitle: "Büyük balo salonu",
    capacity: { seated: 600, cocktail: 900 },
    area: 1200,
    description:
      "Yedi metre tavan yüksekliği, Boğaz'a açılan on iki metrelik cam cephe ve altın yaprak detaylı kristal avizeler.",
    story:
      "Boğaz Salonu, denizin iki kıtayı ayırdığı noktada iki aileyi birleştirmek için tasarlandı. Gün batımında cam cephe kehribar rengine döner; gece ise şehrin ışıkları dansa eşlik eder. Sahne, dans pisti ve masa düzeni her davet için yeniden kurgulanır.",
    features: [
      "Boğaz manzaralı 12 m cam cephe",
      "7 m tavan, kristal avizeler",
      "Hidrolik sahne ve LED duvar",
      "Gelin odası & damat lounge",
      "Özel vale ve 300 araçlık otopark",
      "Akustik tasarımlı ses sistemi",
    ],
    image: photos.ballroom,
    gallery: [photos.darkTable, photos.sparklers, photos.wineToast, photos.confettiNight],
    accent: "#c9a66b",
    index: "01",
  },
  {
    slug: "kis-bahcesi",
    name: "Kış Bahçesi",
    subtitle: "Cam tavanlı sera salon",
    capacity: { seated: 250, cocktail: 400 },
    area: 540,
    description:
      "Yüz yıllık manolyaların arasında, yıldızların altında yemek. Cam tavan dört mevsim doğayla iç içe bir davet sunar.",
    story:
      "Eski bir seradan dönüştürülen Kış Bahçesi, demir ve camın zarafetini yaşayan bitkilerle buluşturur. Yağmur yağarken cam tavanda ritim tutar; kış gecelerinde ısıtmalı zemin ve şömine konuklarınızı sarar.",
    features: [
      "Tamamen cam tavan",
      "Yüz yıllık manolya bahçesi",
      "Isıtmalı zemin ve açık şömine",
      "Canlı bitki duvarı",
      "Bahçe nikâh alanı",
      "Dört mevsim kullanım",
    ],
    image: photos.stringLights,
    gallery: [photos.arch, photos.aisle, photos.tableSetting, photos.lawnChairs],
    accent: "#9db5a3",
    index: "02",
  },
  {
    slug: "teras",
    name: "Teras",
    subtitle: "Açık hava & gün batımı",
    capacity: { seated: 120, cocktail: 220 },
    area: 380,
    description:
      "Boğaz'ın tam üstünde, denize sıfır bir teras. Samimi nikâhlar, kokteyller ve gün batımı yemekleri için.",
    story:
      "Teras, yalnızca en yakınlarınızla kutlamak isteyenler için. Deniz kokusu, yakamoz ve köprünün ışıkları; evet dediğiniz anın arka planı olur. Yaz akşamlarında şef masası ve canlı caz ile tamamlanır.",
    features: [
      "Denize sıfır konum",
      "Gün batımı nikâh alanı",
      "Açık hava şef masası",
      "Canlı caz & akustik set",
      "Yedek kapalı alan garantisi",
      "Tekne ile ulaşım iskelesi",
    ],
    image: photos.galata,
    gallery: [photos.fieldWalk, photos.toast, photos.bosphorusSunset, photos.dinner],
    accent: "#c98a8a",
    index: "03",
  },
];

export function getVenue(slug: string) {
  return venues.find((v) => v.slug === slug);
}

export type Service = { id: string; title: string; eyebrow: string; text: string; image: string };

export const services: Service[] = [
  {
    id: "gastronomi",
    eyebrow: "Mutfak",
    title: "Gastronomi",
    text: "Michelin tecrübeli şef ekibimiz menüyü hikâyenize göre yazar. Anadolu'dan Akdeniz'e, tadım oturumlarıyla son hâlini alır.",
    image: photos.plate,
  },
  {
    id: "dekor",
    eyebrow: "Tasarım",
    title: "Dekor & Çiçek",
    text: "Kendi atölyemizde her davet için sıfırdan tasarlanan masa düzeni, çiçek enstalasyonları ve ışık mimarisi.",
    image: photos.candles,
  },
  {
    id: "muzik",
    eyebrow: "Sahne",
    title: "Müzik & Işık",
    text: "Orkestradan DJ'e, lazer haritalamadan mum ışığına. Gecenin ritmini profesyonel sahne ekibimiz kurar.",
    image: photos.sparklers,
  },
  {
    id: "planlama",
    eyebrow: "Koordinasyon",
    title: "Planlama",
    text: "İlk görüşmeden son dansa kadar tek bir isim: size özel koordinatörünüz. Zaman çizelgesi, tedarikçi, prova, kriz yönetimi.",
    image: photos.dress,
  },
  {
    id: "konaklama",
    eyebrow: "Misafirperverlik",
    title: "Konaklama & Ulaşım",
    text: "Anlaşmalı butik oteller, vale, konuk transferi ve Boğaz'dan tekne ile giriş. Konuklarınız yalnızca kutlamayı düşünür.",
    image: photos.dinner,
  },
];

export const timeline = [
  { time: "15:00", title: "Hazırlık", text: "Gelin süiti ve damat lounge'da kuaför, makyaj, fotoğraf.", image: photos.dress },
  { time: "18:30", title: "Nikâh", text: "Gün batımına beş dakika kala, Boğaz'a karşı 'evet'.", image: photos.aisle },
  { time: "19:15", title: "Kokteyl", text: "Terasta canlı caz, imza kokteyller, karşılama kanepeleri.", image: photos.wineToast },
  { time: "20:30", title: "Yemek", text: "Beş tabaklı tadım menüsü, şefin masada sunumu.", image: photos.darkTable },
  { time: "22:30", title: "Dans", text: "İlk dans, orkestra, sonra DJ. Işık mimarisi geceye döner.", image: photos.sparklers },
  { time: "01:00", title: "Uğurlama", text: "Maytaplı çıkış, gece atıştırmalığı, konuk transferleri.", image: photos.confettiExit },
];

export const tastingMenu = {
  intro: "Her menü çift için yeniden yazılır. Örnek bir sonbahar akşamı:",
  courses: [
    {
      name: "Karşılama",
      items: [
        { name: "Boğaz levreği tartar, limon kavyarı", note: "" },
        { name: "Kuru incir & keçi peyniri tartolet", note: "v" },
        { name: "İmza kokteyl: Serenad Spritz", note: "" },
      ],
    },
    {
      name: "Ara sıcak",
      items: [
        { name: "Mantar kapuçino, trüf yağı", note: "v" },
        { name: "Karides güveç, tereyağlı ekmek", note: "" },
      ],
    },
    {
      name: "Ana",
      items: [
        { name: "Kuzu kol konfi, kestane püresi, nar", note: "" },
        { name: "Közlenmiş kalkan, beurre blanc, yabani ot", note: "" },
        { name: "Kabak çiçeği risotto", note: "v" },
      ],
    },
    {
      name: "Tatlı",
      items: [
        { name: "Düğün pastası: fıstık, gül, beyaz çikolata", note: "" },
        { name: "Antep fıstıklı katmer, kaymak dondurma", note: "" },
      ],
    },
  ],
};

export const gallery = [
  { src: photos.kissBW, alt: "Duvak altında ilk öpücük", w: 4, h: 5 },
  { src: photos.silhouette, alt: "Altın saatte siluet", w: 3, h: 4 },
  { src: photos.darkTable, alt: "Masa düzeni, mum ışığı", w: 4, h: 3 },
  { src: photos.hands, alt: "El ele", w: 4, h: 5 },
  { src: photos.sparklers, alt: "Maytaplı gece", w: 3, h: 4 },
  { src: photos.arch, alt: "Çiçek takı", w: 4, h: 5 },
  { src: photos.goldRings, alt: "Yüzükler", w: 4, h: 3 },
  { src: photos.coupleBouquet, alt: "Çiftin portresi", w: 3, h: 4 },
  { src: photos.fieldWalk, alt: "Gün batımı yürüyüşü", w: 4, h: 5 },
  { src: photos.wineToast, alt: "Kadeh kaldırma", w: 4, h: 3 },
  { src: photos.bouquet, alt: "Gelin buketi", w: 3, h: 4 },
  { src: photos.confettiExit, alt: "Konfeti altında çıkış", w: 4, h: 3 },
  { src: photos.veil, alt: "Rüzgârda duvak", w: 3, h: 4 },
  { src: photos.ringsFlowers, alt: "Yüzük ve çiçek", w: 4, h: 3 },
  { src: photos.beachVeil, alt: "Deniz kenarında", w: 4, h: 5 },
  { src: photos.stringLights, alt: "Işıklar altında yemek", w: 4, h: 3 },
];

export const testimonials = [
  {
    quote:
      "Boğaz Salonu'na ilk girdiğimizde kararımız kesinleşmişti. Düğün günü ise hayal ettiğimizin ötesindeydi; koordinatörümüz Elif adeta bir orkestra şefiydi.",
    name: "Zeynep & Can",
    date: "Eylül 2025",
    venue: "Boğaz Salonu",
    image: photos.kissBW,
  },
  {
    quote:
      "Yağmur yağdı ve Kış Bahçesi'nin cam tavanında ritim tuttu. Herkes 'bunu da siz mi planladınız' diye sordu. Hâlâ konuşuluyor.",
    name: "Deniz & Arda",
    date: "Kasım 2025",
    venue: "Kış Bahçesi",
    image: photos.stringLights,
  },
  {
    quote:
      "Kırk kişilik, küçük ama unutulmaz bir nikâh istiyorduk. Teras'ta gün batımı, caz ve şef masası. Mükemmel kelimesi hafif kalır.",
    name: "Selin & Mert",
    date: "Haziran 2025",
    venue: "Teras",
    image: photos.silhouette,
  },
];

export const faqs = [
  {
    q: "Tarih için ne kadar önceden rezervasyon yapmalıyız?",
    a: "Mayıs–Ekim arası cumartesi akşamları genellikle 12–14 ay önceden dolar. Hafta içi ve kış tarihleri için 4–6 ay yeterli olabilir. Takvimden anlık uygunluğu görebilirsiniz.",
  },
  {
    q: "Fiyatlandırma nasıl çalışıyor?",
    a: "Kişi başı menü bedeli ile salon kullanım bedelinin toplamı üzerinden, sezon ve güne göre değişen bir fiyatlandırma uygularız. Dekor, müzik ve fotoğraf hizmetleri modüler olarak eklenir; sürpriz kalem yoktur.",
  },
  {
    q: "Kendi tedarikçilerimizle çalışabilir miyiz?",
    a: "Evet. Fotoğrafçı, DJ ve pasta gibi kalemlerde dış tedarikçi kabul ederiz. Mutfak ve bar hizmeti ise kalite ve gıda güvenliği nedeniyle yalnızca Serenad ekibi tarafından verilir.",
  },
  {
    q: "Yağmur ihtimaline karşı planınız nedir?",
    a: "Teras ve bahçe etkinliklerinde, aynı tarih için kapalı alan garantisi veririz. Karar, etkinlikten 6 saat önce meteoroloji verisiyle birlikte sizinle alınır.",
  },
  {
    q: "Menü tadımı ne zaman yapılıyor?",
    a: "Sözleşme sonrası, etkinlikten 2–3 ay önce şefimizle birlikte özel tadım oturumu düzenlenir. Tadım 6 kişiye kadar ücretsizdir.",
  },
];

export const stats = [
  { value: 1200, suffix: "+", label: "Düğün & davet" },
  { value: 18, suffix: "", label: "Yıllık ustalık" },
  { value: 3, suffix: "", label: "Eşsiz salon" },
  { value: 4.9, suffix: "", label: "Misafir puanı", decimals: 1 },
];
