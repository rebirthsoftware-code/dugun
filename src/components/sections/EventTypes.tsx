"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { EventType } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn, ClipReveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function EventTypes({ eventTypes }: { eventTypes: EventType[] }) {
  return (
    <section id="etkinlikler" className="surface-white relative scroll-mt-20 py-24 md:py-36" aria-label="Etkinlikler">
      <div className="container-x mb-20 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeading eyebrow="Etkinlikler" title="Her anınız için ayrı bir sahne." />
        <p className="max-w-sm text-sm leading-relaxed text-tone-mute md:text-right">
          Düğünden nişana, kınadan matineye ve kurumsal toplantıya; her etkinlik türü için ayrı düzen, aynı özen.
        </p>
      </div>

      <div className="flex flex-col gap-28 md:gap-40">
        {eventTypes.map((v, i) => (
          <EventBlock key={v.slug} v={v} flip={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

function EventBlock({ v, flip }: { v: EventType; flip: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const numY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <div ref={ref} className="container-x relative">
      <motion.span
        style={{ y: numY }}
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-[-0.35em] z-0 select-none font-display text-[clamp(8rem,22vw,22rem)] leading-none text-outline",
          flip ? "right-[2vw]" : "left-[2vw]",
        )}
      >
        {v.index}
      </motion.span>

      <div className={cn("relative z-10 grid items-end gap-10 lg:grid-cols-12 lg:gap-8", flip && "lg:[direction:rtl]")}>
        <ClipReveal className="lg:col-span-8 lg:[direction:ltr]">
          <Link href={`/etkinlikler/${v.slug}`} data-cursor="Keşfet" className="group relative block aspect-[16/10] overflow-hidden">
            <motion.div style={{ y: imgY }} className="absolute inset-[-12%_0]">
              <Image
                src={v.image}
                alt={v.name}
                fill
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-70" />
          </Link>
        </ClipReveal>

        <div className="lg:col-span-4 lg:[direction:ltr] lg:pb-6">
          <FadeIn>
            <p className="eyebrow mb-4" style={{ color: v.accent }}>
              {v.subtitle}
            </p>
            <h3 className="font-display type-md">
              <Link href={`/etkinlikler/${v.slug}`} className="transition-colors hover:text-gold-2">
                {v.name}
              </Link>
            </h3>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-tone-mute">{v.description}</p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-tone pt-6 font-sans text-[10px] uppercase tracking-[0.25em] text-tone-mute">
              <div>
                <dd className="mb-1 font-display text-3xl normal-case tracking-normal text-tone">{v.capacity}</dd>
                <dt>Kişiye kadar</dt>
              </div>
              <div>
                <dd className="mb-1 font-display text-3xl normal-case tracking-normal text-tone">{v.duration}</dd>
                <dt>Süre</dt>
              </div>
              <div>
                <dd className="mb-1 font-display text-xl normal-case tracking-normal text-tone">{v.format}</dd>
                <dt>Düzen</dt>
              </div>
            </dl>
            <Link
              href={`/etkinlikler/${v.slug}`}
              className="group mt-8 inline-flex items-center gap-3 font-sans text-[11px] uppercase tracking-[0.25em] text-tone-gold"
            >
              Detayları gör
              <span className="grid size-9 place-items-center rounded-full border border-current/40 transition-all duration-500 group-hover:bg-gold group-hover:text-ink">
                <ArrowUpRight className="size-4" />
              </span>
            </Link>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
