import { dbGet, dbSet } from "./db";

export type ReservationStatus = "new" | "contacted" | "confirmed" | "cancelled";

export type Reservation = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  eventType: string;
  date: string; // YYYY-MM-DD
  guests: number;
  message?: string;
  status: ReservationStatus;
  note?: string;
};

const KEY = "konak:reservations";
const BLOCKED_KEY = "konak:blocked";

export const statusLabels: Record<ReservationStatus, string> = {
  new: "Yeni",
  contacted: "Görüşüldü",
  confirmed: "Onaylandı",
  cancelled: "İptal",
};

export async function listReservations(): Promise<Reservation[]> {
  const all = (await dbGet<Reservation[]>(KEY)) ?? [];
  return [...all].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function addReservation(r: Omit<Reservation, "id" | "createdAt" | "status">): Promise<Reservation> {
  const all = (await dbGet<Reservation[]>(KEY)) ?? [];
  const id = `R${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
  const item: Reservation = { ...r, id, createdAt: new Date().toISOString(), status: "new" };
  all.push(item);
  await dbSet(KEY, all);
  return item;
}

export async function updateReservation(id: string, patch: Partial<Reservation>) {
  const all = (await dbGet<Reservation[]>(KEY)) ?? [];
  const i = all.findIndex((r) => r.id === id);
  if (i === -1) return null;
  all[i] = { ...all[i], ...patch };
  await dbSet(KEY, all);
  return all[i];
}

export async function deleteReservation(id: string) {
  const all = (await dbGet<Reservation[]>(KEY)) ?? [];
  await dbSet(
    KEY,
    all.filter((r) => r.id !== id),
  );
}

/** Yönetici tarafından kapatılan günler (YYYY-MM-DD). */
export async function listBlockedDates(): Promise<string[]> {
  return (await dbGet<string[]>(BLOCKED_KEY)) ?? [];
}

export async function toggleBlockedDate(date: string) {
  const all = new Set(await listBlockedDates());
  if (all.has(date)) all.delete(date);
  else all.add(date);
  const next = [...all].sort();
  await dbSet(BLOCKED_KEY, next);
  return next;
}

/** Tek salon: bir gün için onaylı rezervasyon ya da kapatma varsa o gün doludur. */
export async function getOccupancy() {
  const [reservations, blocked] = await Promise.all([listReservations(), listBlockedDates()]);
  const booked = new Set<string>(blocked);
  const pending = new Set<string>();
  for (const r of reservations) {
    if (r.status === "confirmed") booked.add(r.date);
    else if (r.status === "new" || r.status === "contacted") pending.add(r.date);
  }
  return { booked, pending, reservations, blocked };
}
