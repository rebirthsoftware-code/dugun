"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";
import { stats } from "@/lib/data";

function Counter({ value, decimals = 0, suffix = "" }: { value: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(v),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {n.toLocaleString("tr-TR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

export function Numbers() {
  return (
    <section className="container-x border-y hairline py-16 md:py-24" aria-label="Rakamlarla Serenad">
      <dl className="grid grid-cols-2 gap-y-12 md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className={i > 0 ? "md:border-l md:hairline md:pl-10" : ""}>
            <dd className="font-display type-md text-ivory">
              <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
            </dd>
            <dt className="mt-3 font-sans text-[11px] uppercase tracking-[0.25em] text-mute">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
