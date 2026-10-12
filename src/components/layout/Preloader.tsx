"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";

const ease = [0.76, 0, 0.24, 1] as const;

export function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(true);
  const lenis = useLenis();

  useEffect(() => {
    lenis?.stop();
    const start = performance.now();
    const dur = 1600;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setOpen(false), 300);
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
          exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 1.1, ease } }}
          aria-hidden
        >
          <div className="flex items-center justify-between font-sans text-[10px] uppercase tracking-[0.35em] text-mute">
            <span>Ortahisar · Trabzon</span>
            <span>Düğün Salonu</span>
          </div>

          <div className="flex flex-col items-center gap-10">
            <svg width="88" height="88" viewBox="0 0 88 88" fill="none" className="text-gold">
              <motion.circle
                cx="44"
                cy="44"
                r="40"
                stroke="currentColor"
                strokeWidth="1"
                initial={{ pathLength: 0, rotate: -90 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: "50% 50%" }}
              />
              <motion.rect
                x="26"
                y="26"
                width="36"
                height="36"
                stroke="#f4efe6"
                strokeWidth="1"
                initial={{ pathLength: 0, rotate: 45, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: "50% 50%" }}
              />
              <motion.circle cx="44" cy="44" r="2.5" fill="currentColor" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9 }} />
            </svg>
            <div className="overflow-hidden">
              <motion.p
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-[clamp(2.5rem,6vw,5rem)] tracking-[0.18em] text-ivory"
              >
                KONAK
              </motion.p>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <span className="font-display text-xl italic text-ivory-2">Hoş geldiniz</span>
            <span className="font-display text-5xl leading-none tabular-nums text-ivory">{String(count).padStart(3, "0")}</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-ivory/10">
            <div className="h-full bg-gold transition-[width] duration-75" style={{ width: `${count}%` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
