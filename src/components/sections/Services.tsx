"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { services } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/** Hizmet listesi: hover/odak ile sağdaki yapışkan görsel değişir. Mobilde her satır kendi görselini açar. */
export function Services() {
  const [active, setActive] = useState(0);

  return (
    <section id="deneyim" className="surface-ink scroll-mt-20 py-24 md:py-36" aria-label="Deneyim">
      <div className="container-x mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeading eyebrow="Deneyim" title="Her detay, tek bir imzayla." />
        <p className="max-w-sm text-sm leading-relaxed text-tone-mute md:text-right">
          Mutfaktan ışığa, çiçekten koordinasyona; hepsi tek çatı altında, tek bir ekip tarafından.
        </p>
      </div>

      <div className="container-x grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <ul className="divide-y divide-ivory/10 border-y hairline" onMouseLeave={() => undefined}>
          {services.map((s, i) => {
            const isActive = i === active;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-expanded={isActive}
                  className="group flex w-full items-baseline gap-6 py-7 text-left md:py-8"
                >
                  <span className="w-8 shrink-0 font-sans text-[10px] tracking-[0.3em] text-tone-mute">0{i + 1}</span>
                  <span className="flex-1">
                    <span
                      className={cn(
                        "block font-display text-[clamp(2rem,4vw,3.6rem)] leading-none transition-all duration-500",
                        isActive ? "translate-x-3 text-gold" : "text-ivory/80 group-hover:text-ivory",
                      )}
                    >
                      {s.title}
                    </span>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.span
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          className="block overflow-hidden"
                        >
                          <span className="mt-4 block max-w-md translate-x-3 text-sm leading-relaxed text-ivory/65 md:text-base">
                            {s.text}
                          </span>
                          <span className="relative mt-5 block aspect-[4/3] translate-x-3 overflow-hidden lg:hidden">
                            <Image src={s.image} alt={s.title} fill sizes="100vw" className="object-cover" />
                          </span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                  <span className="eyebrow hidden shrink-0 md:block">{s.eyebrow}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <FadeIn className="relative hidden lg:block">
          <div className="sticky top-[calc(var(--header-h)+2rem)] aspect-[4/5] overflow-hidden">
            <AnimatePresence mode="sync">
              {services.map(
                (s, i) =>
                  i === active && (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, scale: 1.06, clipPath: "inset(0 0 100% 0)" }}
                      animate={{ opacity: 1, scale: 1, clipPath: "inset(0 0 0% 0)" }}
                      exit={{ opacity: 0, transition: { duration: 0.4 } }}
                      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                      className="absolute inset-0"
                    >
                      <Image src={s.image} alt={s.title} fill sizes="40vw" className="object-cover" />
                    </motion.div>
                  ),
              )}
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-x-6 bottom-6 flex items-end justify-between">
              <span className="font-display text-5xl text-ivory">0{active + 1}</span>
              <span className="eyebrow">{services[active].eyebrow}</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
