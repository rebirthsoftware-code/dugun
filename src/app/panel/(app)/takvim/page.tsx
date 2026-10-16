import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getOccupancy, statusLabels } from "@/lib/reservations";
import { eventTypes } from "@/lib/data";
import { BlockCalendar } from "@/components/panel/BlockCalendar";

const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

export default async function CalendarPage({ searchParams }: PageProps<"/panel/takvim">) {
  const sp = await searchParams;
  const now = new Date();
  let y = now.getFullYear();
  let m = now.getMonth() + 1;
  if (typeof sp.ay === "string" && /^\d{4}-\d{2}$/.test(sp.ay)) {
    [y, m] = sp.ay.split("-").map(Number);
  }
  const prev = m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, "0")}`;
  const next = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
  const key = `${y}-${String(m).padStart(2, "0")}`;

  const occ = await getOccupancy({ fresh: true });
  const monthRes = occ.reservations.filter((r) => r.date.startsWith(key) && r.status !== "cancelled").sort((a, b) => (a.date > b.date ? 1 : -1));
  const typeName = (slug: string) => eventTypes.find((e) => e.slug === slug)?.name ?? slug;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow mb-2">Takvim</p>
          <h1 className="font-display text-4xl">
            {MONTHS[m - 1]} <span className="text-tone-mute">{y}</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-tone-mute">
            Bir güne tıklayarak siteden rezervasyona kapatabilir ya da açabilirsiniz. Onaylı randevular otomatik olarak dolu görünür.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/panel/takvim?ay=${prev}`} className="grid size-10 place-items-center rounded-full border border-ink/15 bg-white hover:bg-ink hover:text-ivory" aria-label="Önceki ay">
            <ArrowLeft className="size-4" />
          </Link>
          <Link href="/panel/takvim" className="rounded-full border border-ink/15 bg-white px-4 py-2 text-sm hover:bg-ink hover:text-ivory">
            Bugün
          </Link>
          <Link href={`/panel/takvim?ay=${next}`} className="grid size-10 place-items-center rounded-full border border-ink/15 bg-white hover:bg-ink hover:text-ivory" aria-label="Sonraki ay">
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      <BlockCalendar
        year={y}
        month={m}
        blocked={occ.blocked}
        confirmed={occ.reservations.filter((r) => r.status === "confirmed").map((r) => ({ date: r.date, label: `${r.name} · ${typeName(r.eventType)}` }))}
        pending={occ.reservations.filter((r) => r.status === "new" || r.status === "contacted").map((r) => ({ date: r.date, label: `${r.name} · ${typeName(r.eventType)}` }))}
      />

      <section className="rounded-xl border border-ink/10 bg-white">
        <div className="border-b border-ink/10 px-5 py-4">
          <h2 className="font-display text-2xl">Bu ayın talepleri</h2>
        </div>
        {monthRes.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-tone-mute">Bu ay için talep yok.</p>
        ) : (
          <ul className="divide-y divide-ink/10 text-sm">
            {monthRes.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-x-6 gap-y-1 px-5 py-3">
                <b className="font-display text-lg">{Number(r.date.slice(-2))} {MONTHS[m - 1]}</b>
                <span>{r.name}</span>
                <span className="text-tone-mute">
                  {typeName(r.eventType)} · {r.guests} kişi
                </span>
                <span className="ml-auto rounded-full border border-ink/15 px-2 py-0.5 text-xs">{statusLabels[r.status]}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
