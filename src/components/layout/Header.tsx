"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll, AnimatePresence } from "motion/react";
import { Logo } from "./Logo";
import { Menu } from "./Menu";
import { Magnetic } from "@/components/ui/Magnetic";
import { cn } from "@/lib/utils";

export const navLinks = [
  { href: "/#mekanlar", label: "Mekânlar" },
  { href: "/#deneyim", label: "Deneyim" },
  { href: "/galeri", label: "Galeri" },
  { href: "/#tarih", label: "Tarih Sorgula" },
] as const;

export function Header() {
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 120 && !open);
    setSolid(y > 40);
  });

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-[100] transition-colors duration-500",
          solid && !open ? "bg-ink/70 backdrop-blur-xl" : "bg-transparent",
        )}
      >
        <div className="container-x flex h-[var(--header-h)] items-center justify-between">
          <Logo />
          <nav className="hidden items-center gap-10 lg:flex" aria-label="Ana menü">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group relative font-sans text-[11px] uppercase tracking-[0.22em] text-ivory/70 transition-colors hover:text-ivory"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:origin-left group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Magnetic className="hidden sm:inline-block">
              <Link
                href="/rezervasyon"
                className="group relative inline-flex items-center overflow-hidden rounded-full border border-gold/50 px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.22em] text-gold"
              >
                <span className="absolute inset-0 translate-y-full bg-gold transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:translate-y-0" />
                <span className="relative transition-colors duration-500 group-hover:text-ink">Rezervasyon</span>
              </Link>
            </Magnetic>
            <Magnetic>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="site-menu"
                aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
                className="relative grid size-11 place-items-center rounded-full border border-ivory/15 bg-ink/40 backdrop-blur"
              >
                <span className="relative block h-3 w-5">
                  <motion.span
                    animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                    className="absolute left-0 top-0 block h-px w-full bg-ivory"
                  />
                  <motion.span
                    animate={open ? { opacity: 0 } : { opacity: 1 }}
                    className="absolute left-0 top-[5px] block h-px w-full bg-ivory"
                  />
                  <motion.span
                    animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                    className="absolute left-0 top-[10px] block h-px w-full bg-ivory"
                  />
                </span>
              </button>
            </Magnetic>
          </div>
        </div>
      </motion.header>
      <AnimatePresence>{open && <Menu onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}
