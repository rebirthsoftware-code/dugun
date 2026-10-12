"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { testimonials } from "@/lib/data";
import { FadeIn } from "@/components/ui/Reveal";

const DURATION = 7000;

export function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => setI((v) => (v + 1) % testimonials.length), DURATION);
    return () => clearTimeout(id);
  }, [i, paused]);

  const t = testimonials[i];

  return (
    <section
      className="surface-ink relative overflow-hidden py-24 md:py-36"
      aria-label="Çiftlerimiz"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div aria-hidden className="pointer-events-none absolute -left-6 top-6 select-none font-display text-[28rem] leading-none text-ivory/[0.04]">
        “
      </div>
      <div className="container-x relative grid gap-12 lg:grid-cols-[0.8fr_1.6fr_0.6fr] lg:gap-16">
        <FadeIn>
          <span className="eyebrow flex items-center gap-3">
            <span className="h-px w-10 bg-current opacity-60" /> Çiftlerimiz
          </span>
        </FadeIn>

        <div className="min-h-[16rem]">
          <AnimatePresence mode="wait">
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <blockquote className="font-display type-sm text-balance leading-[1.2]">{t.quote}</blockquote>
              <figcaption className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-[11px] uppercase tracking-[0.25em] text-tone-mute">
                <span className="text-tone-gold">{t.name}</span>
                <span>{t.venue}</span>
                <span>{t.date}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>

          <div className="mt-12 flex gap-3" role="tablist" aria-label="Yorumlar">
            {testimonials.map((_, k) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={k === i}
                aria-label={`${k + 1}. yorum`}
                onClick={() => setI(k)}
                className="relative h-px w-16 overflow-hidden bg-ivory/15"
              >
                {k === i && (
                  <motion.span
                    key={`${k}-${paused}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: paused ? 0.5 : 1 }}
                    transition={{ duration: paused ? 0 : DURATION / 1000, ease: "linear" }}
                    className="absolute inset-0 origin-left bg-gold"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="relative hidden aspect-[3/4] overflow-hidden lg:block">
          <AnimatePresence mode="sync">
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image src={t.image} alt={t.name} fill sizes="25vw" className="object-cover" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
