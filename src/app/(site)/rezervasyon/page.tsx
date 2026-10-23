import type { Metadata } from "next";
import { Availability } from "@/components/sections/Availability";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQ } from "@/components/sections/FAQ";
import { getContent } from "@/lib/content";

// GitHub yazımları ve yeniden denemeler için sunucu fonksiyonu süresi
export const maxDuration = 60;

export const metadata: Metadata = {
  title: "Rezervasyon & Tarih Sorgula",
  description: "Konak Düğün Salonu için anlık tarih uygunluğunu görün ve rezervasyon talebi bırakın.",
};

export default async function ReservationPage() {
  const c = await getContent();
  return (
    <>
      <section className="container-x pt-[calc(var(--header-h)+4rem)] md:pt-[calc(var(--header-h)+7rem)]">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading as="h1" eyebrow="Rezervasyon" title="Gününüz hâlâ boş mu?" />
          <p className="max-w-sm text-sm leading-relaxed text-tone-mute md:text-right">
            Takvimden bir gün seçin, anlık uygunluğu görün ve talebinizi bırakın. Acil sorularınız için{" "}
            <a href={c.site.phoneHref} className="text-tone-gold underline-offset-4 hover:underline">
              {c.site.phone}
            </a>
            .
          </p>
        </div>
      </section>
      <Availability compact eventTypes={c.eventTypes} />
      <FAQ faqs={c.faqs} />
    </>
  );
}
