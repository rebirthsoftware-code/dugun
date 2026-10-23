import Link from "next/link";
import { listReservations, statusLabels, type ReservationStatus } from "@/lib/reservations";
import { eventTypes } from "@/lib/data";
import { ReservationRow } from "@/components/panel/ReservationRow";
import { cn } from "@/lib/utils";

// GitHub yazımları ve yeniden denemeler için sunucu fonksiyonu süresi
export const maxDuration = 60;

const filters: { key: ReservationStatus | "all"; label: string }[] = [
  { key: "all", label: "Tümü" },
  { key: "new", label: statusLabels.new },
  { key: "contacted", label: statusLabels.contacted },
  { key: "confirmed", label: statusLabels.confirmed },
  { key: "cancelled", label: statusLabels.cancelled },
];

export default async function ReservationsPage({ searchParams }: PageProps<"/panel/randevular">) {
  const sp = await searchParams;
  const durum = (typeof sp.durum === "string" ? sp.durum : "all") as ReservationStatus | "all";
  const q = typeof sp.q === "string" ? sp.q.trim().toLocaleLowerCase("tr") : "";
  const all = await listReservations({ fresh: true });
  const list = all.filter((r) => (durum === "all" || r.status === durum) && (!q || `${r.name} ${r.phone} ${r.email} ${r.date}`.toLocaleLowerCase("tr").includes(q)));
  const typeName = (slug: string) => eventTypes.find((e) => e.slug === slug)?.name ?? slug;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow mb-2">Randevular</p>
          <h1 className="font-display text-4xl">Talepler</h1>
        </div>
        <form className="flex gap-2">
          {durum !== "all" && <input type="hidden" name="durum" value={durum} />}
          <input name="q" defaultValue={q} placeholder="İsim, telefon, tarih ara" className="w-64 rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-gold-2" />
          <button className="rounded-lg bg-ink px-4 py-2 text-sm text-ivory">Ara</button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const count = f.key === "all" ? all.length : all.filter((r) => r.status === f.key).length;
          return (
            <Link
              key={f.key}
              href={f.key === "all" ? "/panel/randevular" : `/panel/randevular?durum=${f.key}`}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition",
                durum === f.key ? "border-ink bg-ink text-ivory" : "border-ink/15 bg-white text-ink/70 hover:border-ink/40",
              )}
            >
              {f.label} <span className="opacity-60">{count}</span>
            </Link>
          );
        })}
      </div>

      <div className="rounded-xl border border-ink/10 bg-white">
        {list.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-tone-mute">Bu filtrede talep yok.</p>
        ) : (
          <ul className="divide-y divide-ink/10">
            {list.map((r) => (
              <ReservationRow key={r.id} r={r} typeName={typeName(r.eventType)} expanded />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
