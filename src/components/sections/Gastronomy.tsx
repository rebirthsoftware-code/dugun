"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { photos, tastingMenu } from "@/lib/data";
import { FadeIn, SplitWords, ClipReveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";

export function Gastronomy() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} className="surface-paper relative overflow-hidden" aria-label="Gastronomi">
      <div className="container-x grid gap-16 py-24 md:py-36 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
        <div>
          <FadeIn>
            <span className="eyebrow flex items-center gap-3">
              <span className="h-px w-10 bg-current opacity-60" /> Gastronomi
            </span>
          </FadeIn>
          <SplitWords as="h2" text="Menü, hikâyenize göre yazılır." className="mt-8 font-display type-md" />
          <FadeIn delay={0.2}>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-tone-mute md:text-lg">{tastingMenu.intro}</p>
          </FadeIn>

          <div className="mt-14 grid gap-12 sm:grid-cols-2">
            {tastingMenu.courses.map((c, ci) => (
              <FadeIn key={c.name} delay={0.1 + ci * 0.08}>
                <h3 className="mb-5 flex items-center gap-4 font-sans text-[10px] uppercase tracking-[0.3em] text-tone-gold">
                  <span className="font-display text-2xl normal-case tracking-normal text-tone">{String(ci + 1).padStart(2, "0")}</span>
                  {c.name}
                </h3>
                <ul className="space-y-4">
                  {c.items.map((it) => (
                    <li key={it.name} className="leaders font-display text-xl leading-tight md:text-2xl">
                      <span>{it.name}</span>
                      <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-tone-mute">{it.note || "·"}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3} className="mt-14 flex flex-wrap items-center gap-6">
            <ButtonLink href="/rezervasyon" variant="dark">
              Tadım randevusu
            </ButtonLink>
            <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-tone-mute">v · vejetaryen</span>
          </FadeIn>
        </div>

        <div className="relative">
          <ClipReveal className="relative aspect-[3/4] overflow-hidden lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <motion.div style={{ y }} className="absolute inset-[-10%_0]">
              <Image src={photos.plate} alt="Şef tabağı" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </motion.div>
            <div className="absolute inset-x-6 bottom-6 flex items-end justify-between text-ivory">
              <div>
                <span className="eyebrow mb-2 block text-gold">Şef</span>
                <span className="font-display text-3xl">Kerem Aydın</span>
              </div>
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-ivory/70">Michelin ★ tecrübesi</span>
            </div>
          </ClipReveal>
        </div>
      </div>
    </section>
  );
}
