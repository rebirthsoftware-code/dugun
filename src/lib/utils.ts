import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Unsplash görsel URL'si üretir; boyut ve kalite next/image tarafından yönetilir. */
export function unsplash(id: string, w = 1600, extra = "") {
  return `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop${extra}`;
}

export const SITE = {
  name: "Konak",
  fullName: "Konak Düğün Salonu",
  tagline: "Hayatınızın en güzel günü, Konak'ta.",
  description:
    "Trabzon Ortahisar'da düğün, nişan, kına, matine ve toplantı organizasyonları için şık, ferah ve profesyonel bir salon.",
  url: "https://rebirthsoftware-code.github.io/dugun",
  city: "Trabzon",
  district: "Ortahisar",
  phone: "0 (536) 726 57 53",
  phoneHref: "tel:+905367265753",
  whatsapp: "https://wa.me/905367265753?text=Merhaba%2C%20Konak%20D%C3%BC%C4%9F%C3%BCn%20Salonu%20i%C3%A7in%20bilgi%20almak%20istiyorum.",
  address: "Gazipaşa Mah. Cudibey Mektep Sok. No: 3/A",
  addressFull: "Gazipaşa Mah. Cudibey Mektep Sok. No: 3/A, Ortahisar / Trabzon",
  mapsHref: "https://maps.google.com/?q=Gazipa%C5%9Fa%20Mah.%20Cudibey%20Mektep%20Sok.%20No%3A3%2FA%20Ortahisar%20Trabzon",
  coords: "41°00′N 39°43′E",
  geo: { lat: 41.0027, lng: 39.7168 },
} as const;
