"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { ButtonLink } from "@/components/ui/Button";
import { SplitWords } from "@/components/ui/Reveal";
import type { CtaContent, SiteInfo } from "@/lib/content";

export function CTA({ cta, site }: { cta: CtaContent; site: SiteInfo }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section ref={ref} className="surface-ink relative flex min-h-[90vh] items-center overflow-hidden" aria-label="Davet">
      <motion.div style={{ y }} className="absolute inset-[-12%_0]">
        <Image src={cta.image} alt="" fill sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/40 to-ink" />
      <div className="grain absolute inset-0" />
      <div className="container-x relative z-10 flex flex-col items-center py-32 text-center">
        <span className="eyebrow mb-8 text-gold">{cta.eyebrow}</span>
        <SplitWords as="h2" text={cta.title} className="font-display type-lg text-ivory" />
        <p className="mt-8 max-w-lg text-pretty text-base leading-relaxed text-ivory/75">
          {cta.text}
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/rezervasyon">Tarih Sorgula</ButtonLink>
          <ButtonLink href={site.phoneHref} variant="outline" magnetic={false} className="border-ivory/60">
            {site.phone}
          </ButtonLink>
          <ButtonLink href={site.whatsapp} variant="outline" magnetic={false} target="_blank" rel="noreferrer" className="border-ivory/60">
            WhatsApp
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
