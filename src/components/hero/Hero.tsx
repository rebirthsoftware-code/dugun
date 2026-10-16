"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useIntroDone } from "@/components/layout/Providers";
import { ButtonLink } from "@/components/ui/Button";
import type { HeroContent, SiteInfo } from "@/lib/content";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero({ hero, site, capacity }: { hero: HeroContent; site: SiteInfo; capacity: number }) {
  const HERO_SRC = hero.image;
  const WEBGL_SRC = HERO_SRC.includes("images.unsplash.com") ? `${HERO_SRC}${HERO_SRC.includes("?") ? "&" : "?"}w=1920` : HERO_SRC;
  const intro = useIntroDone();
  const [glReady, setGlReady] = useState(false);
  const [canvasEnabled, setCanvasEnabled] = useState(true);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const panelY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const panelScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const onReady = useCallback(() => setGlReady(true), []);
  const lines = hero.lines;

  return (
    <section ref={ref} className="surface-white relative overflow-hidden pt-[calc(var(--header-h)+2.5rem)] md:pt-[calc(var(--header-h)+4rem)]" aria-label="Giriş">
      {/* Başlık bloğu */}
      <motion.div style={{ y: textY, opacity: textOpacity }} className="container-x relative z-10 grid gap-10 pb-12 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:pb-16">
        <div>
          <div className="mb-8 flex items-center gap-4 overflow-hidden">
            <motion.span
              initial={{ scaleX: 0 }}
              animate={intro ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, ease, delay: 0.2 }}
              className="h-px w-14 origin-left bg-gold-2"
            />
            <motion.span
              initial={{ y: "120%" }}
              animate={intro ? { y: 0 } : {}}
              transition={{ duration: 1, ease, delay: 0.3 }}
              className="eyebrow block"
            >
              {hero.eyebrow}
            </motion.span>
          </div>
          <h1 className="font-display type-xl text-ink">
            {lines.map((line, i) => (
              <span key={line} className="line-mask">
                <motion.span
                  initial={{ y: "105%", rotate: 2 }}
                  animate={intro ? { y: 0, rotate: 0 } : {}}
                  transition={{ duration: 1.5, ease, delay: 0.35 + i * 0.12 }}
                  className="block origin-bottom-left"
                >
                  {i === 1 ? <em className="italic text-gold-2">{line}</em> : line}
                </motion.span>
              </span>
            ))}
          </h1>
        </div>

        <div className="flex flex-col gap-8 lg:items-start lg:pb-3">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={intro ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease, delay: 0.95 }}
            className="max-w-md text-pretty text-base leading-relaxed text-tone-mute md:text-lg"
          >
            {hero.text}
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
            <ButtonLink href="/#etkinlikler" variant="outline">
              Etkinlikler
            </ButtonLink>
          </motion.div>
        </div>
      </motion.div>

      {/* Fotoğraf paneli */}
      <div className="container-x relative z-0">
        <motion.div
          style={{ y: panelY, scale: panelScale, transformOrigin: "center top" }}
          initial={{ clipPath: "inset(12% 4% 0 4%)" }}
          animate={intro ? { clipPath: "inset(0% 0% 0 0%)" } : {}}
          transition={{ duration: 1.6, ease: [0.76, 0, 0.24, 1], delay: 0.5 }}
          className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/10] lg:aspect-[21/10]"
        >
          <div className={`absolute inset-0 transition-opacity duration-[1500ms] ${glReady ? "opacity-0" : "opacity-100"}`}>
            <Image
              src={HERO_SRC}
              alt={hero.imageAlt}
              fill
              priority
              sizes="100vw"
              className="animate-kenburns object-cover"
              onError={() => setCanvasEnabled(false)}
            />
          </div>
          {canvasEnabled && (
            <div className={`absolute inset-0 transition-opacity duration-[1500ms] ${glReady ? "opacity-100" : "opacity-0"}`}>
              <HeroCanvas key={WEBGL_SRC} src={WEBGL_SRC} intro={intro} onReady={onReady} />
            </div>
          )}
          <div className="grain pointer-events-none absolute inset-0" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={intro ? { opacity: 1 } : {}}
            transition={{ delay: 1.6, duration: 1 }}
            className="absolute inset-x-5 bottom-5 flex items-end justify-between text-ivory md:inset-x-8 md:bottom-8"
          >
            <div>
              <span className="eyebrow mb-2 block text-gold">{hero.captionSub}</span>
              <span className="font-display text-3xl md:text-4xl">{hero.caption}</span>
            </div>
            <span className="hidden font-sans text-[10px] uppercase tracking-[0.3em] text-ivory/70 md:block">
              {site.coords}
            </span>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={intro ? { opacity: 1 } : {}}
        transition={{ delay: 1.7, duration: 1 }}
        className="container-x relative z-10 mt-8 grid grid-cols-2 gap-6 border-t border-tone py-6 font-sans text-[11px] uppercase tracking-[0.25em] text-tone-mute md:grid-cols-4"
      >
        <span className="flex items-center gap-3">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-gold-2/60" />
            <span className="relative size-2 rounded-full bg-gold-2" />
          </span>
          Kaydır
        </span>
        <span className="hidden md:block">{capacity} kişiye kadar</span>
        <span className="hidden md:block">Düğün · Nişan · Kına · Matine · Toplantı</span>
        <span className="text-right">{site.city}</span>
      </motion.div>
    </section>
  );
}
