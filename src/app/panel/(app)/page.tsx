import Link from "next/link";
import { ArrowUpRight, CalendarDays, Inbox, Lock, Database } from "lucide-react";
import { listBlockedDates, listReservations, statusLabels } from "@/lib/reservations";
import { eventTypes } from "@/lib/data";
import { dbBackend } from "@/lib/db";
import { ReservationRow } from "@/components/panel/ReservationRow";

// GitHub yazımları ve yeniden denemeler için sunucu fonksiyonu süresi
export const maxDuration = 60;

function fmt(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

export default async function PanelHome() {
  const [reservations, blocked] = await Promise.all([listReservations({ fresh: true }), listBlockedDates({ fresh: true })]);
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const newCount = reservations.filter((r) => r.status === "new").length;
  const confirmedThisMonth = reservations.filter((r) => r.status === "confirmed" && r.date.startsWith(monthKey)).length;
  const upcoming = reservations
    .filter((r) => r.status === "confirmed" && r.date >= now.toISOString().slice(0, 10))
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .slice(0, 5);
  const typeName = (slug: string) => eventTypes.find((e) => e.slug === slug)?.name ?? slug;

  const cards = [
    { label: "Yeni talep", value: newCount, icon: Inbox, href: "/panel/randevular?durum=new" },
    { label: "Bu ay onaylı", value: confirmedThisMonth, icon: CalendarDays, href: "/panel/randevular?durum=confirmed" },
    { label: "Kapatılan gün", value: blocked.length, icon: Lock, href: "/panel/takvim" },
    { label: "Veritabanı", value: dbBackend === "github" ? "GitHub" : dbBackend === "redis" ? "Redis" : "Yok", icon: Database, href: "/panel" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <div>
        <p className="eyebrow mb-2">Özet</p>
        <h1 className="font-display text-4xl">Hoş geldiniz.</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="group rounded-xl border border-ink/10 bg-white p-5 transition hover:border-gold-2/60">
            <div className="flex items-center justify-between text-tone-mute">
              <c.icon className="size-4" />
              <ArrowUpRight className="size-4 opacity-0 transition group-hover:opacity-100" />
            </div>
            <div className="mt-4 font-display text-4xl">{c.value}</div>
            <div className="mt-1 font-sans text-[11px] uppercase tracking-[0.2em] text-tone-mute">{c.label}</div>
          </Link>
        ))}
      </div>

      <section className="rounded-xl border border-ink/10 bg-white">
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 className="font-display text-2xl">Son talepler</h2>
          <Link href="/panel/randevular" className="text-sm text-tone-mute hover:text-ink">
            Tümü →
          </Link>
        </div>
        {reservations.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-tone-mute">Henüz talep yok. Siteden gelen randevu talepleri burada listelenir.</p>
        ) : (
          <ul className="divide-y divide-ink/10">
            {reservations.slice(0, 8).map((r) => (
              <ReservationRow key={r.id} r={r} typeName={typeName(r.eventType)} />
            ))}
          </ul>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-ink/10 bg-white p-5">
          <h2 className="mb-4 font-display text-2xl">Yaklaşan onaylı etkinlikler</h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-tone-mute">Onaylı yaklaşan etkinlik yok.</p>
          ) : (
            <ul className="space-y-3">
              {upcoming.map((r) => (
                <li key={r.id} className="flex items-center justify-between text-sm">
                  <span>
                    <b className="font-display text-lg">{fmt(r.date)}</b> · {typeName(r.eventType)}
                  </span>
                  <span className="text-tone-mute">
                    {r.name} · {r.guests} kişi
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-xl border border-ink/10 bg-white p-5">
          <h2 className="mb-4 font-display text-2xl">Durum anahtarı</h2>
          <ul className="space-y-2 text-sm text-tone-mute">
            {(Object.keys(statusLabels) as (keyof typeof statusLabels)[]).map((k) => (
              <li key={k}>
                <b className="text-ink">{statusLabels[k]}</b>:{" "}
                {k === "new" && "Siteden yeni geldi, henüz aranmadı."}
                {k === "contacted" && "Çiftle görüşüldü, karar bekleniyor (takvimde 'son yer' görünür)."}
                {k === "confirmed" && "Kapora/sözleşme tamam; o gün takvimde dolu görünür."}
                {k === "cancelled" && "İptal edildi; takvimi etkilemez."}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
