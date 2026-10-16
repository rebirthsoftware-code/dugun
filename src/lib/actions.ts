"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { inquirySchema } from "./schema";
import { dayAvailability, isEventSlug, monthAvailability, type DayAvailability } from "./availability";
import { getEventType } from "./data";
import { addReservation, getOccupancy } from "./reservations";

export type InquiryState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors: Record<string, string> }
  | {
      status: "success";
      reference: string;
      summary: { venue: string; date: string; guests: number; name: string };
    };

/** Form gönderimini doğrular ve randevu talebini kaydeder. */
export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = inquirySchema.safeParse(raw);

  if (!parsed.success) {
    const flat = z.flattenError(parsed.error);
    const fieldErrors: Record<string, string> = {};
    for (const [k, v] of Object.entries(flat.fieldErrors)) {
      if (v?.[0]) fieldErrors[k] = v[0];
    }
    return { status: "error", message: "Lütfen işaretli alanları kontrol edin.", fieldErrors };
  }

  const data = parsed.data;
  if (data.website) {
    // Bot tuzağı: sessizce "başarılı" dön.
    return { status: "success", reference: "KNK-0000", summary: { venue: "", date: data.date, guests: data.guests, name: data.name } };
  }

  const occupancy = await getOccupancy();
  const availability = dayAvailability(data.date, occupancy);
  if (availability.status === "booked" || availability.status === "past") {
    return {
      status: "error",
      message: "Seçtiğiniz tarih uygun değil. Lütfen takvimden başka bir gün seçin.",
      fieldErrors: { date: "Bu tarih dolu." },
    };
  }

  const saved = await addReservation({
    name: data.name,
    phone: data.phone,
    email: data.email,
    eventType: data.venue,
    date: data.date,
    guests: data.guests,
    message: data.message || undefined,
  });

  revalidatePath("/panel");
  revalidatePath("/panel/randevular");

  return {
    status: "success",
    reference: saved.id,
    summary: {
      venue: getEventType(data.venue)?.name ?? data.venue,
      date: data.date,
      guests: data.guests,
      name: data.name,
    },
  };
}

/** Takvim bileşeni için aylık uygunluk haritası. */
export async function getMonthAvailability(year: number, month: number, venue: string): Promise<DayAvailability[]> {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12 || !isEventSlug(venue)) {
    return [];
  }
  const occupancy = await getOccupancy();
  return monthAvailability(year, month, occupancy);
}
