"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useLenis } from "lenis/react";
import { SITE } from "@/lib/utils";
import { venues } from "@/lib/data";

const primary = [
  { href: "/", label: "Ana Sayfa", n: "01" },
  { href: "/#mekanlar", label: "Mekânlar", n: "02" },
  { href: "/#deneyim", label: "Deneyim", n: "03" },
  { href: "/galeri", label: "Galeri", n: "04" },
  { href: "/rezervasyon", label: "Rezervasyon", n: "05" },
];

const ease = [0.76, 0, 0.24, 1] as const;

export function Menu({ onClose }: { onClose: () => void }) {
  const lenis = useLenis();

  useEffect(() => {
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [lenis, onClose]);

  return (
    <motion.div
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menüsü"
      className="fixed inset-0 z-[90] overflow-hidden bg-ink-2 text-ivory"
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.9, ease }}
    >
      <div className="container-x grid h-full grid-rows-[auto_1fr_auto] pt-[var(--header-h)] pb-8 lg:grid-cols-[1.4fr_1fr] lg:grid-rows-[1fr_auto]">
        <nav className="flex flex-col justify-center gap-1 py-10 lg:py-0" aria-label="Menü">
          {primary.map((l, i) => (
            <div key={l.href} className="line-mask">
              <motion.div
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                exit={{ y: "110%", transition: { duration: 0.4, ease } }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.35 + i * 0.07 }}
              >
                <Link
                  href={l.href}
                  onClick={onClose}
                  className="group flex items-baseline gap-5 font-display text-[clamp(2.75rem,8vw,7rem)] leading-[1.02] text-ivory-2 transition-colors hover:text-gold"
                >
                  <span className="font-sans text-[11px] tracking-[0.3em] text-mute">{l.n}</span>
                  <span className="italic">{l.label}</span>
                  <span className="ml-2 inline-block translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    →
                  </span>
                </Link>
              </motion.div>
            </div>
          ))}
        </nav>

        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="hidden flex-col justify-center gap-10 border-l hairline pl-12 lg:flex"
        >
          <div>
            <p className="eyebrow mb-4">Salonlar</p>
            <ul className="space-y-3">
              {venues.map((v) => (
                <li key={v.slug}>
                  <Link
                    href={`/mekanlar/${v.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between font-display text-2xl text-ivory/80 transition-colors hover:text-ivory"
                  >
                    <span>{v.name}</span>
                    <span className="font-sans text-[11px] tracking-[0.2em] text-mute">{v.capacity.seated} kişi</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4">İletişim</p>
            <a href={SITE.phoneHref} className="block font-display text-2xl text-ivory/80 hover:text-ivory">
              {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="block font-display text-2xl text-ivory/80 hover:text-ivory">
              {SITE.email}
            </a>
            <p className="mt-3 max-w-xs text-sm text-mute">{SITE.address}</p>
          </div>
        </motion.aside>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.9 }}
          className="flex items-center justify-between border-t hairline pt-6 font-sans text-[11px] uppercase tracking-[0.25em] text-mute lg:col-span-2"
        >
          <span>İstanbul · Kuruçeşme</span>
          <a href={SITE.instagram} target="_blank" rel="noreferrer" className="hover:text-ivory">
            Instagram ↗
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}
