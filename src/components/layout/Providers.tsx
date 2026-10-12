"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { Cursor } from "@/components/ui/Cursor";
import { Preloader } from "./Preloader";

const IntroContext = createContext<boolean>(true);
export const useIntroDone = () => useContext(IntroContext);

const KEY = "konak:intro";

export function Providers({ children }: { children: ReactNode }) {
  // Sunucu ve ilk hidrasyon: intro "bitmiş" varsayılır (içerik her zaman erişilebilir).
  // İstemcide, bu oturumda ilk ziyaretse perde oynatılır.
  const [showIntro, setShowIntro] = useState(false);
  const [done, setDone] = useState(true);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY)) return;
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* private mode */
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const raf = requestAnimationFrame(() => {
      setShowIntro(true);
      setDone(false);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <IntroContext.Provider value={done}>
      <SmoothScroll>
        {showIntro && <Preloader onDone={() => setDone(true)} />}
        <Cursor />
        {children}
      </SmoothScroll>
    </IntroContext.Provider>
  );
}
