"use client";

import { useEffect, useState } from "react";

const fmt = new Intl.DateTimeFormat("tr-TR", {
  timeZone: "Europe/Istanbul",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

/** İstanbul yerel saati. Sunucuda boş; istemcide canlı. */
export function IstanbulClock() {
  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {time || "--:--:--"}
    </span>
  );
}
