"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { photos, stats } from "@/lib/data";
import { FadeIn, SplitWords, ClipReveal } from "@/components/ui/Reveal";
import { Counter } from "./Numbers";

export function Intro() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} className="surface-paper relative overflow-hidden" aria-label="Serenad hakkında">
      <div className="container-x grid gap-16 py-24 md:py-36 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <ClipReveal className="relative order-2 lg:order-1">
          <div className="relative aspect-[3/4] overflow-hidden">
            <motion.div style={{ y: imgY }} className="absolute inset-[-10%_0]">
              <Image
                src={photos.kissBW}
                alt="Duvak altında ilk öpücük, siyah-beyaz"
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover grayscale"
              />
            </motion.div>
          </div>
          <FadeIn delay={0.4} className="mt-4 flex items-center justify-between font-sans text-[10px] uppercase tracking-[0.3em] text-tone-mute">
            <span>Zeynep & Can · Eylül 2025</span>
            <span>Boğaz Salonu</span>
          </FadeIn>
        </ClipReveal>

        <div className="order-1 flex flex-col justify-center lg:order-2">
          <FadeIn>
            <span className="eyebrow flex items-center gap-3">
              <span className="h-px w-10 bg-current opacity-60" /> Serenad
            </span>
          </FadeIn>
          <SplitWords
            as="h2"
            text="Bir düğün, iki ailenin ilk ortak hatırasıdır. Biz o hatırayı ışıkla, lezzetle ve zamanla işleriz."
            className="mt-8 font-display type-md text-balance leading-[1.05]"
          />
          <FadeIn delay={0.25}>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-tone-mute md:text-lg">
              On sekiz yıldır Kuruçeşme kıyısında, her çiftin hikâyesine ayrı bir sahne kuruyoruz. Üç salon, tek mutfak,
              tek koordinatör ve sürpriz bırakmayan bir plan. Gecenin sonunda konuklarınız yalnızca bir şeyi hatırlar:
              nasıl hissettiklerini.
            </p>
          </FadeIn>

          <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-tone pt-10 md:grid-cols-4">
            {stats.map((s, i) => (
              <FadeIn key={s.label} delay={0.1 + i * 0.08}>
                <dd className="font-display text-[clamp(2.5rem,4.5vw,4rem)] leading-none">
                  <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
                </dd>
                <dt className="mt-3 font-sans text-[10px] uppercase tracking-[0.28em] text-tone-mute">{s.label}</dt>
              </FadeIn>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
