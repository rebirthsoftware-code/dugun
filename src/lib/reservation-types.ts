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

export const statusLabels: Record<ReservationStatus, string> = {
  new: "Yeni",
  contacted: "Görüşüldü",
  confirmed: "Onaylandı",
  cancelled: "İptal",
};
