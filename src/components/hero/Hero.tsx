"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useIntroDone } from "@/components/layout/Providers";
import { ButtonLink } from "@/components/ui/Button";
import { photos } from "@/lib/data";
import { SITE } from "@/lib/utils";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

const ease = [0.16, 1, 0.3, 1] as const;
const HERO_SRC = photos.ballroom;
const WEBGL_SRC = `${HERO_SRC}&w=1920`;

export function Hero() {
  const intro = useIntroDone();
  const [glReady, setGlReady] = useState(false);
  const [canvasEnabled, setCanvasEnabled] = useState(true);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  const onReady = useCallback(() => setGlReady(true), []);
  const lines = ["Hayatınızın", "en güzel", "gecesi."];

  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink" aria-label="Giriş">
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        {/* LCP ve WebGL olmayan ortamlar için gerçek görsel */}
        <div className={`absolute inset-0 transition-opacity duration-[1500ms] ${glReady ? "opacity-0" : "opacity-100"}`}>
          <Image
            src={HERO_SRC}
            alt="Serenad Boğaz Salonu, kristal avizeler altında kurulmuş davet masaları"
            fill
            priority
            sizes="100vw"
            className="animate-kenburns object-cover"
            onError={() => setCanvasEnabled(false)}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/30 to-ink/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/30" />
        </div>
        {canvasEnabled && (
          <div className={`absolute inset-0 transition-opacity duration-[1500ms] ${glReady ? "opacity-100" : "opacity-0"}`}>
            <HeroCanvas src={WEBGL_SRC} intro={intro} onReady={onReady} />
          </div>
        )}
      </motion.div>
      <div className="grain pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-ink to-transparent" />

      {/* Dikey etiket */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={intro ? { opacity: 1 } : {}}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute right-[clamp(1.25rem,4.5vw,5.5rem)] top-1/2 hidden -translate-y-1/2 rotate-90 whitespace-nowrap font-sans text-[10px] uppercase tracking-[0.35em] text-ivory/50 lg:block"
      >
        Kuruçeşme · İstanbul · Est. {SITE.founded}
      </motion.div>

      <motion.div
        style={{ y, opacity }}
        className="container-x relative z-10 flex flex-1 flex-col justify-end pb-16 pt-[calc(var(--header-h)+2rem)] md:pb-24"
      >
        <div className="mb-8 flex items-center gap-4 overflow-hidden">
          <motion.span
            initial={{ scaleX: 0 }}
            animate={intro ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, ease, delay: 0.2 }}
            className="h-px w-14 origin-left bg-gold"
          />
          <motion.span
            initial={{ y: "120%" }}
            animate={intro ? { y: 0 } : {}}
            transition={{ duration: 1, ease, delay: 0.3 }}
            className="eyebrow block"
          >
            Düğün & Davet Salonu
          </motion.span>
        </div>

        <h1 className="font-display type-xl text-ivory">
          {lines.map((line, i) => (
            <span key={line} className="line-mask">
              <motion.span
                initial={{ y: "105%", rotate: 2 }}
                animate={intro ? { y: 0, rotate: 0 } : {}}
                transition={{ duration: 1.5, ease, delay: 0.35 + i * 0.12 }}
                className="block origin-bottom-left"
              >
                {i === 1 ? <em className="gold-shimmer not-italic italic">{line}</em> : line}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={intro ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease, delay: 0.95 }}
            className="max-w-md text-pretty text-base leading-relaxed text-ivory/75 md:text-lg"
          >
            Boğaz’ın kıyısında üç salon, yıldızlı bir mutfak ve on sekiz yıllık ustalık. Her düğün, tek seferlik bir
            senfoni gibi yazılır.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={intro ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease, delay: 1.1 }}
            className="flex flex-wrap items-center gap-4"
          >
            <ButtonLink href="/rezervasyon" data-cursor="Tarih">
              Tarih Sorgula
            </ButtonLink>
            <ButtonLink href="/#mekanlar" variant="outline">
              Salonlar
            </ButtonLink>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={intro ? { opacity: 1 } : {}}
        transition={{ delay: 1.6, duration: 1 }}
        className="container-x relative z-10 grid grid-cols-2 gap-6 border-t hairline py-6 font-sans text-[11px] uppercase tracking-[0.25em] text-ivory/60 md:grid-cols-4"
      >
        <span className="flex items-center gap-3">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-gold/60" />
            <span className="relative size-2 rounded-full bg-gold" />
          </span>
          Kaydır
        </span>
        <span className="hidden md:block">600 kişiye kadar</span>
        <span className="hidden md:block">Boğaz manzarası</span>
        <span className="text-right">41°03′N 29°02′E</span>
      </motion.div>
    </section>
  );
}
