"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "./Logo";
import { Menu } from "./Menu";
import { Magnetic } from "@/components/ui/Magnetic";
import { cn } from "@/lib/utils";
import type { SiteInfo } from "@/lib/content";
import type { EventType } from "@/lib/data";

export const navLinks = [
  { href: "/#etkinlikler", label: "Etkinlikler" },
  { href: "/#deneyim", label: "Deneyim" },
  { href: "/galeri", label: "Galeri" },
  { href: "/#tarih", label: "Tarih Sorgula" },
] as const;

export function Header({ site, eventTypes, menuImages }: { site: SiteInfo; eventTypes: EventType[]; menuImages: string[] }) {
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // Aşağı kaydırırken gizle, yukarı kaydırırken veya sayfanın üstündeyken göster.
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setHidden(y > 120 && y - last > 2 && !openRef.current);
        setSolid(y > 40);
        last = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-[100] transition-colors duration-500",
          open ? "text-ivory" : "text-ink",
          solid && !open ? "bg-white/75 backdrop-blur-xl" : "bg-transparent",
        )}
      >
        <div className="container-x flex h-[var(--header-h)] items-center justify-between">
          <Logo />
          <nav className="hidden items-center gap-10 lg:flex" aria-label="Ana menü">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group relative font-sans text-[11px] font-medium uppercase tracking-[0.22em] opacity-70 transition-opacity hover:opacity-100"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-gold-2 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:origin-left group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Magnetic className="hidden sm:inline-block">
              <Link
                href="/rezervasyon"
                className="group relative inline-flex items-center overflow-hidden rounded-full border border-current/30 px-5 py-2.5 font-sans text-[11px] font-medium uppercase tracking-[0.22em]"
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
                className="relative grid size-11 place-items-center rounded-full border border-current/20"
              >
                <span className="relative block h-3 w-5">
                  <motion.span animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }} className="absolute left-0 top-0 block h-px w-full bg-current" />
                  <motion.span animate={open ? { opacity: 0 } : { opacity: 1 }} className="absolute left-0 top-[5px] block h-px w-full bg-current" />
                  <motion.span animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }} className="absolute left-0 top-[10px] block h-px w-full bg-current" />
                </span>
              </button>
            </Magnetic>
          </div>
        </div>
      </motion.header>
      <AnimatePresence>{open && <Menu onClose={() => setOpen(false)} site={site} eventTypes={eventTypes} images={menuImages} />}</AnimatePresence>
    </>
  );
}
