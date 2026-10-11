"use client";

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
      className="relative overflow-hidden border-t hairline bg-ink-2 py-24 md:py-40"
      aria-label="Misafir yorumları"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div aria-hidden className="pointer-events-none absolute -left-10 top-10 select-none font-display text-[26rem] leading-none text-ivory/[0.035]">
        “
      </div>
      <div className="container-x relative grid gap-12 lg:grid-cols-[1fr_3fr]">
        <FadeIn>
          <span className="eyebrow flex items-center gap-3">
            <span className="h-px w-8 bg-gold/60" /> Çiftlerimiz
          </span>
        </FadeIn>
        <div className="min-h-[18rem]">
          <AnimatePresence mode="wait">
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <blockquote className="font-display type-sm text-balance leading-[1.2] text-ivory">
                {t.quote}
              </blockquote>
              <figcaption className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-[11px] uppercase tracking-[0.25em] text-mute">
                <span className="text-gold">{t.name}</span>
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
      </div>
    </section>
  );
}
