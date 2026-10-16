"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import type { EventType } from "@/lib/data";
import { getMonthAvailability, submitInquiry, type InquiryState } from "@/lib/actions";
import type { DayAvailability } from "@/lib/availability";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const DAYS = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"];

const statusLabel: Record<DayAvailability["status"], string> = {
  available: "Uygun",
  limited: "Son yer",
  booked: "Dolu",
  past: "",
};

function fmtDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return `${d} ${MONTHS[m - 1]} ${y}, ${["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"][dt.getDay()]}`;
}

export function Availability({ compact = false, eventTypes }: { compact?: boolean; eventTypes: EventType[] }) {
  const [venue, setVenue] = useState(eventTypes[0].slug);
  const [cursor, setCursor] = useState<{ y: number; m: number } | null>(null);
  const [days, setDays] = useState<DayAvailability[]>([]);
  const [selected, setSelected] = useState<DayAvailability | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLDivElement>(null);

  // Takvim yalnızca istemcide, bugünün tarihine göre kurulur (statik kabuk tarihten bağımsız kalır).
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const now = new Date();
      setCursor({ y: now.getFullYear(), m: now.getMonth() + 1 });
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!cursor) return;
    startTransition(async () => {
      const data = await getMonthAvailability(cursor.y, cursor.m, venue);
      setDays(data);
    });
  }, [cursor, venue]);

  const move = (d: number) =>
    setCursor((c) => {
      if (!c) return c;
      const m = c.m + d;
      if (m < 1) return { y: c.y - 1, m: 12 };
      if (m > 12) return { y: c.y + 1, m: 1 };
      return { y: c.y, m };
    });

  const firstDow = cursor ? (new Date(cursor.y, cursor.m - 1, 1).getDay() + 6) % 7 : 0;
  const active = eventTypes.find((v) => v.slug === venue)!;

  return (
    <section id="tarih" className={cn("surface-white container-x scroll-mt-20", compact ? "py-10" : "py-24 md:py-36")} aria-label="Tarih sorgula">
      {!compact && (
        <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Tarih sorgula" title="Gününüz hâlâ boş mu?" />
          <p className="max-w-sm text-sm leading-relaxed text-tone-mute md:text-right">
            Takvimden bir gün seçin; anlık uygunluğu görün, ardından talebinizi bırakın.
          </p>
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        {/* Takvim */}
        <div className="rounded-sm border border-tone bg-tone-card p-5 md:p-8">
          <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Etkinlik türü">
            {eventTypes.map((v) => (
              <button
                key={v.slug}
                type="button"
                role="tab"
                aria-selected={venue === v.slug}
                onClick={() => {
                  setVenue(v.slug);
                  setSelected(null);
                }}
                className={cn(
                  "rounded-full border px-4 py-2 font-sans text-[11px] uppercase tracking-[0.2em] transition-colors",
                  venue === v.slug ? "border-ink bg-ink text-ivory" : "border-tone-strong text-tone-mute hover:text-tone",
                )}
              >
                {v.name}
              </button>
            ))}
          </div>

          <div className="mb-4 flex items-center justify-between">
            <button type="button" onClick={() => move(-1)} aria-label="Önceki ay" className="grid size-10 place-items-center rounded-full border border-tone-strong hover:bg-ink hover:text-ivory">
              <ArrowLeft className="size-4" />
            </button>
            <div className="flex items-center gap-3 font-display text-3xl text-tone">
              {cursor ? (
                <span>
                  {MONTHS[cursor.m - 1]} <span className="text-tone-mute">{cursor.y}</span>
                </span>
              ) : (
                <span className="h-8 w-40 animate-pulse rounded bg-tone-line" />
              )}
              {pending && <Loader2 className="size-4 animate-spin text-tone-gold" aria-label="Yükleniyor" />}
            </div>
            <button type="button" onClick={() => move(1)} aria-label="Sonraki ay" className="grid size-10 place-items-center rounded-full border border-tone-strong hover:bg-ink hover:text-ivory">
              <ArrowRight className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center font-sans text-[10px] uppercase tracking-[0.2em] text-tone-mute">
            {DAYS.map((d) => (
              <span key={d} className="py-2">
                {d}
              </span>
            ))}
          </div>
          <div className={cn("grid grid-cols-7 gap-1 transition-opacity", pending && "opacity-60")} role="grid" aria-busy={pending}>
            {Array.from({ length: firstDow }).map((_, i) => (
              <span key={`e${i}`} />
            ))}
            {(days.length ? days : Array.from({ length: 30 }, () => null)).map((d, i) => {
              if (!d) return <span key={i} className="aspect-square animate-pulse rounded-sm bg-tone-line" />;
              const disabled = d.status === "booked" || d.status === "past";
              const isSel = selected?.date === d.date;
              return (
                <button
                  key={d.date}
                  type="button"
                  role="gridcell"
                  disabled={disabled}
                  aria-selected={isSel}
                  aria-label={`${d.date} ${statusLabel[d.status]}`}
                  onClick={() => {
                    setSelected(d);
                    formRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                  }}
                  className={cn(
                    "group relative flex aspect-square flex-col items-center justify-center rounded-sm border text-sm transition-all duration-300",
                    d.status === "past" && "border-transparent text-tone-mute/40",
                    d.status === "booked" && "border-transparent text-tone-mute/50 line-through",
                    d.status === "available" && "border-tone text-tone hover:border-gold-2",
                    d.status === "limited" && "border-rose/50 text-tone hover:border-rose",
                    isSel && "border-ink bg-ink text-ivory hover:border-ink",
                  )}
                >
                  <span className="font-display text-lg leading-none">{Number(d.date.slice(-2))}</span>
                  {d.status === "limited" && !isSel && <span className="absolute right-1 top-1 size-1.5 rounded-full bg-rose" />}
                  {d.status === "available" && d.weekend && !isSel && <span className="absolute right-1 top-1 size-1.5 rounded-full bg-gold-2/70" />}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-sans text-[10px] uppercase tracking-[0.2em] text-tone-mute">
            <span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-gold-2/70" /> Hafta sonu</span>
            <span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-rose" /> Son yer</span>
            <span className="flex items-center gap-2"><span className="h-px w-3 bg-tone-fg/30" /> Dolu</span>
          </div>
        </div>

        {/* Seçim özeti + form */}
        <div ref={formRef} className="flex flex-col gap-8">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.date + venue}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-sm border border-gold-2/40 bg-gold/10 p-6"
              >
                <p className="eyebrow mb-3">{active.name}</p>
                <p className="font-display text-3xl text-tone">{fmtDate(selected.date)}</p>
                <div className="mt-5 grid grid-cols-2 gap-4 border-t border-gold-2/30 pt-5 font-sans text-[11px] uppercase tracking-[0.2em] text-tone-mute">
                  <span>
                    <b className="mb-1 block font-display text-2xl normal-case tracking-normal text-tone">
                      {selected.status === "limited" ? "Son yer" : "Uygun"}
                    </b>
                    Durum
                  </span>
                  <span>
                    <b className="mb-1 block font-display text-2xl normal-case tracking-normal text-tone">{active.capacity} kişi</b>
                    Kapasite · {active.duration}
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-sm border border-dashed border-tone-strong p-6 text-sm text-tone-mute"
              >
                Takvimden uygun bir gün seçtiğinizde uygunluk durumu burada görünür.
              </motion.div>
            )}
          </AnimatePresence>

          <InquiryForm venue={venue} date={selected?.date ?? ""} />
        </div>
      </div>
    </section>
  );
}

const initial: InquiryState = { status: "idle" };

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={name} className="group flex flex-col gap-2">
      <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-tone-mute transition-colors group-focus-within:text-tone-gold">
        {label}
      </span>
      {children}
      {error && (
        <span role="alert" className="text-xs text-rose">
          {error}
        </span>
      )}
    </label>
  );
}

