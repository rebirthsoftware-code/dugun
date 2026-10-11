import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="Serenad ana sayfa" className={cn("group inline-flex items-center gap-3", className)}>
      <span className="relative grid size-8 place-items-center">
        <span className="absolute inset-0 rounded-full border border-gold/60 transition-transform duration-700 group-hover:rotate-180" />
        <span className="absolute inset-[6px] rotate-45 border border-ivory/60" />
        <span className="size-1 rounded-full bg-gold" />
      </span>
      <span className="font-display text-2xl tracking-[0.08em] text-ivory">SERENAD</span>
    </Link>
  );
}
