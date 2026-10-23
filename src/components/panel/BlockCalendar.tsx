"use client";

import { useOptimistic, useRef, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toggleBlocked } from "@/lib/panel-actions";
import { cn } from "@/lib/utils";

const DAYS = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"];
type Tag = { date: string; label: string };

export function BlockCalendar({ year, month, blocked, confirmed, pending }: { year: number; month: number; blocked: string[]; confirmed: Tag[]; pending: Tag[] }) {
  const [isPending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  // Hızlı tıklamalar sıraya alınır: aynı anda birden fazla yazma GitHub'da çakışma üretmesin.
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const [optimistic, setOptimistic] = useOptimistic(new Set(blocked), (set, date: string) => {
    const n = new Set(set);
    if (n.has(date)) n.delete(date);
    else n.add(date);
    return n;
  });

  const days = new Date(year, month, 0).getDate();
  const firstDow = (new Date(year, month - 1, 1).getDay() + 6) % 7;
  const todayISO = new Date().toISOString().slice(0, 10);
  const byDate = (tags: Tag[], iso: string) => tags.filter((t) => t.date === iso);

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-4 md:p-6">
      <div className="mb-2 grid grid-cols-7 text-center font-sans text-[10px] uppercase tracking-[0.2em] text-tone-mute">
        {DAYS.map((d) => (
          <span key={d} className="py-2">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: firstDow }).map((_, i) => (
          <span key={`e${i}`} />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const iso = `${year}-${String(month).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
          const isBlocked = optimistic.has(iso);
          const conf = byDate(confirmed, iso);
          const pend = byDate(pending, iso);
          const past = iso < todayISO;
          return (
            <button
              key={iso}
              type="button"
              onClick={() =>
                start(async () => {
                  setOptimistic(iso);
                  setError(null);
                  const run = queue.current.then(() => toggleBlocked(iso));
                  queue.current = run.catch(() => undefined);
                  const res = await run;
                  if (!res.ok) setError(res.message ?? "Kaydedilemedi.");
                })
              }
              title={isBlocked ? "Kapatıldı · tıklayınca açılır" : "Açık · tıklayınca kapatılır"}
              className={cn(
                "flex min-h-[5.5rem] flex-col rounded-lg border p-2 text-left transition",
                past ? "border-transparent bg-ink/[0.03] text-tone-mute" : "border-ink/10 hover:border-gold-2",
                isBlocked && "border-ink bg-ink text-ivory hover:border-ink",
                conf.length > 0 && !isBlocked && "border-gold-2 bg-gold/15",
              )}
            >
              <span className="flex items-center justify-between">
                <span className="font-display text-lg leading-none">{i + 1}</span>
                {iso === todayISO && <span className="size-1.5 rounded-full bg-gold-2" />}
              </span>
              <span className="mt-auto space-y-0.5 text-[10px] leading-tight">
                {isBlocked && <span className="block opacity-80">Kapalı</span>}
                {conf.map((t) => (
                  <span key={t.label} className="block truncate font-medium">
                    {t.label}
                  </span>
                ))}
                {pend.map((t) => (
                  <span key={t.label} className="block truncate text-tone-mute">
                    ? {t.label}
                  </span>
                ))}
              </span>
            </button>
          );
        })}
      </div>
      {error && (
        <p role="alert" className="mt-4 rounded-md border border-rose/40 bg-rose/10 px-3 py-2 text-sm text-ink">
          {error} Sayfayı yenileyip tekrar deneyin.
        </p>
      )}
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-[10px] uppercase tracking-[0.2em] text-tone-mute">
        <span className="flex items-center gap-2"><span className="size-3 rounded-sm border border-gold-2 bg-gold/15" /> Onaylı randevu</span>
        <span className="flex items-center gap-2"><span className="size-3 rounded-sm bg-ink" /> Kapatıldı</span>
        <span className="flex items-center gap-2">? Bekleyen talep</span>
        {isPending && <Loader2 className="size-3 animate-spin" />}
      </div>
    </div>
  );
}
