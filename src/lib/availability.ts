/**
 * Deterministik uygunluk motoru.
 * Gerçek bir sistemde bu veriler veritabanından gelir; burada tarih + salon
 * bileşiminden türetilen kararlı bir karma (hash) ile, her istekte aynı sonucu
 * veren gerçekçi bir doluluk haritası üretilir.
 */
import { venues } from "./data";

export type Availability = "available" | "limited" | "booked" | "past";

export type DayAvailability = {
  date: string; // YYYY-MM-DD
  status: Availability;
  /** Kişi başı başlangıç fiyatı (₺) */
  priceFrom: number;
  season: "high" | "mid" | "low";
  weekend: boolean;
};

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

export function seasonOf(month: number): DayAvailability["season"] {
  if (month >= 5 && month <= 9) return "high";
  if (month === 4 || month === 10 || month === 12) return "mid";
  return "low";
}

const BASE_PRICE: Record<string, number> = {
  "bogaz-salonu": 4200,
  "kis-bahcesi": 3600,
  teras: 3900,
};

export function dayAvailability(dateISO: string, venueSlug: string, today = new Date()): DayAvailability {
  const [y, m, d] = dateISO.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const todayUTC = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const dow = date.getUTCDay();
  const weekend = dow === 5 || dow === 6;
  const season = seasonOf(m);

  const base = BASE_PRICE[venueSlug] ?? 3800;
  const seasonMul = season === "high" ? 1.25 : season === "mid" ? 1.1 : 1;
  const weekendMul = weekend ? 1.2 : 1;
  const priceFrom = Math.round((base * seasonMul * weekendMul) / 50) * 50;

  if (date.getTime() < todayUTC) {
    return { date: dateISO, status: "past", priceFrom, season, weekend };
  }

  const r = hash(`${venueSlug}:${dateISO}`);
  // Yoğun sezonda hafta sonları büyük oranda dolu; kışın hafta içi büyük oranda boş.
  const bookedProb = (season === "high" ? 0.55 : season === "mid" ? 0.35 : 0.15) + (weekend ? 0.25 : 0);
  const limitedProb = 0.15;

  let status: Availability = "available";
  if (r < bookedProb) status = "booked";
  else if (r < bookedProb + limitedProb) status = "limited";

  return { date: dateISO, status, priceFrom, season, weekend };
}

export function monthAvailability(year: number, month: number, venueSlug: string, today = new Date()) {
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const out: DayAvailability[] = [];
  for (let d = 1; d <= days; d++) {
    const iso = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    out.push(dayAvailability(iso, venueSlug, today));
  }
  return out;
}

export function isVenueSlug(slug: string) {
  return venues.some((v) => v.slug === slug);
}
