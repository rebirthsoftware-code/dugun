import { unsplash } from "./utils";

/* ------------------------------------------------------------------ */
/* Görsel kütüphanesi: tek yerden yönetilir, salonun kendi fotoğraflarıyla değiştirilir */
/* ------------------------------------------------------------------ */
export const photos = {
  ballroom: unsplash("1519167758481-83f550bb49b3"), // kristal avizeli salon
  silhouette: unsplash("1537907690979-ee8e01276184"), // altın saatte çift silueti
  kissBW: unsplash("1460978812857-470ed1c77af0"), // siyah-beyaz duvaklı öpücük
  darkTable: unsplash("1522413452208-996ff3f3e740"), // koyu tonlu masa düzeni
  stringLights: unsplash("1527529482837-4698179dc6ce"), // ışıklı akşam yemeği, kadeh
  ringsHands: unsplash("1529634806980-85c3dd6d34ac"), // yüzüklü eller, buket
  barBokeh: unsplash("1484156818044-c040038b0719"), // kadehler, bokeh
  sparklers: unsplash("1513725673171-537abba17912"), // maytap, gece kutlaması
  plate: unsplash("1470338950318-40320a722782"), // fine dining tabak
  fieldWalk: unsplash("1607190074257-dd4b7af0309f"), // gün batımında yürüyen çift
  wineToast: unsplash("1510812431401-41d2bd2722f3"), // kadehler
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
  bouquet: unsplash("1550005809-91ad75fb315f"),
  toast: unsplash("1519671482749-fd09be7ccebf"),
  confettiNight: unsplash("1505236858219-8359eb29e329"),
  candles: unsplash("1525772764200-be829a350797"),
  glasses: unsplash("1511795409834-ef04bbd61622"),
  coupleDark: unsplash("1519741497674-611481863552"),
  beachVeil: unsplash("1537633552985-df8429e8048b"),
  dinner: unsplash("1515169067868-5387ec356754"),
  party: unsplash("1492684223066-81342ee5ff30"),
} as const;

/* ------------------------------------------------------------------ */
/* Etkinlik türleri                                                     */
/* ------------------------------------------------------------------ */
export type EventType = {
  slug: string;
  name: string;
  subtitle: string;
  capacity: number;
  duration: string;
  format: string;
  description: string;
  story: string;
  features: string[];
  image: string;
  gallery: string[];
  accent: string;
  index: string;
};

