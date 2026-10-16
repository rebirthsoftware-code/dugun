export const dynamic = "force-static";

import { ImageResponse } from "next/og";
import { getEventType, eventTypes } from "@/lib/data";
import { OgCard } from "@/app/opengraph-image";

export const alt = "Konak etkinlik";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return eventTypes.map((v) => ({ slug: v.slug }));
}

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const v = getEventType(slug);
  return new ImageResponse(
    <OgCard title={v?.name ?? "Konak"} subtitle={v ? `${v.subtitle} · ${v.capacity} kişiye kadar` : "Trabzon"} index={v?.index} />,
    size,
  );
}
