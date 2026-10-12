"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { timeline } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Günün akışı: yatay, snap'li şerit. Masaüstünde ok tuşları, mobilde parmakla kaydırma. */
export function Flow() {
  const strip = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const scrollBy = (dir: number) => {
    const el = strip.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 400) + 24), behavior: "smooth" });
  };

  return (
    <section className="surface-paper relative overflow-hidden py-24 md:py-36" aria-label="Günün akışı">
      <div className="container-x mb-14 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeading eyebrow="Günün akışı" title="Saat saat, bir Konak gecesi." />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Geri"
            className="grid size-12 place-items-center rounded-full border border-tone-strong transition-colors hover:bg-ink hover:text-ivory"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="İleri"
            className="grid size-12 place-items-center rounded-full border border-tone-strong transition-colors hover:bg-ink hover:text-ivory"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>

      <div
        ref={strip}
        onScroll={(e) => {
          const el = e.currentTarget;
          setProgress(el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth));
        }}
        className="scroll-strip flex gap-6 overflow-x-auto px-[clamp(1.25rem,4.5vw,5.5rem)] pb-4"
        data-lenis-prevent
      >
        {timeline.map((t, i) => (
          <motion.article
            key={t.time}
            data-card
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px -10% 0px 0px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
            className="group relative w-[78vw] shrink-0 snap-start sm:w-[52vw] lg:w-[30vw] xl:w-[24vw]"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={t.image}
                alt={t.title}
                fill
                sizes="(min-width: 1280px) 24vw, (min-width: 1024px) 30vw, 78vw"
                className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
              <span className="absolute left-5 top-5 font-display text-4xl text-ivory/90 tabular-nums">{t.time}</span>
              <div className="absolute inset-x-5 bottom-5">
                <span className="eyebrow mb-2 block text-gold">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-3xl text-ivory">{t.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-ivory/70">{t.text}</p>
              </div>
            </div>
          </motion.article>
        ))}
        <div className="w-[clamp(1.25rem,4.5vw,5.5rem)] shrink-0" aria-hidden />
      </div>

      <div className="container-x mt-8">
        <div className="relative h-px w-full bg-tone-line">
          <motion.span
            className="absolute left-0 top-0 h-px bg-gold-2"
            animate={{ width: `${Math.max(8, progress * 100)}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 24 }}
          />
        </div>
      </div>
    </section>
  );
}
