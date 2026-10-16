import { dbGet, dbUpdate } from "./db";

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
  /** Trafik kaynağı: utm parametreleri / fbclid / yönlendiren (reklam ölçümü) */
  source?: string;
};

const KEY = "konak:reservations";
const BLOCKED_KEY = "konak:blocked";

export const statusLabels: Record<ReservationStatus, string> = {
  new: "Yeni",
  contacted: "Görüşüldü",
  confirmed: "Onaylandı",
  cancelled: "İptal",
};

/** Panel sayfaları `fresh: true` ile her zaman güncel veriyi okur. */
export async function listReservations(opts: { fresh?: boolean } = {}): Promise<Reservation[]> {
  const all = (await dbGet<Reservation[]>(KEY, opts)) ?? [];
  return [...all].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function addReservation(r: Omit<Reservation, "id" | "createdAt" | "status">): Promise<Reservation> {
  const id = `R${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
  const item: Reservation = { ...r, id, createdAt: new Date().toISOString(), status: "new" };
  await dbUpdate<Reservation[]>(KEY, (all) => [...(all ?? []), item]);
  return item;
}

export async function updateReservation(id: string, patch: Partial<Reservation>) {
  let updated: Reservation | null = null;
  await dbUpdate<Reservation[]>(KEY, (all) =>
    (all ?? []).map((r) => {
      if (r.id !== id) return r;
      updated = { ...r, ...patch };
      return updated;
    }),
  );
  return updated;
}

export async function deleteReservation(id: string) {
  await dbUpdate<Reservation[]>(KEY, (all) => (all ?? []).filter((r) => r.id !== id));
}

/** Yönetici tarafından kapatılan günler (YYYY-MM-DD). */
export async function listBlockedDates(opts: { fresh?: boolean } = {}): Promise<string[]> {
  return (await dbGet<string[]>(BLOCKED_KEY, opts)) ?? [];
}

export async function toggleBlockedDate(date: string) {
  return dbUpdate<string[]>(BLOCKED_KEY, (all) => {
    const set = new Set(all ?? []);
    if (set.has(date)) set.delete(date);
    else set.add(date);
    return [...set].sort();
  });
}

/** Tek salon: bir gün için onaylı rezervasyon ya da kapatma varsa o gün doludur. */
export async function getOccupancy(opts: { fresh?: boolean } = {}) {
  const [reservations, blocked] = await Promise.all([listReservations(opts), listBlockedDates(opts)]);
  const booked = new Set<string>(blocked);
  const pending = new Set<string>();
  for (const r of reservations) {
    if (r.status === "confirmed") booked.add(r.date);
    else if (r.status === "new" || r.status === "contacted") pending.add(r.date);
  }
  return { booked, pending, reservations, blocked };
}
