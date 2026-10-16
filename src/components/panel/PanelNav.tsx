"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, LayoutDashboard, ListChecks, PencilRuler } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = { dashboard: LayoutDashboard, list: ListChecks, calendar: CalendarDays, edit: PencilRuler } as const;

export function PanelNav({
  items,
  compact = false,
}: {
  items: readonly { href: string; label: string; icon: keyof typeof icons }[];
  compact?: boolean;
}) {
  const pathname = usePathname();
  return (
    <nav className={cn("flex gap-1", compact ? "flex-row" : "flex-col")} aria-label="Panel menüsü">
      {items.map((it) => {
        const Icon = icons[it.icon];
        const active = it.href === "/panel" ? pathname === "/panel" : pathname.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            title={it.label}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
              active ? "bg-ink text-ivory" : "text-ink/70 hover:bg-ink/5 hover:text-ink",
              compact && "px-2 py-2",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {!compact && <span>{it.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
