import type { Metadata } from "next";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTA } from "@/components/sections/CTA";
import { getContent } from "@/lib/content";

// GitHub yazımları ve yeniden denemeler için sunucu fonksiyonu süresi
export const maxDuration = 60;

export const metadata: Metadata = {
  title: "Galeri",
  description: "Konak'ta yaşanmış düğün, nişan ve kına gecelerinden kareler.",
};

export default async function GalleryPage() {
  const c = await getContent();
  return (
    <>
      <section className="container-x pb-16 pt-[calc(var(--header-h)+4rem)] md:pt-[calc(var(--header-h)+7rem)]">
        <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading as="h1" eyebrow="Galeri" title="Işıkla yazılmış anlar." />
          <p className="max-w-sm text-sm leading-relaxed text-tone-mute md:text-right">
            Her kare gerçek bir Konak gecesinden. Büyütmek için tıklayın; ok tuşlarıyla gezin.
          </p>
        </div>
        <GalleryGrid gallery={c.gallery} />
      </section>
      <CTA cta={c.cta} site={c.site} />
    </>
  );
}
