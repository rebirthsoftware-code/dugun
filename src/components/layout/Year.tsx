"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Telif yılı: statik kabukta sabit, istemcide gerçek yıl. */
export function Year() {
  const year = useSyncExternalStore(
    subscribe,
    () => String(new Date().getFullYear()),
    () => "2026",
  );
  return <>{year}</>;
}
