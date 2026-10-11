import { unsplash } from "./utils";

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
    image: unsplash("1510076857177-7470076d4098"),
    gallery: [
      unsplash("1464366400600-7168b8af9bc3"),
      unsplash("1511795409834-ef04bbd61622"),
      unsplash("1525772764200-be829a350797"),
      unsplash("1505236858219-8359eb29e329"),
    ],
    accent: "#D4B483",
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
    image: unsplash("1502635385003-ee1e6a1a742d"),
    gallery: [
      unsplash("1529636798458-92182e662485"),
      unsplash("1469371670807-013ccf25f16a"),
      unsplash("1519225421980-715cb0215aed"),
      unsplash("1522673607200-164d1b6ce486"),
    ],
    accent: "#9DB5A3",
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
    image: unsplash("1527838832700-5059252407fa"),
    gallery: [
      unsplash("1537633552985-df8429e8048b"),
      unsplash("1519671482749-fd09be7ccebf"),
      unsplash("1541432901042-2d8bd64b4a9b"),
      unsplash("1515169067868-5387ec356754"),
    ],
    accent: "#C98A8A",
    index: "03",
  },
];

export function getVenue(slug: string) {
  return venues.find((v) => v.slug === slug);
}

export type Service = {
  id: string;
  title: string;
  eyebrow: string;
  text: string;
  image: string;
};

export const services: Service[] = [
  {
    id: "gastronomi",
    eyebrow: "Mutfak",
    title: "Gastronomi",
    text: "Michelin tecrübeli şef ekibimiz, menüyü hikâyenize göre yazar. Anadolu'dan Akdeniz'e, yedi tadım oturumundan sonra son hâlini alır.",
    image: unsplash("1600891964599-f61ba0e24092"),
  },
  {
    id: "dekor",
    eyebrow: "Tasarım",
    title: "Dekor & Çiçek",
    text: "Kendi atölyemizde her davet için sıfırdan tasarlanan masa düzeni, çiçek enstalasyonları ve ışık mimarisi.",
    image: unsplash("1525772764200-be829a350797"),
  },
  {
    id: "muzik",
    eyebrow: "Sahne",
    title: "Müzik & Işık",
    text: "Orkestradan DJ'e, lazer haritalamadan mum ışığına. Gecenin ritmini profesyonel sahne ekibimiz kurar.",
    image: unsplash("1470229722913-7c0e2dbbafd3"),
  },
  {
    id: "planlama",
    eyebrow: "Koordinasyon",
    title: "Planlama",
    text: "İlk görüşmeden son dansa kadar tek bir isim: size özel düğün koordinatörünüz. Zaman çizelgesi, tedarikçi, prova ve kriz yönetimi.",
    image: unsplash("1519741497674-611481863552"),
  },
  {
    id: "konaklama",
    eyebrow: "Misafirperverlik",
    title: "Konaklama & Ulaşım",
    text: "Anlaşmalı butik oteller, vale, konuk transferi ve Boğaz'dan tekne ile giriş. Konuklarınız yalnızca kutlamayı düşünür.",
    image: unsplash("1524231757912-21f4fe3a7200"),
  },
];

export const gallery = [
  { src: unsplash("1583939003579-730e3918a45a"), alt: "Konfeti altında çıkış", w: 4, h: 5 },
  { src: unsplash("1546032996-6dfacbacbf3f"), alt: "Duvak altında ilk bakış", w: 3, h: 4 },
  { src: unsplash("1511795409834-ef04bbd61622"), alt: "Masa düzeni ve kristal", w: 4, h: 3 },
  { src: unsplash("1520854221256-17451cc331bf"), alt: "El ele", w: 4, h: 5 },
  { src: unsplash("1505236858219-8359eb29e329"), alt: "Gece yarısı dans", w: 3, h: 4 },
  { src: unsplash("1529636798458-92182e662485"), alt: "Çiçek takı", w: 4, h: 5 },
  { src: unsplash("1606800052052-a08af7148866"), alt: "Yüzükler", w: 4, h: 3 },
  { src: unsplash("1591604466107-ec97de577aff"), alt: "Çiftin portresi", w: 3, h: 4 },
  { src: unsplash("1469371670807-013ccf25f16a"), alt: "Nikâh yolu", w: 4, h: 5 },
  { src: unsplash("1519671482749-fd09be7ccebf"), alt: "Kadeh kaldırma", w: 4, h: 3 },
  { src: unsplash("1550005809-91ad75fb315f"), alt: "Gelin buketi", w: 3, h: 4 },
  { src: unsplash("1492684223066-81342ee5ff30"), alt: "Konfeti ve ışık", w: 4, h: 3 },
];

export const testimonials = [
  {
    quote:
      "Boğaz Salonu'na ilk girdiğimizde kararımız kesinleşmişti. Düğün günü ise hayal ettiğimizin ötesindeydi; koordinatörümüz Elif adeta bir orkestra şefiydi.",
    name: "Zeynep & Can",
    date: "Eylül 2025",
    venue: "Boğaz Salonu",
  },
  {
    quote:
      "Yağmur yağdı ve Kış Bahçesi'nin cam tavanında ritim tuttu. Herkes 'bunu da siz mi planladınız' diye sordu. Hâlâ konuşuluyor.",
    name: "Deniz & Arda",
    date: "Kasım 2025",
    venue: "Kış Bahçesi",
  },
  {
    quote:
      "Kırk kişilik, küçük ama unutulmaz bir nikâh istiyorduk. Teras'ta gün batımı, caz ve şef masası. Mükemmel kelimesi hafif kalır.",
    name: "Selin & Mert",
    date: "Haziran 2025",
    venue: "Teras",
  },
];

export const faqs = [
  {
    q: "Tarih için ne kadar önceden rezervasyon yapmalıyız?",
    a: "Mayıs–Ekim arası cumartesi akşamları genellikle 12–14 ay önceden dolar. Hafta içi ve kış tarihleri için 4–6 ay yeterli olabilir. Aşağıdaki takvimden anlık uygunluğu görebilirsiniz.",
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

export const marqueeItems = [
  "Boğaz manzarası",
  "Yıldızlı mutfak",
  "600 kişilik balo salonu",
  "Cam tavanlı kış bahçesi",
  "Gün batımında nikâh",
  "Özel koordinatör",
];
