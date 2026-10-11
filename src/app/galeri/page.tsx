import type { Metadata } from "next";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTA } from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "Galeri",
  description: "Serenad'da yaşanmış düğünlerden kareler: Boğaz Salonu, Kış Bahçesi ve Teras.",
};

export default function GalleryPage() {
  return (
    <>
      <section className="container-x pb-16 pt-[calc(var(--header-h)+4rem)] md:pt-[calc(var(--header-h)+7rem)]">
        <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading as="h1" eyebrow="Galeri" title="Işıkla yazılmış anlar." />
          <p className="max-w-sm text-sm leading-relaxed text-mute md:text-right">
            Her kare gerçek bir Serenad gecesinden. Büyütmek için tıklayın; ok tuşlarıyla gezin.
          </p>
        </div>
        <GalleryGrid />
      </section>
      <CTA />
    </>
  );
}
