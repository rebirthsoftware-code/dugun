export const dynamic = "force-static";

import { ImageResponse } from "next/og";
import { getVenue, venues } from "@/lib/data";
import { OgCard } from "@/app/opengraph-image";

export const alt = "Serenad mekân";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return venues.map((v) => ({ slug: v.slug }));
}

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const v = getVenue(slug);
  return new ImageResponse(
    <OgCard title={v?.name ?? "Serenad"} subtitle={v ? `${v.subtitle} · ${v.capacity.seated} kişi` : "İstanbul"} index={v?.index} />,
    size,
  );
}
