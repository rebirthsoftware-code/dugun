"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { FadeIn } from "@/components/ui/Reveal";

const text =
  "Bir düğün, iki ailenin ilk ortak hatırasıdır. Biz o hatırayı ışıkla, lezzetle ve zamanla işleriz. On sekiz yıldır Boğaz'ın kıyısında, her çiftin hikâyesine ayrı bir sahne kuruyoruz.";

function Word({ children, range, progress }: { children: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block will-change-[opacity,transform]">
      {children}&nbsp;
    </motion.span>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");

  return (
    <section className="container-x relative py-28 md:py-44" aria-label="Manifesto">
      <div className="grid gap-12 lg:grid-cols-[1fr_3fr]">
        <FadeIn>
          <span className="eyebrow flex items-center gap-3">
            <span className="h-px w-8 bg-gold/60" /> Manifesto
          </span>
        </FadeIn>
        <div ref={ref}>
          <p className="font-display type-sm text-balance leading-[1.18] text-ivory">
            {words.map((w, i) => (
              <Word key={i} progress={scrollYProgress} range={[i / words.length, Math.min(1, (i + 3) / words.length)]}>
                {w}
              </Word>
            ))}
          </p>
          <FadeIn delay={0.2} className="mt-12 flex flex-wrap gap-x-12 gap-y-4 font-sans text-[11px] uppercase tracking-[0.25em] text-mute">
            <span>Est. 2008</span>
            <span>Kuruçeşme · İstanbul</span>
            <span>1.200+ Davet</span>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
