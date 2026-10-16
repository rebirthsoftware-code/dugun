import { cache } from "react";
import { dbGet, dbSet } from "./db";
import {
  eventTypes as defaultEventTypes,
  services as defaultServices,
  timeline as defaultTimeline,
  gallery as defaultGallery,
  testimonials as defaultTestimonials,
  faqs as defaultFaqs,
  stats as defaultStats,
  photos,
  type EventType,
  type Service,
} from "./data";
import { SITE as DEFAULT_SITE } from "./utils";

export type SiteInfo = {
  name: string;
  fullName: string;
  tagline: string;
  description: string;
  city: string;
  district: string;
  phone: string;
  phoneHref: string;
  whatsapp: string;
  address: string;
  addressFull: string;
  mapsHref: string;
  coords: string;
  instagram: string;
  email: string;
};

export type HeroContent = {
  eyebrow: string;
  lines: [string, string, string];
  text: string;
  image: string;
  imageAlt: string;
  caption: string;
  captionSub: string;
};

export type IntroContent = {
  heading: string;
  text: string;
  image: string;
  imageCaption: string;
  imageCaptionRight: string;
};

export type Stat = { value: number; suffix: string; label: string; decimals?: number };
export type TimelineItem = { time: string; title: string; text: string; image: string };
export type GalleryItem = { src: string; alt: string; w: number; h: number };
export type Testimonial = { quote: string; name: string; date: string; venue: string; image: string };
export type Faq = { q: string; a: string };
export type CtaContent = { eyebrow: string; title: string; text: string; image: string };

export type SiteContent = {
  site: SiteInfo;
  hero: HeroContent;
  intro: IntroContent;
  stats: Stat[];
  eventTypes: EventType[];
  services: Service[];
  timeline: TimelineItem[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  faqs: Faq[];
  cta: CtaContent;
  updatedAt?: string;
};

export const defaultContent: SiteContent = {
  site: {
    name: DEFAULT_SITE.name,
    fullName: DEFAULT_SITE.fullName,
    tagline: DEFAULT_SITE.tagline,
    description: DEFAULT_SITE.description,
    city: DEFAULT_SITE.city,
    district: DEFAULT_SITE.district,
    phone: DEFAULT_SITE.phone,
    phoneHref: DEFAULT_SITE.phoneHref,
    whatsapp: DEFAULT_SITE.whatsapp,
    address: DEFAULT_SITE.address,
    addressFull: DEFAULT_SITE.addressFull,
    mapsHref: DEFAULT_SITE.mapsHref,
    coords: DEFAULT_SITE.coords,
    instagram: "",
    email: "",
  },
  hero: {
    eyebrow: "Düğün Salonu · Meydan, Trabzon",
    lines: ["Hayatınızın", "en güzel", "günü."],
    text: "Trabzon’un kalbinde, Meydan’da. Düğün, nişan, kına, matine ve toplantılarınız için tek adres: Konak.",
    image: photos.silhouette,
    imageAlt: "Altın saatte bir çift, Konak Düğün Salonu",
    caption: "Konak Düğün Salonu",
    captionSub: "Meydan · Trabzon",
  },
  intro: {
    heading: "Bir düğün, iki ailenin ilk ortak hatırasıdır. Biz o hatırayı ışıkla, müzikle ve zamanla işleriz.",
    text: "Trabzon Meydan’da, şehrin tam merkezinde; düğünden nişana, kınadan matineye ve kurumsal toplantıya her etkinliğe ayrı bir sahne kuruyoruz. Tek ekip, tek koordinatör ve sürpriz bırakmayan bir plan. Gecenin sonunda konuklarınız yalnızca bir şeyi hatırlar: nasıl hissettiklerini.",
    image: photos.kissBW,
    imageCaption: "Büşra & Emre · Eylül 2025",
    imageCaptionRight: "Konak · Düğün",
  },
  stats: defaultStats,
  eventTypes: defaultEventTypes,
  services: defaultServices,
  timeline: defaultTimeline,
  gallery: defaultGallery,
  testimonials: defaultTestimonials,
  faqs: defaultFaqs,
  cta: {
    eyebrow: "Bir tur, bir sohbet, bir hayal",
    title: "Hikâyenizi birlikte yazalım.",
    text: "Salonu gezmek ve tarihinizi konuşmak için sizi Meydan’a bekliyoruz.",
    image: photos.silhouette,
  },
};

const KEY = "konak:content";

function merge<T extends Record<string, unknown>>(base: T, over: Partial<T> | null | undefined): T {
  if (!over) return base;
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(over)) {
    const b = (base as Record<string, unknown>)[k];
    if (v && typeof v === "object" && !Array.isArray(v) && b && typeof b === "object" && !Array.isArray(b)) {
      out[k] = merge(b as Record<string, unknown>, v as Record<string, unknown>);
    } else if (v !== undefined) {
      out[k] = v;
    }
  }
  return out as T;
}

/** Kayıtlı içerik varsayılanların üzerine bindirilir; eksik alanlar varsayılandan tamamlanır. */
export const getContent = cache(async (): Promise<SiteContent> => {
  const stored = await dbGet<Partial<SiteContent>>(KEY);
  return merge(defaultContent, stored);
});

export async function saveContent(patch: Partial<SiteContent>) {
  const stored = (await dbGet<Partial<SiteContent>>(KEY)) ?? {};
  const next = { ...stored, ...patch, updatedAt: new Date().toISOString() };
  await dbSet(KEY, next);
  return next;
}

export async function resetSection<K extends keyof SiteContent>(key: K) {
  const stored = (await dbGet<Partial<SiteContent>>(KEY)) ?? {};
  delete stored[key];
  await dbSet(KEY, { ...stored, updatedAt: new Date().toISOString() });
}
