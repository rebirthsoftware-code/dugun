/**
 * Uygunluk: gerçek rezervasyon ve kapatma verisinden türetilir.
 * Tek salon olduğu için uygunluk güne bağlıdır; etkinlik türünden bağımsızdır.
 */
import { eventTypes } from "./data";

export type Availability = "available" | "limited" | "booked" | "past";

export type DayAvailability = {
  date: string; // YYYY-MM-DD
  status: Availability;
  weekend: boolean;
};

export function isEventSlug(slug: string) {
  return eventTypes.some((v) => v.slug === slug);
}

export function toISODate(d: Date) {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

export function dayAvailability(
  dateISO: string,
  occupancy: { booked: Set<string>; pending: Set<string> },
  today = new Date(),
): DayAvailability {
  const [y, m, d] = dateISO.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const todayUTC = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const dow = date.getUTCDay();
  const weekend = dow === 5 || dow === 6 || dow === 0;
  if (date.getTime() < todayUTC) return { date: dateISO, status: "past", weekend };
  if (occupancy.booked.has(dateISO)) return { date: dateISO, status: "booked", weekend };
  if (occupancy.pending.has(dateISO)) return { date: dateISO, status: "limited", weekend };
  return { date: dateISO, status: "available", weekend };
}

export function monthAvailability(
  year: number,
  month: number,
  occupancy: { booked: Set<string>; pending: Set<string> },
  today = new Date(),
) {
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const out: DayAvailability[] = [];
  for (let d = 1; d <= days; d++) {
    const iso = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    out.push(dayAvailability(iso, occupancy, today));
  }
  return out;
}
