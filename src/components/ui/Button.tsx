import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Magnetic } from "./Magnetic";

type Variant = "solid" | "outline" | "ghost" | "dark";

const base =
  "group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-7 py-4 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors duration-500";

const variants: Record<Variant, string> = {
  solid: "bg-ivory text-ink hover:text-ink",
  dark: "bg-ink text-ivory hover:text-ink",
  outline: "border border-current/25 text-current hover:border-gold hover:text-ink",
  ghost: "text-current/80 hover:text-gold px-0 py-0",
};

function Inner({ children, variant }: { children: ReactNode; variant: Variant }) {
  return (
    <>
      {variant !== "ghost" && (
        <span
          aria-hidden
          className="absolute inset-0 -z-0 translate-y-full rounded-full bg-gold transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:translate-y-0"
        />
      )}
      <span className="relative z-10 flex items-center gap-3">{children}</span>
    </>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "solid",
  className,
  magnetic = true,
  ...rest
}: ComponentProps<typeof Link> & { variant?: Variant; magnetic?: boolean }) {
  const el = (
    <Link href={href} className={cn(base, variants[variant], className)} {...rest}>
      <Inner variant={variant}>{children}</Inner>
    </Link>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}

export function Button({
  children,
  variant = "solid",
  className,
  ...rest
}: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      <Inner variant={variant}>{children}</Inner>
    </button>
  );
}
