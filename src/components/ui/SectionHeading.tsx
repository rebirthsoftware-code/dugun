import { cn } from "@/lib/utils";
import { SplitWords } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  className,
  align = "left",
  as = "h2",
}: {
  eyebrow: string;
  title: string;
  className?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div className={cn("flex flex-col gap-5", align === "center" && "items-center text-center", className)}>
      <span className="eyebrow flex items-center gap-3">
        <span className="h-px w-8 bg-gold/60" />
        {eyebrow}
      </span>
      <SplitWords as={as} text={title} className="font-display type-md text-balance" />
    </div>
  );
}
