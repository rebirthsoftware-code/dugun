"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { ButtonLink } from "@/components/ui/Button";
import { SplitWords } from "@/components/ui/Reveal";
import { photos } from "@/lib/data";
import { SITE } from "@/lib/utils";

export function CTA() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section ref={ref} className="relative flex min-h-[90vh] items-center overflow-hidden bg-ink" aria-label="Davet">
      <motion.div style={{ y }} className="absolute inset-[-12%_0]">
        <Image src={photos.silhouette} alt="" fill sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/40 to-ink" />
      <div className="grain absolute inset-0" />
      <div className="container-x relative z-10 flex flex-col items-center py-32 text-center">
        <span className="eyebrow mb-8 text-gold">Bir kahve, bir tur, bir hayal</span>
        <SplitWords as="h2" text="Hikâyenizi birlikte yazalım." className="font-display type-lg text-ivory" />
        <p className="mt-8 max-w-lg text-pretty text-base leading-relaxed text-ivory/75">
          Salonu gezmek, menüyü tatmak ve tarihinizi konuşmak için sizi Ortahisar’a bekliyoruz.
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/rezervasyon">Tarih Sorgula</ButtonLink>
          <ButtonLink href={SITE.phoneHref} variant="outline" magnetic={false}>
            {SITE.phone}
          </ButtonLink>
          <ButtonLink href={SITE.whatsapp} variant="outline" magnetic={false} target="_blank" rel="noreferrer">
            WhatsApp
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
