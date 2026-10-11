"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { venues } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Masaüstünde dikey kaydırmayı yatay bir "salon yürüyüşüne" çevirir (pinned horizontal scroll).
 * Mobilde doğal dikey akış kullanılır.
 */
export function Venues() {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  return (
    <section id="mekanlar" className="relative scroll-mt-20" aria-label="Mekânlar">
      <div className="container-x flex flex-col gap-8 pb-10 pt-10 md:flex-row md:items-end md:justify-between">
        <SectionHeading eyebrow="Mekânlar" title="Üç salon, üç ayrı karakter." />
        <p className="max-w-sm text-sm leading-relaxed text-mute md:text-right">
          Altı yüz kişilik bir balodan kırk kişilik bir gün batımı nikâhına; her ölçekte aynı özen.
        </p>
      </div>

      {/* Masaüstü: pinned yatay kaydırma */}
      <div ref={outer} className="relative hidden lg:block" style={{ height: `${venues.length * 90 + 40}vh` }}>
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <motion.div ref={track} style={{ x }} className="flex gap-[4vw] pl-[clamp(1.25rem,4vw,4.5rem)] pr-[8vw]">
            {venues.map((v) => (
              <VenueCard key={v.slug} v={v} />
            ))}
            <div className="flex w-[30vw] shrink-0 flex-col justify-center">
              <p className="font-display type-sm italic text-ivory-2">Hangisi sizin hikâyeniz?</p>
              <Link
                href="/rezervasyon"
                className="mt-6 inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.25em] text-gold"
              >
                Tarih sorgula <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobil / tablet: dikey liste */}
      <div className="container-x flex flex-col gap-10 pb-10 lg:hidden">
        {venues.map((v) => (
          <VenueCard key={v.slug} v={v} />
        ))}
      </div>
    </section>
  );
}

function VenueCard({ v }: { v: (typeof venues)[number] }) {
  return (
    <Link
      href={`/mekanlar/${v.slug}`}
      data-cursor="Keşfet"
      className="group relative flex w-full shrink-0 flex-col lg:w-[62vw] xl:w-[56vw]"
      style={{ "--accent": v.accent } as React.CSSProperties}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-sm lg:aspect-[16/10]">
        <Image
          src={v.image}
          alt={v.name}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
        <span className="absolute left-5 top-5 font-display text-5xl text-ivory/70">{v.index}</span>
        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-2" style={{ color: "var(--accent)" }}>
              {v.subtitle}
            </p>
            <h3 className="font-display type-sm text-ivory">{v.name}</h3>
          </div>
          <span className="grid size-12 shrink-0 place-items-center rounded-full border border-ivory/30 text-ivory transition-all duration-500 group-hover:bg-ivory group-hover:text-ink">
            <ArrowUpRight className="size-5" />
          </span>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-4 border-t hairline pt-5 font-sans text-[11px] uppercase tracking-[0.2em] text-mute">
        <span>
          <b className="mb-1 block font-display text-2xl normal-case tracking-normal text-ivory">{v.capacity.seated}</b>
          Oturmalı
        </span>
        <span>
          <b className="mb-1 block font-display text-2xl normal-case tracking-normal text-ivory">{v.capacity.cocktail}</b>
          Kokteyl
        </span>
        <span>
          <b className="mb-1 block font-display text-2xl normal-case tracking-normal text-ivory">{v.area} m²</b>
          Alan
        </span>
      </div>
    </Link>
  );
}