export const eventTypes: EventType[] = [
  {
    slug: "dugun",
    name: "Düğün",
    subtitle: "Büyük gün",
    capacity: 600,
    duration: "3 saat",
    format: "Oturmalı",
    description:
      "Kristal avizeler, geniş dans pisti ve profesyonel sahne ile Trabzon'da hayalinizdeki düğün gecesi.",
    story:
      "Konak'ta düğün, kapıdan girdiğiniz anda başlar. Gelin odası, karşılama, ilk dans ve takı töreni tek bir ekip tarafından saniyesine kadar planlanır. Horon halkası kurulduğunda ışık ve ses sistemi geceye eşlik eder; misafirleriniz yalnızca kutlamayı düşünür.",
    features: [
      "600 kişiye kadar oturmalı düzen",
      "Geniş dans pisti ve profesyonel sahne",
      "Gelin odası ve damat lounge",
      "LED ışık mimarisi ve ses sistemi",
      "Volta ve maytap gösterisi",
      "Şehir merkezinde kolay ulaşım",
    ],
    image: photos.kissBW,
    gallery: [photos.confettiExit, photos.veil, photos.fieldWalk, photos.hands],
    accent: "#c9a66b",
    index: "01",
  },
  {
    slug: "nisan",
    name: "Nişan",
    subtitle: "İlk adım",
    capacity: 600,
    duration: "3 saat",
    format: "Oturmalı",
    description: "Samimi, zarif ve iki ailenin ilk kez bir araya geldiği o özel güne yakışır bir atmosfer.",
    story:
      "Nişan, iki ailenin ilk ortak fotoğrafıdır. Konak'ta nişan masası, yüzük kurdelesi ve çiçek tasarımı çiftin hikâyesine göre kurgulanır. Dilerseniz tek bir masa etrafında, dilerseniz yüzlerce konukla.",
    features: [
      "600 kişiye kadar esnek düzen",
      "Nişan masası ve yüzük kurdele seremonisi",
      "Çiçek ve dekor tasarımı",
      "Canlı müzik ya da DJ seçeneği",
      "Fotoğraf köşesi",
      "Hafta içi özel fiyatlandırma",
    ],
    image: photos.ringsHands,
    gallery: [photos.goldRings, photos.ringsFlowers, photos.coupleBouquet, photos.ringsClose],
    accent: "#c98a8a",
    index: "02",
  },
  {
    slug: "kina",
    name: "Kına",
    subtitle: "Gelenek ve eğlence",
    capacity: 600,
    duration: "3 saat",
    format: "Oturmalı / sahne",
    description: "Kına tepsisinden horona, geleneği modern bir sahnede yaşatan unutulmaz bir gece.",
    story:
      "Kına gecesi, Karadeniz'de en çok coşkunun olduğu gecedir. Kına tahtı, bindallı ve tepsi seremonisi için sahne ışıkları özel olarak kurulur; kemençe ve davul için akustik hazırlık yapılır.",
    features: [
      "600 kişiye kadar düzen",
      "Kına tahtı ve seremoni ışıkları",
      "Kemençe, davul ve DJ için sahne",
      "Horon için geniş dans alanı",
      "Kına tepsisi seremonisi",
      "Bindallı için hazırlık odası",
    ],
    image: photos.silhouette,
    gallery: [photos.bouquet, photos.veil, photos.beachVeil, photos.hands],
    accent: "#b0574f",
    index: "03",
  },
  {
    slug: "matine",
    name: "Matine",
    subtitle: "Gündüz kutlaması",
    capacity: 600,
    duration: "3 saat",
    format: "Gündüz · oturmalı",
    description: "Gün ışığında, ailece ve rahat; kadınlar matinesi ve gündüz düğünleri için ferah bir salon.",
    story:
      "Matine, gündüz kutlamanın en keyifli hâlidir. Doğal ışık alan salonda canlı müzik ve çocuklar için güvenli alan ile aileler rahat eder.",
    features: [
      "600 kişiye kadar gündüz düzeni",
      "Doğal ışık ve klimalı salon",
      "Ferah ve klimalı salon",
      "Canlı müzik ya da DJ",
      "Çocuk alanı",
      "Hafta içi uygun fiyat",
    ],
    image: photos.coupleBouquet,
    gallery: [photos.bouquet, photos.fieldWalk, photos.ringsHands, photos.kissBW],
    accent: "#9db5a3",
    index: "04",
  },
  {
    slug: "toplanti",
    name: "Toplantı",
    subtitle: "Kurumsal",
    capacity: 600,
    duration: "3 saat",
    format: "Sınıf · U · tiyatro",
    description: "Lansman, seminer, bayi toplantısı ve kurumsal davetler için teknik altyapısı hazır bir salon.",
    story:
      "Konak, hafta içi kurumsal etkinliklere de ev sahipliği yapar. Projeksiyon, kablosuz mikrofon ve hızlı internet ile tam gün toplantılar için hazırdır.",
    features: [
      "600 kişiye kadar sınıf, U ya da tiyatro düzeni",
      "Projeksiyon, LED ekran ve ses sistemi",
      "Kablosuz mikrofon ve kürsü",
      "Hızlı Wi-Fi",
      "Ara düzenlemeleri için esnek program",
      "Şehir merkezinde kolay ulaşım",
    ],
    image: photos.beachVeil,
    gallery: [photos.hands, photos.goldRings, photos.silhouette, photos.confettiExit],
    accent: "#7a8ca3",
    index: "05",
  },
];

export function getEventType(slug: string) {
  return eventTypes.find((v) => v.slug === slug);
}

export type Service = { id: string; title: string; eyebrow: string; text: string; image: string };

export const services: Service[] = [
  {
    id: "dekor",
    eyebrow: "Tasarım",
    title: "Dekor & Çiçek",
    text: "Masa düzeni, nişan masası, kına tahtı ve çiçek tasarımı; her etkinlik için size özel kurulur.",
    image: photos.candles,
  },
  {
    id: "muzik",
    eyebrow: "Sahne",
    title: "Müzik & Işık",
    text: "Kemençeden DJ'e, LED ışık mimarisinden maytap gösterisine. Gecenin ritmini profesyonel ekibimiz kurar.",
    image: photos.sparklers,
  },
  {
    id: "planlama",
    eyebrow: "Koordinasyon",
    title: "Planlama",
    text: "İlk görüşmeden son dansa kadar tek bir isim: size özel koordinatörünüz. Zaman çizelgesi, tedarikçi ve prova.",
    image: photos.dress,
  },
  {
    id: "ulasim",
    eyebrow: "Konum",
    title: "Ulaşım",
    text: "Gazipaşa Mah. Cudibey Mektep Sok. No: 3/A, Meydan / Trabzon. Şehir merkezinde, toplu taşımaya ve ana caddelere yürüme mesafesinde.",
    image: photos.dinner,
  },
];

