"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown } from "lucide-react";
import { useIntroDone } from "@/components/layout/Providers";
import { ButtonLink } from "@/components/ui/Button";
import { SITE } from "@/lib/utils";

const SilkCanvas = dynamic(() => import("./SilkCanvas"), { ssr: false });

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const intro = useIntroDone();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const lines = ["Hayatınızın", "en güzel", "gecesi."];

  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink" aria-label="Giriş">
      <motion.div style={{ scale }} className="absolute inset-0">
        <SilkCanvas intro={intro} />
      </motion.div>
      <div className="grain pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink to-transparent" />

      <motion.div
        style={{ y, opacity }}
        className="container-x relative z-10 flex flex-1 flex-col justify-end pb-14 pt-[calc(var(--header-h)+2rem)] md:pb-20"
      >
        <div className="mb-8 flex items-center gap-4 overflow-hidden">
          <motion.span
            initial={{ scaleX: 0 }}
            animate={intro ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, ease, delay: 0.2 }}
            className="h-px w-16 origin-left bg-gold"
          />
          <motion.span
            initial={{ y: "120%" }}
            animate={intro ? { y: 0 } : {}}
            transition={{ duration: 1, ease, delay: 0.3 }}
            className="eyebrow block"
          >
            Boğaz · İstanbul · Est. {SITE.founded}
          </motion.span>
        </div>

        <h1 className="font-display type-xl text-ivory">
          {lines.map((line, i) => (
            <span key={line} className="line-mask">
              <motion.span
                initial={{ y: "105%", rotate: 3 }}
                animate={intro ? { y: 0, rotate: 0 } : {}}
                transition={{ duration: 1.4, ease, delay: 0.35 + i * 0.12 }}
                className={i === 1 ? "block origin-bottom-left italic" : "block origin-bottom-left"}
              >
                {i === 1 ? <span className="gold-shimmer">{line}</span> : line}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={intro ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease, delay: 0.9 }}
            className="max-w-md text-pretty text-base leading-relaxed text-ivory/70 md:text-lg"
          >
            Boğaz’a nazır üç salon, yıldızlı bir mutfak ve on sekiz yıllık ustalık. Serenad’da her düğün, tek seferlik
            bir senfoni gibi yazılır.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={intro ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease, delay: 1.05 }}
            className="flex flex-wrap items-center gap-4"
          >
            <ButtonLink href="/rezervasyon" data-cursor="Tarih">
              Tarih Sorgula
            </ButtonLink>
            <ButtonLink href="/#mekanlar" variant="outline">
              Salonları Keşfet
            </ButtonLink>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={intro ? { opacity: 1 } : {}}
        transition={{ delay: 1.6, duration: 1 }}
        className="container-x relative z-10 flex items-center justify-between border-t hairline py-5 font-sans text-[11px] uppercase tracking-[0.25em] text-mute"
      >
        <span className="flex items-center gap-2">
          <ArrowDown className="size-3 animate-bounce" aria-hidden /> Kaydır
        </span>
        <span className="hidden sm:block">600 kişi · 3 salon · 4.9 puan</span>
        <span>41°03′N 29°02′E</span>
      </motion.div>
    </section>
  );
}
