import type { MetadataRoute } from "next";
import { SITE } from "@/lib/utils";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.fullName,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0b0a0a",
    theme_color: "#0b0a0a",
    icons: [{ src: "/icon", sizes: "32x32", type: "image/png" }],
  };
}
