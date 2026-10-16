"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import { useLenis } from "lenis/react";
import type { GalleryItem } from "@/lib/content";

/** Tam galeri: masonry düzen + klavye destekli lightbox. */
export function GalleryGrid({ gallery }: { gallery: GalleryItem[] }) {
  const [active, setActive] = useState<number | null>(null);
  const lenis = useLenis();

  const close = useCallback(() => setActive(null), []);
  const n = gallery.length;
  const step = useCallback((d: number) => setActive((a) => (a === null ? a : (a + d + n) % n)), [n]);

  useEffect(() => {
    if (active === null) {
      lenis?.start();
      return;
    }
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close, step, lenis]);

  return (
    <>
      <div className="columns-2 gap-4 md:columns-3 md:gap-6 xl:columns-4">
        {gallery.map((g, i) => (
          <motion.button
            key={g.src}
            type="button"
            onClick={() => setActive(i)}
            data-cursor="Büyüt"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5% 0px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: (i % 4) * 0.08 }}
            className="group relative mb-4 block w-full overflow-hidden rounded-sm md:mb-6"
            style={{ aspectRatio: `${g.w} / ${g.h}` }}
            aria-label={`${g.alt} görselini büyüt`}
          >
            <Image
              src={g.src}
              alt={g.alt}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
            />
            <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-ink/80 to-transparent p-4 text-left font-sans text-[11px] uppercase tracking-[0.2em] text-ivory transition-transform duration-500 group-hover:translate-y-0">
              {g.alt}
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={gallery[active].alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-md md:p-12"
            onClick={close}
            data-lenis-prevent
          >
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-h-full w-full max-w-5xl"
              style={{ aspectRatio: `${gallery[active].w} / ${gallery[active].h}`, maxHeight: "85vh" }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={gallery[active].src} alt={gallery[active].alt} fill sizes="90vw" className="object-contain" priority />
            </motion.div>

            <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-6 font-sans text-[11px] uppercase tracking-[0.25em] text-ivory/70">
              <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Önceki" className="grid size-11 place-items-center rounded-full border border-ivory/20 hover:bg-ivory hover:text-ink">
                <ArrowLeft className="size-4" />
              </button>
              <span className="tabular-nums">
                {String(active + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}
              </span>
              <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Sonraki" className="grid size-11 place-items-center rounded-full border border-ivory/20 hover:bg-ivory hover:text-ink">
                <ArrowRight className="size-4" />
              </button>
            </div>
            <button type="button" onClick={close} aria-label="Kapat" className="absolute right-6 top-6 grid size-11 place-items-center rounded-full border border-ivory/20 text-ivory hover:bg-ivory hover:text-ink">
              <X className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
