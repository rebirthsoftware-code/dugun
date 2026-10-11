export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { SITE } from "@/lib/utils";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.fullName,
    short_name: SITE.name,
    description: SITE.description,
    start_url: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/`,
    display: "standalone",
    background_color: "#0b0a0a",
    theme_color: "#0b0a0a",
    icons: [{ src: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/icon.svg`, sizes: "any", type: "image/svg+xml" }],
  };
}
