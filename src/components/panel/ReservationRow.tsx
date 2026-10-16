"use client";

import { useState, useTransition } from "react";
import { Loader2, MessageCircle, Phone, Trash2, Mail } from "lucide-react";
import { removeReservation, saveReservationNote, setReservationStatus } from "@/lib/panel-actions";
import { statusLabels, type Reservation, type ReservationStatus } from "@/lib/reservations";
import { cn } from "@/lib/utils";

const statusTone: Record<ReservationStatus, string> = {
  new: "bg-gold/20 text-gold-2 border-gold-2/40",
  contacted: "bg-sage/20 text-ink border-sage",
  confirmed: "bg-ink text-ivory border-ink",
  cancelled: "bg-ink/5 text-tone-mute border-ink/10 line-through",
};

function fmtDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("tr-TR", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}
function fmtTs(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
}
function waLink(phone: string, name: string) {
  const digits = phone.replace(/\D/g, "").replace(/^0/, "90");
  const msg = encodeURIComponent(`Merhaba ${name}, Konak Düğün Salonu'ndan arıyoruz. Randevu talebiniz hakkında görüşmek isteriz.`);
  return `https://wa.me/${digits.startsWith("90") ? digits : "90" + digits}?text=${msg}`;
}

export function ReservationRow({ r, typeName, expanded = false }: { r: Reservation; typeName: string; expanded?: boolean }) {
  const [pending, start] = useTransition();
  const [note, setNote] = useState(r.note ?? "");
  const [open, setOpen] = useState(expanded);

  return (
    <li className={cn("px-5 py-4", pending && "opacity-60")}>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <button type="button" onClick={() => setOpen((v) => !v)} className="min-w-[10rem] text-left">
          <div className="font-display text-xl leading-tight">{fmtDate(r.date)}</div>
          <div className="text-xs text-tone-mute">
            {typeName} · {r.guests} kişi
          </div>
        </button>
        <div className="min-w-[10rem] flex-1">
          <div className="font-medium">{r.name}</div>
          <div className="text-xs text-tone-mute">
            {r.phone} · {r.email}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href={`tel:${r.phone.replace(/\s/g, "")}`} title="Ara" className="grid size-9 place-items-center rounded-full border border-ink/15 hover:bg-ink hover:text-ivory">
            <Phone className="size-4" />
          </a>
          <a href={waLink(r.phone, r.name)} target="_blank" rel="noreferrer" title="WhatsApp" className="grid size-9 place-items-center rounded-full border border-ink/15 hover:bg-ink hover:text-ivory">
            <MessageCircle className="size-4" />
          </a>
          <a href={`mailto:${r.email}`} title="E-posta" className="grid size-9 place-items-center rounded-full border border-ink/15 hover:bg-ink hover:text-ivory">
            <Mail className="size-4" />
          </a>
        </div>
        <select
          value={r.status}
          onChange={(e) => start(() => setReservationStatus(r.id, e.target.value as ReservationStatus))}
          className={cn("rounded-full border px-3 py-1.5 text-xs font-medium outline-none", statusTone[r.status])}
          aria-label="Durum"
        >
          {(Object.keys(statusLabels) as ReservationStatus[]).map((k) => (
            <option key={k} value={k} className="text-ink">
              {statusLabels[k]}
            </option>
          ))}
        </select>
        {r.source && <span className="hidden rounded-full bg-gold/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-gold-2 lg:block">{r.source.split(" ")[0]}</span>}
        <span className="hidden text-xs text-tone-mute xl:block">{fmtTs(r.createdAt)}</span>
        {pending && <Loader2 className="size-4 animate-spin text-tone-mute" />}
      </div>

      {open && (
        <div className="mt-4 grid gap-4 rounded-lg bg-paper p-4 md:grid-cols-[1fr_1fr_auto]">
          <div>
            <div className="mb-1 font-sans text-[10px] uppercase tracking-[0.2em] text-tone-mute">Çiftin notu</div>
            <p className="text-sm">{r.message || <span className="text-tone-mute">—</span>}</p>
            <div className="mt-3 font-sans text-[10px] uppercase tracking-[0.2em] text-tone-mute">Referans · {r.id}</div>
            {r.source && <div className="mt-1 font-sans text-[10px] uppercase tracking-[0.2em] text-gold-2">Kaynak · {r.source}</div>}
          </div>
          <div>
            <div className="mb-1 font-sans text-[10px] uppercase tracking-[0.2em] text-tone-mute">Sizin notunuz</div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onBlur={() => note !== (r.note ?? "") && start(() => saveReservationNote(r.id, note))}
              rows={3}
              placeholder="Kapora alındı, menü görüşülecek..."
              className="w-full rounded-md border border-ink/15 bg-white p-2 text-sm outline-none focus:border-gold-2"
            />
          </div>
          <div className="flex items-start">
            <button
              type="button"
              onClick={() => confirm("Bu talep silinsin mi?") && start(() => removeReservation(r.id))}
              className="flex items-center gap-2 rounded-md border border-rose/40 px-3 py-2 text-xs text-rose hover:bg-rose/10"
            >
              <Trash2 className="size-4" /> Sil
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