const inputCls =
  "w-full border-b border-tone-strong bg-transparent py-3 font-display text-xl text-tone outline-none transition-colors placeholder:text-tone-mute/50 focus:border-gold-2";

function InquiryForm({ venue, date }: { venue: string; date: string }) {
  const [state, action, pending] = useActionState(submitInquiry, initial);
  const errors = state.status === "error" ? state.fieldErrors : {};

  if (state.status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-sm border border-tone bg-tone-card p-8"
        role="status"
      >
        <span className="grid size-12 place-items-center rounded-full bg-gold text-ink">
          <Check className="size-5" />
        </span>
        <p className="mt-6 font-display text-3xl text-tone">Teşekkürler, {state.summary.name.split(" ")[0]}.</p>
        <p className="mt-3 text-sm leading-relaxed text-tone-mute">
          {state.summary.venue} için {fmtDate(state.summary.date)} tarihli, {state.summary.guests} kişilik talebinizi aldık.
          Koordinatörünüz 24 saat içinde sizi arayacak.
        </p>
        <p className="mt-6 font-sans text-[11px] uppercase tracking-[0.25em] text-tone-mute">
          Referans · <span className="text-tone-gold">{state.reference}</span>
        </p>
      </motion.div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-6" noValidate>
      <input type="hidden" name="venue" value={venue} />
      <input type="hidden" name="date" value={date} />
      {/* Honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Ad Soyad" name="name" error={errors.name}>
          <input id="name" name="name" required autoComplete="name" placeholder="Zeynep & Can" className={inputCls} />
        </Field>
        <Field label="Telefon" name="phone" error={errors.phone}>
          <input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="+90 5xx xxx xx xx" className={inputCls} />
        </Field>
        <Field label="E-posta" name="email" error={errors.email}>
          <input id="email" name="email" type="email" required autoComplete="email" placeholder="siz@ornek.com" className={inputCls} />
        </Field>
        <Field label="Kişi sayısı" name="guests" error={errors.guests}>
          <input id="guests" name="guests" type="number" min={20} max={600} required placeholder="250" className={inputCls} />
        </Field>
      </div>
      <Field label="Notunuz (isteğe bağlı)" name="message" error={errors.message}>
        <textarea id="message" name="message" rows={2} placeholder="Canlı müzik, dekor tercihi..." className={cn(inputCls, "resize-none")} />
      </Field>

      {errors.date && (
        <p role="alert" className="text-xs text-rose">
          {errors.date}
        </p>
      )}
      {state.status === "error" && !Object.keys(errors).length && (
        <p role="alert" className="text-xs text-rose">
          {state.message}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-6">
        <Button type="submit" disabled={pending || !date} className="disabled:cursor-not-allowed disabled:opacity-50">
          {pending ? <Loader2 className="size-4 animate-spin" /> : null}
          {pending ? "Gönderiliyor" : "Talep Bırak"}
        </Button>
        {!date && <span className="text-xs text-tone-mute">Önce takvimden bir gün seçin.</span>}
      </div>
    </form>
  );
}
