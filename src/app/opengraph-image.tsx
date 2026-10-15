export const dynamic = "force-static";

import { ImageResponse } from "next/og";
import { SITE } from "@/lib/utils";

export const alt = `${SITE.name} · ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(<OgCard title="Hayatınızın en güzel günü." subtitle="Düğün Salonu · Meydan, Trabzon" />, size);
}

export function OgCard({ title, subtitle, index }: { title: string; subtitle: string; index?: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "radial-gradient(120% 90% at 85% 10%, #2a1416 0%, #0b0a0a 55%)",
        color: "#f3ede3",
        fontFamily: "Georgia, serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 22, letterSpacing: 8, color: "#d4b483" }}>
        <span>KONAK</span>
        <span>{index ?? "TRABZON"}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 96, lineHeight: 1, letterSpacing: -2, maxWidth: 1000 }}>{title}</div>
        <div style={{ fontSize: 26, color: "#8d8578", letterSpacing: 4 }}>{subtitle.toUpperCase()}</div>
      </div>
      <div style={{ height: 1, background: "linear-gradient(90deg,#d4b483,transparent)" }} />
    </div>
  );
}
