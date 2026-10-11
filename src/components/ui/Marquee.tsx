import { cn } from "@/lib/utils";

export function Marquee({
  items,
  className,
  separator = "✦",
}: {
  items: readonly string[];
  className?: string;
  separator?: string;
}) {
  const row = [...items, ...items];
  return (
    <div className={cn("relative flex overflow-hidden whitespace-nowrap", className)} aria-hidden>
      <div className="animate-marquee flex shrink-0 items-center">
        {row.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="font-display text-[clamp(1.5rem,3vw,2.75rem)] italic text-ivory-2">{item}</span>
            <span className="mx-[2.5vw] text-gold">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
