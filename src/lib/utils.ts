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
  name: "Serenad",
  fullName: "Serenad Davet & Balo Salonu",
  tagline: "Hayatınızın en güzel gecesi, bir senfoni gibi.",
  description:
    "Boğaz'a nazır üç eşsiz salon, yıldızlı mutfak ve 18 yıllık ustalık. Serenad, İstanbul'un en seçkin düğün ve davet adresi.",
  url: "https://rebirthsoftware-code.github.io/dugun",
  phone: "+90 212 000 00 00",
  phoneHref: "tel:+902120000000",
  email: "merhaba@serenad.com.tr",
  address: "Kuruçeşme Cad. No: 1, Beşiktaş / İstanbul",
  mapsHref: "https://maps.google.com/?q=Kuru%C3%A7e%C5%9Fme%20%C4%B0stanbul",
  instagram: "https://instagram.com",
  founded: 2008,
} as const;
