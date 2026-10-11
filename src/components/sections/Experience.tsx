"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { services } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Üst üste yapışan ve arkada küçülen kartlar (stacked sticky cards). */
export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section id="deneyim" className="scroll-mt-20 bg-ink-2 py-24 md:py-36" aria-label="Deneyim">
      <div className="container-x mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeading eyebrow="Deneyim" title="Her detay, tek bir imzayla." />
        <p className="max-w-sm text-sm leading-relaxed text-mute md:text-right">
          Mutfaktan ışığa, çiçekten koordinasyona; hepsi tek çatı altında, tek bir ekip tarafından.
        </p>
      </div>

      <div ref={ref} className="container-x">
        {services.map((s, i) => (
          <Card key={s.id} s={s} i={i} total={services.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}

function Card({
  s,
  i,
  total,
  progress,
}: {
  s: (typeof services)[number];
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = i / total;
  const end = 1;
  const scale = useTransform(progress, [start, end], [1, 1 - (total - i) * 0.035]);
  const filter = useTransform(progress, [start, end], ["brightness(1)", `brightness(${1 - (total - i) * 0.12})`]);

  return (
    <div className="sticky" style={{ top: `calc(var(--header-h) + ${i * 1.25}rem)`, paddingBottom: `${(total - i) * 1.25}rem` }}>
      <motion.article
        style={{ scale, filter, transformOrigin: "top center" }}
        className="grid min-h-[60vh] overflow-hidden rounded-sm border hairline bg-ink-3 md:grid-cols-2"
      >
        <div className="relative order-2 min-h-[260px] md:order-1">
          <Image src={s.image} alt={s.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-3/0 to-ink-3/40 md:bg-gradient-to-l" />
        </div>
        <div className="order-1 flex flex-col justify-between gap-10 p-8 md:order-2 md:p-14">
          <div className="flex items-center justify-between">
            <span className="eyebrow">{s.eyebrow}</span>
            <span className="font-display text-3xl text-ivory/30">0{i + 1}</span>
          </div>
          <div>
            <h3 className="font-display type-md text-ivory">{s.title}</h3>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/70">{s.text}</p>
          </div>
        </div>
      </motion.article>
    </div>
  );
}
