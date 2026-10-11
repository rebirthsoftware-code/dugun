"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";

const words = ["Hoş geldiniz", "Serenad'a", "İstanbul"];

export function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(true);
  const lenis = useLenis();

  useEffect(() => {
    lenis?.stop();
    const start = performance.now();
    const dur = 1500;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setOpen(false), 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence
      onExitComplete={() => {
        lenis?.start();
        onDone();
      }}
    >
      {open && (
        <motion.div
          key="curtain"
          className="fixed inset-0 z-[300] flex flex-col justify-between bg-ink px-6 py-6 text-ivory md:px-12 md:py-10"
          exit={{ y: "-100%", transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } }}
          aria-hidden
        >
          <div className="flex items-center justify-between font-sans text-[11px] uppercase tracking-[0.3em] text-mute">
            <span>Serenad</span>
            <span>Davet & Balo</span>
          </div>
          <div className="flex items-end justify-between">
            <div className="font-display text-[clamp(1.5rem,3vw,2.5rem)] italic leading-none text-ivory-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={Math.min(words.length - 1, Math.floor(count / 34))}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="block"
                >
                  {words[Math.min(words.length - 1, Math.floor(count / 34))]}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="font-display text-[clamp(5rem,16vw,14rem)] leading-[0.8] tabular-nums text-ivory">
              {count}
            </div>
          </div>
          <div className="h-px w-full bg-ivory/10">
            <div className="h-full bg-gold transition-[width] duration-75" style={{ width: `${count}%` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
