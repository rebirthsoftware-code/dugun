"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkPassword, createSessionToken, SESSION_COOKIE } from "./auth";
import { saveContent, resetSection, type SiteContent } from "./content";
import { deleteReservation, toggleBlockedDate, updateReservation, type ReservationStatus } from "./reservations";

export type ActionResult = { ok: boolean; message?: string };

export async function login(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/panel");
  if (!checkPassword(password)) {
    return { ok: false, message: "Şifre hatalı." };
  }
  const { token, maxAge } = createSessionToken();
  const store = await cookies();
  store.set({ name: SESSION_COOKIE, value: token, httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge });
  redirect(next.startsWith("/panel") ? next : "/panel");
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/panel/giris");
}

function revalidateSite() {
  revalidatePath("/", "layout");
}

export async function setReservationStatus(id: string, status: ReservationStatus) {
  await updateReservation(id, { status });
  revalidatePath("/panel");
  revalidatePath("/panel/randevular");
  revalidatePath("/panel/takvim");
}

export async function saveReservationNote(id: string, note: string) {
  await updateReservation(id, { note: note.trim() || undefined });
  revalidatePath("/panel/randevular");
}

export async function removeReservation(id: string) {
  await deleteReservation(id);
  revalidatePath("/panel");
  revalidatePath("/panel/randevular");
  revalidatePath("/panel/takvim");
}

export async function toggleBlocked(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
  await toggleBlockedDate(date);
  revalidatePath("/panel/takvim");
}

/** İçerik bölümünü kaydeder. `data` JSON olarak gelir (istemci formu serileştirir). */
export async function saveSection(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const key = String(formData.get("section") ?? "") as keyof SiteContent;
  const raw = String(formData.get("data") ?? "");
  const allowed: (keyof SiteContent)[] = ["site", "hero", "intro", "stats", "eventTypes", "services", "timeline", "gallery", "testimonials", "faqs", "cta"];
  if (!allowed.includes(key)) return { ok: false, message: "Geçersiz bölüm." };
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return { ok: false, message: "Veri çözümlenemedi." };
  }
  await saveContent({ [key]: data } as Partial<SiteContent>);
  revalidateSite();
  revalidatePath("/panel/icerik");
  return { ok: true, message: "Kaydedildi." };
}

export async function resetSectionAction(key: keyof SiteContent) {
  await resetSection(key);
  revalidateSite();
  revalidatePath("/panel/icerik");
}
