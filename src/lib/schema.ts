import { z } from "zod";
import { eventTypes } from "./data";

const venueSlugs = eventTypes.map((v) => v.slug) as [string, ...string[]];

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Adınızı yazın.").max(80, "Çok uzun."),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s()-]{8,19}$/, "Geçerli bir telefon numarası girin."),
  email: z.email("Geçerli bir e-posta girin.").max(120),
  venue: z.enum(venueSlugs, { message: "Bir salon seçin." }),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Takvimden bir tarih seçin.")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Geçersiz tarih."),
  guests: z.coerce.number().int().min(20, "En az 20 kişi.").max(900, "En fazla 900 kişi."),
  message: z.string().trim().max(600, "Mesaj 600 karakteri aşamaz.").optional().or(z.literal("")),
  // Honeypot: insanlar doldurmaz.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
