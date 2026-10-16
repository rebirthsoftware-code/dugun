import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, LayoutDashboard, ListChecks, PencilRuler, ExternalLink } from "lucide-react";
import { dbConfigured, dbDescription } from "@/lib/db";
import { logout } from "@/lib/panel-actions";
import { PanelNav } from "@/components/panel/PanelNav";

export const metadata: Metadata = { title: "Yönetim Paneli", robots: { index: false, follow: false } };

const nav = [
  { href: "/panel", label: "Özet", icon: "dashboard" },
  { href: "/panel/randevular", label: "Randevular", icon: "list" },
  { href: "/panel/takvim", label: "Takvim", icon: "calendar" },
  { href: "/panel/icerik", label: "Site İçeriği", icon: "edit" },
] as const;

export default function PanelLayout({ children }: LayoutProps<"/panel">) {
  return (
    <div className="flex min-h-screen bg-paper text-ink">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-ink/10 bg-white px-5 py-7 lg:flex">
        <Link href="/panel" className="mb-10 flex items-center gap-3 px-2">
          <span className="grid size-8 place-items-center rounded-full border border-gold-2/60">
            <span className="size-2.5 rotate-45 border border-ink/70" />
          </span>
          <span className="font-display text-2xl tracking-[0.08em]">KONAK</span>
          <span className="ml-auto rounded-full bg-ink/5 px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.2em] text-tone-mute">Panel</span>
        </Link>
        <PanelNav items={nav} />
        <div className="mt-auto space-y-3 px-2">
          <Link href="/" target="_blank" className="flex items-center gap-2 text-sm text-tone-mute hover:text-ink">
            <ExternalLink className="size-4" /> Siteyi görüntüle
          </Link>
          <form action={logout}>
            <button type="submit" className="text-sm text-tone-mute hover:text-ink">
              Çıkış yap
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-ink/10 bg-white px-5 py-4 lg:hidden">
          <Link href="/panel" className="font-display text-2xl tracking-[0.08em]">
            KONAK
          </Link>
          <PanelNav items={nav} compact />
        </header>
        {!dbConfigured && (
          <div className="border-b border-rose/30 bg-rose/10 px-6 py-3 text-sm text-ink">
            <b>Veritabanı bağlı değil.</b> Yaptığınız değişiklikler ve gelen talepler kalıcı olmaz. Vercel ortam değişkenlerine
            <code className="mx-1 rounded bg-ink/10 px-1">DATA_GITHUB_TOKEN</code> ekleyin (GitHub deposu veri olarak kullanılır) ya da Storage → Upstash Redis bağlayın.
          </div>
        )}
        <main className="flex-1 px-5 py-8 md:px-10">{children}</main>
        <footer className="px-5 py-3 text-right font-sans text-[10px] uppercase tracking-[0.2em] text-tone-mute md:px-10">Veri: {dbDescription}</footer>
      </div>
      <span className="hidden">
        <LayoutDashboard /> <ListChecks /> <CalendarDays /> <PencilRuler />
      </span>
    </div>
  );
}
