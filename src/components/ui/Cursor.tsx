"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Özel imleç. Yalnızca hassas işaretçili (mouse) cihazlarda etkinleşir.
 * [data-cursor="text"] ile üzerine gelinen öğe için etiket gösterir.
 */
export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.6 });
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;
    const raf = requestAnimationFrame(() => setEnabled(true));
    document.documentElement.classList.add("custom-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor], a, button, [role=button]");
      if (!el) {
        setLabel(null);
        setActive(false);
        return;
      }
      const text = el.dataset.cursor;
      setLabel(text && text !== "true" ? text : null);
      setActive(true);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  const size = label ? 96 : active ? 44 : 12;

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[200] mix-blend-difference"
    >
      <motion.div
        animate={{ width: size, height: size, x: -size / 2, y: -size / 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="flex items-center justify-center rounded-full bg-ivory text-ink"
      >
        {label && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em]"
          >
            {label}
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
}
