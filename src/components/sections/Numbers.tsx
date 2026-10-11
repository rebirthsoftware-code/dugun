"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";

export function Counter({ value, decimals = 0, suffix = "" }: { value: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, { duration: 2.2, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(v) });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {n.toLocaleString("tr-TR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}
