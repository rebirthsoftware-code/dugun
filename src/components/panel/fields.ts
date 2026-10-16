import type { SiteContent } from "@/lib/content";

export type FieldType = "text" | "textarea" | "number" | "image" | "url" | "color" | "strings" | "lines3";
export type Field = { key: string; label: string; type: FieldType; hint?: string; width?: "half" | "full" };
export type SectionDef = {
  key: keyof SiteContent;
  title: string;
  description: string;
  kind: "object" | "array";
  fields: Field[];
  itemTitle?: string; // dizi öğelerinde başlık olarak kullanılacak alan
};

export const sections: SectionDef[] = [
  {
    key: "site",
    title: "Genel bilgiler",
    description: "İsim, iletişim ve adres. Üst menü, altbilgi, arama motoru verisi ve WhatsApp bağlantıları buradan beslenir.",
    kind: "object",
    fields: [
      { key: "name", label: "Kısa ad", type: "text", width: "half" },
      { key: "fullName", label: "Tam ad", type: "text", width: "half" },
      { key: "tagline", label: "Slogan", type: "text" },
      { key: "description", label: "Açıklama (Google)", type: "textarea" },
      { key: "phone", label: "Telefon (görünen)", type: "text", width: "half" },
      { key: "phoneHref", label: "Telefon bağlantısı", type: "text", width: "half", hint: "tel:+905367265753" },
      { key: "whatsapp", label: "WhatsApp bağlantısı", type: "url", hint: "https://wa.me/905367265753?text=..." },
      { key: "email", label: "E-posta (boş bırakılabilir)", type: "text", width: "half" },
      { key: "instagram", label: "Instagram (boş bırakılabilir)", type: "url", width: "half" },
      { key: "address", label: "Adres (kısa)", type: "text" },
      { key: "addressFull", label: "Adres (tam)", type: "text" },
      { key: "mapsHref", label: "Harita bağlantısı", type: "url" },
      { key: "city", label: "Şehir", type: "text", width: "half" },
      { key: "district", label: "İlçe / semt", type: "text", width: "half" },
      { key: "coords", label: "Koordinat etiketi", type: "text", hint: "41°00′N 39°43′E" },
      { key: "metaPixelId", label: "Meta Pixel ID (reklam ölçümü)", type: "text", hint: "Events Manager → Veri kaynakları → Pixel kimliği" },
    ],
  },
  {
    key: "hero",
    title: "Giriş (hero)",
    description: "Ana sayfanın en üstü: üç satırlık başlık, kısa metin ve büyük fotoğraf.",
    kind: "object",
    fields: [
      { key: "eyebrow", label: "Üst etiket", type: "text" },
      { key: "lines", label: "Başlık (3 satır, ortadaki altın italik)", type: "lines3" },
      { key: "text", label: "Kısa metin", type: "textarea" },
      { key: "image", label: "Fotoğraf", type: "image" },
      { key: "imageAlt", label: "Fotoğraf açıklaması (erişilebilirlik)", type: "text" },
      { key: "caption", label: "Fotoğraf üstü başlık", type: "text", width: "half" },
      { key: "captionSub", label: "Fotoğraf üstü alt etiket", type: "text", width: "half" },
    ],
  },
  {
    key: "intro",
    title: "Tanıtım",
    description: "Hero'nun altındaki siyah-beyaz fotoğraflı tanıtım bölümü.",
    kind: "object",
    fields: [
      { key: "heading", label: "Büyük başlık", type: "textarea" },
      { key: "text", label: "Paragraf", type: "textarea" },
      { key: "image", label: "Fotoğraf", type: "image" },
      { key: "imageCaption", label: "Fotoğraf altı (sol)", type: "text", width: "half" },
      { key: "imageCaptionRight", label: "Fotoğraf altı (sağ)", type: "text", width: "half" },
    ],
  },
  {
    key: "stats",
    title: "Sayılar",
    description: "Tanıtım bölümündeki dört sayaç.",
    kind: "array",
    itemTitle: "label",
    fields: [
      { key: "value", label: "Değer", type: "number", width: "half" },
      { key: "suffix", label: "Sonek (+, /7 vb.)", type: "text", width: "half" },
      { key: "label", label: "Etiket", type: "text", width: "half" },
      { key: "decimals", label: "Ondalık basamak", type: "number", width: "half" },
    ],
  },
  {
    key: "eventTypes",
    title: "Etkinlikler",
    description: "Düğün, nişan, kına, matine, toplantı. Her birinin kendi sayfası vardır; 'slug' adres parçasıdır (dugun, nisan...).",
    kind: "array",
    itemTitle: "name",
    fields: [
      { key: "index", label: "Sıra etiketi", type: "text", width: "half", hint: "01" },
      { key: "slug", label: "Adres (slug)", type: "text", width: "half", hint: "dugun" },
      { key: "name", label: "Ad", type: "text", width: "half" },
      { key: "subtitle", label: "Alt başlık", type: "text", width: "half" },
      { key: "capacity", label: "Kapasite (kişi)", type: "number", width: "half" },
      { key: "duration", label: "Süre", type: "text", width: "half" },
      { key: "format", label: "Düzen", type: "text", width: "half" },
      { key: "accent", label: "Vurgu rengi", type: "color", width: "half" },
      { key: "description", label: "Kısa açıklama", type: "textarea" },
      { key: "story", label: "Uzun anlatım (detay sayfası)", type: "textarea" },
      { key: "features", label: "Özellikler (her satıra bir madde)", type: "strings" },
      { key: "image", label: "Kapak fotoğrafı", type: "image" },
      { key: "gallery", label: "Detay sayfası galerisi (her satıra bir bağlantı)", type: "strings" },
    ],
  },
  {
    key: "services",
    title: "Hizmetler (Deneyim)",
    description: "Ana sayfadaki hizmet listesi; üzerine gelince sağda görseli değişir.",
    kind: "array",
    itemTitle: "title",
    fields: [
      { key: "id", label: "Kimlik", type: "text", width: "half", hint: "dekor" },
      { key: "eyebrow", label: "Üst etiket", type: "text", width: "half" },
      { key: "title", label: "Başlık", type: "text" },
      { key: "text", label: "Metin", type: "textarea" },
      { key: "image", label: "Görsel", type: "image" },
    ],
  },
  {
    key: "timeline",
    title: "Günün akışı",
    description: "Saat saat ilerleyen kart şeridi.",
    kind: "array",
    itemTitle: "title",
    fields: [
      { key: "time", label: "Saat", type: "text", width: "half" },
      { key: "title", label: "Başlık", type: "text", width: "half" },
      { key: "text", label: "Metin", type: "textarea" },
      { key: "image", label: "Görsel", type: "image" },
    ],
  },
  {
    key: "gallery",
    title: "Galeri",
    description: "Galeri sayfası ve ana sayfa önizlemesi. En boy oranı için genişlik/yükseklik (örn. 4 ve 5).",
    kind: "array",
    itemTitle: "alt",
    fields: [
      { key: "src", label: "Fotoğraf bağlantısı", type: "image" },
      { key: "alt", label: "Açıklama", type: "text" },
      { key: "w", label: "Genişlik oranı", type: "number", width: "half" },
      { key: "h", label: "Yükseklik oranı", type: "number", width: "half" },
    ],
  },
  {
    key: "testimonials",
    title: "Çiftlerin yorumları",
    description: "Otomatik dönen alıntılar.",
    kind: "array",
    itemTitle: "name",
    fields: [
      { key: "quote", label: "Alıntı", type: "textarea" },
      { key: "name", label: "İsim", type: "text", width: "half" },
      { key: "date", label: "Tarih", type: "text", width: "half" },
      { key: "venue", label: "Etkinlik türü", type: "text", width: "half" },
      { key: "image", label: "Fotoğraf", type: "image" },
    ],
  },
  {
    key: "faqs",
    title: "Sık sorulanlar",
    description: "Soru-cevap listesi. Google'a da yapılandırılmış veri olarak gönderilir.",
    kind: "array",
    itemTitle: "q",
    fields: [
      { key: "q", label: "Soru", type: "text" },
      { key: "a", label: "Cevap", type: "textarea" },
    ],
  },
  {
    key: "cta",
    title: "Davet bloğu",
    description: "Sayfa sonundaki koyu, fotoğraflı davet alanı.",
    kind: "object",
    fields: [
      { key: "eyebrow", label: "Üst etiket", type: "text" },
      { key: "title", label: "Başlık", type: "text" },
      { key: "text", label: "Metin", type: "textarea" },
      { key: "image", label: "Arka plan fotoğrafı", type: "image" },
    ],
  },
];
