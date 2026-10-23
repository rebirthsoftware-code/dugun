import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { getContent } from "@/lib/content";
import { ButtonLink } from "@/components/ui/Button";
import { FadeIn, SplitWords, ClipReveal } from "@/components/ui/Reveal";
import { Availability } from "@/components/sections/Availability";

// GitHub yazımları ve yeniden denemeler için sunucu fonksiyonu süresi
export const maxDuration = 60;

export async function generateMetadata({ params }: PageProps<"/etkinlikler/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = await getContent();
  const v = c.eventTypes.find((e) => e.slug === slug);
  if (!v) return {};
  return {
    title: v.name,
    description: `${v.name} · ${v.subtitle}. ${v.description}`,
    openGraph: { title: `${v.name} · ${c.site.name}`, description: v.description },
  };
}

export default async function VenuePage({ params }: PageProps<"/etkinlikler/[slug]">) {
  const { slug } = await params;
  const c = await getContent();
  const eventTypes = c.eventTypes;
  const v = eventTypes.find((e) => e.slug === slug);
  if (!v) notFound();

  const idx = eventTypes.findIndex((x) => x.slug === v.slug);
  const next = eventTypes[(idx + 1) % eventTypes.length];

  return (
    <article style={{ "--accent": v.accent } as React.CSSProperties}>
      {/* Başlık + fotoğraf paneli */}
      <section className="surface-white pt-[calc(var(--header-h)+2.5rem)] md:pt-[calc(var(--header-h)+4rem)]">
        <div className="container-x">
          <FadeIn>
            <Link href="/#etkinlikler" className="mb-10 inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.25em] text-tone-mute hover:text-ink">
              <ArrowLeft className="size-3" /> Tüm etkinlikler
            </Link>
          </FadeIn>
          <div className="flex flex-col gap-10 pb-12 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-4">
                {v.index} · {v.subtitle}
              </p>
              <SplitWords as="h1" text={v.name} className="font-display type-xl text-ink" />
            </div>
            <FadeIn delay={0.3} className="grid grid-cols-3 gap-8 border-l border-tone pl-8 font-sans text-[11px] uppercase tracking-[0.2em] text-tone-mute">
              <span>
                <b className="mb-1 block font-display text-3xl font-light normal-case tracking-normal text-ink">{v.capacity}</b>
                Kişiye kadar
              </span>
              <span>
                <b className="mb-1 block font-display text-3xl font-light normal-case tracking-normal text-ink">{v.duration}</b>
                Süre
              </span>
              <span>
                <b className="mb-1 block font-display text-xl font-light normal-case tracking-normal text-ink">{v.format}</b>
                Düzen
              </span>
            </FadeIn>
          </div>
        </div>
        <div className="container-x">
          <ViewTransition name={`venue-${v.slug}`}>
            <ClipReveal className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/10] lg:aspect-[21/10]">
              <Image src={v.image} alt={v.name} fill priority sizes="100vw" className="object-cover" />
              <div className="grain absolute inset-0" />
            </ClipReveal>
          </ViewTransition>
        </div>
      </section>

      {/* Hikâye */}
      <section className="surface-white container-x grid gap-12 py-24 lg:grid-cols-[1fr_1.6fr] md:py-36">
        <FadeIn>
          <span className="eyebrow flex items-center gap-3">
            <span className="h-px w-10 bg-current opacity-60" /> Hikâye
          </span>
        </FadeIn>
        <div>
          <SplitWords as="p" text={v.description} className="font-display type-sm leading-[1.2] text-ink" />
          <FadeIn delay={0.2}>
            <p className="mt-10 max-w-2xl text-base leading-relaxed text-tone-mute md:text-lg">{v.story}</p>
          </FadeIn>
        </div>
      </section>

      {/* Özellikler + galeri */}
      <section className="surface-paper">
        <div className="container-x grid gap-16 py-24 lg:grid-cols-[1fr_1.4fr] md:py-32">
          <div>
            <FadeIn>
              <span className="eyebrow mb-8 flex items-center gap-3">
                <span className="h-px w-10 bg-current opacity-60" /> Özellikler
              </span>
            </FadeIn>
            <ul className="divide-y divide-tone border-y border-tone">
              {v.features.map((f, i) => (
                <FadeIn key={f} delay={i * 0.05}>
                  <li className="flex items-center gap-4 py-4 font-display text-xl text-ink md:text-2xl">
                    <Check className="size-4 shrink-0 text-gold-2" />
                    {f}
                  </li>
                </FadeIn>
              ))}
            </ul>
            <div className="mt-10">
              <ButtonLink href="/rezervasyon">Tarih Sorgula</ButtonLink>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {v.gallery.map((src, i) => (
              <ClipReveal key={src} delay={i * 0.08} className={i % 3 === 0 ? "col-span-2" : ""}>
                <div className={`relative overflow-hidden ${i % 3 === 0 ? "aspect-[16/10]" : "aspect-[4/5]"}`}>
                  <Image src={src} alt={`${v.name} ${i + 1}`} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                </div>
              </ClipReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Takvim */}
      <section className="surface-white">
        <div className="container-x pt-20">
          <span className="eyebrow flex items-center gap-3">
            <span className="h-px w-10 bg-current opacity-60" /> Uygunluk
          </span>
          <h2 className="mt-5 font-display type-md text-ink">{v.name} için tarihinizi seçin.</h2>
        </div>
        <Availability compact eventTypes={eventTypes} />
        <div className="pb-10" />
      </section>

      {/* Sonraki */}
      <Link href={`/etkinlikler/${next.slug}`} className="group relative block overflow-hidden bg-ink text-ivory" data-cursor="Sonraki">
        <ViewTransition name={`venue-${next.slug}`}>
          <div className="absolute inset-0">
            <Image src={next.image} alt="" fill sizes="100vw" className="object-cover opacity-40 transition-all duration-[1.4s] group-hover:scale-105 group-hover:opacity-60" />
          </div>
        </ViewTransition>
        <div className="container-x relative z-10 flex items-end justify-between py-28">
          <div>
            <p className="eyebrow mb-4 text-gold">Sonraki etkinlik</p>
            <p className="font-display type-lg">{next.name}</p>
          </div>
          <span className="grid size-16 place-items-center rounded-full border border-ivory/30 transition-all duration-500 group-hover:bg-ivory group-hover:text-ink">
            <ArrowUpRight className="size-6" />
          </span>
        </div>
      </Link>
    </article>
  );
}