export const timeline = [
  { time: "15:00", title: "Hazırlık", text: "Gelin odasında kuaför, makyaj ve fotoğraf çekimi.", image: photos.bouquet },
  { time: "18:30", title: "Karşılama", text: "Konuk karşılama ve fotoğraf köşesi.", image: photos.hands },
  { time: "19:30", title: "Giriş", text: "Çiftin salona girişi, ilk dans ve ışık gösterisi.", image: photos.coupleBouquet },
  { time: "20:30", title: "Takı Töreni", text: "Takı merasimi ve aile fotoğrafları.", image: photos.goldRings },
  { time: "22:00", title: "Horon", text: "Kemençe, davul ve DJ. Pist dolar, ışıklar geceye döner.", image: photos.veil },
  { time: "00:30", title: "Uğurlama", text: "Maytaplı çıkış ve konuk uğurlama.", image: photos.confettiExit },
];

export const gallery = [
  { src: photos.kissBW, alt: "Duvak altında ilk öpücük", w: 4, h: 5 },
  { src: photos.silhouette, alt: "Altın saatte siluet", w: 3, h: 4 },
  { src: photos.goldRings, alt: "Yüzükler", w: 4, h: 3 },
  { src: photos.hands, alt: "El ele", w: 4, h: 5 },
  { src: photos.veil, alt: "Rüzgârda duvak", w: 3, h: 4 },
  { src: photos.coupleBouquet, alt: "Çiftin portresi", w: 4, h: 5 },
  { src: photos.ringsFlowers, alt: "Yüzük ve çiçek", w: 4, h: 3 },
  { src: photos.fieldWalk, alt: "Gün batımı yürüyüşü", w: 3, h: 4 },
  { src: photos.beachVeil, alt: "Deniz kenarında", w: 4, h: 5 },
  { src: photos.bouquet, alt: "Gelin buketi", w: 4, h: 3 },
  { src: photos.ringsHands, alt: "Yüzüklü eller", w: 3, h: 4 },
  { src: photos.confettiExit, alt: "Konfeti altında çıkış", w: 4, h: 3 },
];

export const testimonials = [
  {
    quote:
      "Konak'a ilk girdiğimizde kararımız kesinleşmişti. Düğün günü hayal ettiğimizin ötesindeydi; koordinatörümüz adeta bir orkestra şefiydi.",
    name: "Büşra & Emre",
    date: "Eylül 2025",
    venue: "Düğün",
    image: photos.kissBW,
  },
  {
    quote:
      "Kına gecemizde horon halkası hiç dağılmadı. Işık, ses, kemençe; her şey tam zamanında ve tam yerindeydi.",
    name: "Melisa & Burak",
    date: "Ağustos 2025",
    venue: "Kına",
    image: photos.silhouette,
  },
  {
    quote:
      "Nişanımız için samimi ama şık bir yer istiyorduk. Dekor ve ışık düzeni herkesin aklında kaldı. Teşekkürler Konak.",
    name: "Zeynep & Can",
    date: "Haziran 2025",
    venue: "Nişan",
    image: photos.ringsHands,
  },
];

export const faqs = [
  {
    q: "Tarih için ne kadar önceden rezervasyon yapmalıyız?",
    a: "Haziran–Eylül arası cumartesi akşamları genellikle 8–12 ay önceden dolar. Hafta içi, matine ve kış tarihleri için 2–4 ay yeterli olabilir. Takvimden anlık uygunluğu görebilirsiniz.",
  },
  {
    q: "Fiyatlandırma nasıl çalışıyor?",
    a: "Salon kullanım bedeli sezon, gün ve etkinlik türüne göre değişir. Dekor, müzik ve fotoğraf hizmetleri modüler olarak eklenir; sürpriz kalem yoktur.",
  },
  {
    q: "Kendi tedarikçilerimizle çalışabilir miyiz?",
    a: "Evet. Fotoğrafçı, DJ, kemençeci ve dekor gibi kalemlerde dış tedarikçi kabul ederiz. Ses ve ışık sistemi ise Konak ekibi tarafından işletilir.",
  },
  {
    q: "Etkinlik süresi ne kadar?",
    a: "Standart salon kullanım süresi 3 saattir. Hazırlık ve toplanma süreleri ayrıca planlanır; uzatma ihtiyacı için önceden görüşülür.",
  },
  {
    q: "Kına ve nişan için en az kaç kişi gerekiyor?",
    a: "Kına ve nişan için en az 50 kişi ile rezervasyon alıyoruz. Daha küçük gruplar için hafta içi özel düzenler sunabiliriz.",
  },
];

export const stats = [
  { value: 600, suffix: "", label: "Kişi kapasite" },
  { value: 5, suffix: "", label: "Etkinlik türü" },
  { value: 7, suffix: "/7", label: "Gün hizmet" },
  { value: 4.9, suffix: "", label: "Misafir puanı", decimals: 1 },
];
