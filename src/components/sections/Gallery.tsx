"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { gallery } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";

/** Ana sayfa galeri önizlemesi: üç sütun, farklı hızlarda paralaks. */
export function GalleryPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const cols = [
    { y: y1, items: [gallery[1], gallery[6], gallery[3]] },
    { y: y2, items: [gallery[2], gallery[10], gallery[9]] },
    { y: y3, items: [gallery[5], gallery[4], gallery[7]] },
  ];

  return (
    <section className="surface-white container-x py-24 md:py-36" aria-label="Galeri">
      <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeading eyebrow="Galeri" title="Anlar, ışıkla yazılır." />
        <ButtonLink href="/galeri" variant="outline">
          Tüm galeri
        </ButtonLink>
      </div>
      <div ref={ref} className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
        {cols.map((c, ci) => (
          <motion.div key={ci} style={{ y: c.y }} className={ci === 2 ? "hidden flex-col gap-4 md:flex md:gap-6" : "flex flex-col gap-4 md:gap-6"}>
            {c.items.map((g, gi) => (
              <div
                key={g.src}
                data-cursor="Gör"
                className="group relative overflow-hidden rounded-sm"
                style={{ aspectRatio: `${g.w} / ${g.h}`, marginTop: ci === 1 && gi === 0 ? "4rem" : undefined }}
              >
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
                />
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
