/**
 * Talep ve uygunluk mantığı.
 *
 * Site GitHub Pages'te statik olarak yayınlandığı için bu fonksiyonlar tarayıcıda çalışır.
 * Bir Node.js ortamına (Vercel vb.) taşındığında dosyanın başına "use server" eklenerek
 * aynı imzayla Server Action'a dönüştürülebilir; bileşen tarafında değişiklik gerekmez.
 */
import { z } from "zod";
import { inquirySchema } from "./schema";
import { dayAvailability, isVenueSlug, monthAvailability, type DayAvailability } from "./availability";
import { getVenue } from "./data";

export type InquiryState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors: Record<string, string> }
  | {
      status: "success";
      reference: string;
      summary: { venue: string; date: string; guests: number; name: string };
    };

/** Form gönderimini doğrular ve "talep kaydı" oluşturur. */
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
    // Bot tuzağına takıldı; sessizce "başarılı" dön.
    return {
      status: "success",
      reference: "SRN-0000",
      summary: { venue: "", date: data.date, guests: data.guests, name: data.name },
    };
  }

  const availability = dayAvailability(data.date, data.venue);
  if (availability.status === "booked" || availability.status === "past") {
    return {
      status: "error",
      message: "Seçtiğiniz tarih bu salon için uygun değil. Lütfen takvimden başka bir gün seçin.",
      fieldErrors: { date: "Bu tarih dolu." },
    };
  }

  // Entegrasyon noktası: NEXT_PUBLIC_INQUIRY_ENDPOINT tanımlıysa (örn. Formspree / Web3Forms)
  // talep oraya iletilir; tanımlı değilse demo amaçlı gecikme simüle edilir.
  const endpoint = process.env.NEXT_PUBLIC_INQUIRY_ENDPOINT;
  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...data, website: undefined }),
      });
      if (!res.ok) throw new Error(String(res.status));
    } catch {
      return {
        status: "error",
        message: "Talebiniz iletilemedi. Lütfen bizi telefonla arayın ya da daha sonra tekrar deneyin.",
        fieldErrors: {},
      };
    }
  } else {
    await new Promise((r) => setTimeout(r, 900));
  }

  const reference =
    "SRN-" +
    Math.abs(
      [...`${data.email}${data.date}${data.venue}`].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7),
    )
      .toString(36)
      .toUpperCase()
      .slice(0, 6);

  console.info("[inquiry]", { reference, ...data, message: undefined });

  return {
    status: "success",
    reference,
    summary: {
      venue: getVenue(data.venue)?.name ?? data.venue,
      date: data.date,
      guests: data.guests,
      name: data.name,
    },
  };
}

/** Takvim bileşeni için aylık uygunluk haritası (Server Function). */
export async function getMonthAvailability(
  year: number,
  month: number,
  venue: string,
): Promise<DayAvailability[]> {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12 || !isVenueSlug(venue)) {
    return [];
  }
  return monthAvailability(year, month, venue);
}
