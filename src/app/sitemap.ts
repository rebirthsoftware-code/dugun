export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { eventTypes } from "@/lib/data";
import { SITE } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-01");
  return [
    { url: SITE.url, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/galeri`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/rezervasyon`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    ...eventTypes.map((v) => ({
      url: `${SITE.url}/etkinlikler/${v.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
