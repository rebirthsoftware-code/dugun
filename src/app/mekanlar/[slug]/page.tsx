import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { getVenue, venues } from "@/lib/data";
import { SITE } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { FadeIn, SplitWords, ClipReveal } from "@/components/ui/Reveal";
import { Availability } from "@/components/sections/Availability";

export async function generateStaticParams() {
  return venues.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: PageProps<"/mekanlar/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const v = getVenue(slug);
  if (!v) return {};
  return {
    title: v.name,
    description: `${v.name} · ${v.subtitle}. ${v.description}`,
    openGraph: { title: `${v.name} · ${SITE.name}`, description: v.description },
  };
}

export default async function VenuePage({ params }: PageProps<"/mekanlar/[slug]">) {
  const { slug } = await params;
  const v = getVenue(slug);
  if (!v) notFound();

  const idx = venues.findIndex((x) => x.slug === v.slug);
  const next = venues[(idx + 1) % venues.length];

  return (
    <article style={{ "--accent": v.accent } as React.CSSProperties}>
      {/* Hero */}
      <section className="relative flex min-h-[92svh] items-end overflow-hidden">
        <ViewTransition name={`venue-${v.slug}`}>
          <div className="absolute inset-0">
            <Image src={v.image} alt={v.name} fill priority sizes="100vw" className="object-cover" />
          </div>
        </ViewTransition>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
        <div className="container-x relative z-10 w-full pb-16 pt-[calc(var(--header-h)+4rem)]">
          <FadeIn>
            <Link href="/#mekanlar" className="mb-10 inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.25em] text-ivory/70 hover:text-ivory">
              <ArrowLeft className="size-3" /> Tüm mekânlar
            </Link>
          </FadeIn>
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-4" style={{ color: "var(--accent)" }}>
                {v.index} · {v.subtitle}
              </p>
              <SplitWords as="h1" text={v.name} className="font-display type-xl text-ivory" />
            </div>
            <FadeIn delay={0.3} className="grid grid-cols-3 gap-8 border-l hairline pl-8 font-sans text-[11px] uppercase tracking-[0.2em] text-mute">
              <span>
                <b className="mb-1 block font-display text-3xl normal-case tracking-normal text-ivory">{v.capacity.seated}</b>
                Oturmalı
              </span>
              <span>
                <b className="mb-1 block font-display text-3xl normal-case tracking-normal text-ivory">{v.capacity.cocktail}</b>
                Kokteyl
              </span>
              <span>
                <b className="mb-1 block font-display text-3xl normal-case tracking-normal text-ivory">{v.area}</b>
                m²
              </span>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Hikâye */}
      <section className="container-x grid gap-12 py-24 lg:grid-cols-[1fr_1.6fr] md:py-36">
        <FadeIn>
          <span className="eyebrow flex items-center gap-3">
            <span className="h-px w-8 bg-gold/60" /> Hikâye
          </span>
        </FadeIn>
        <div>
          <SplitWords as="p" text={v.description} className="font-display type-sm leading-[1.2] text-ivory" />
          <FadeIn delay={0.2}>
            <p className="mt-10 max-w-2xl text-base leading-relaxed text-ivory/70 md:text-lg">{v.story}</p>
          </FadeIn>
        </div>
      </section>

      {/* Özellikler + galeri */}
      <section className="container-x grid gap-16 border-t hairline py-24 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <FadeIn>
            <span className="eyebrow mb-8 flex items-center gap-3">
              <span className="h-px w-8 bg-gold/60" /> Özellikler
            </span>
          </FadeIn>
          <ul className="divide-y divide-ivory/10 border-y hairline">
            {v.features.map((f, i) => (
              <FadeIn key={f} delay={i * 0.05}>
                <li className="flex items-center gap-4 py-4 font-display text-xl text-ivory md:text-2xl">
                  <Check className="size-4 shrink-0" style={{ color: "var(--accent)" }} />
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
              <div className={`relative overflow-hidden rounded-sm ${i % 3 === 0 ? "aspect-[16/10]" : "aspect-[4/5]"}`}>
                <Image src={src} alt={`${v.name} ${i + 1}`} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              </div>
            </ClipReveal>
          ))}
        </div>
      </section>

      {/* Takvim */}
      <section className="border-t hairline bg-ink-2">
        <div className="container-x pt-20">
          <span className="eyebrow flex items-center gap-3">
            <span className="h-px w-8 bg-gold/60" /> Uygunluk
          </span>
          <h2 className="mt-5 font-display type-md text-ivory">{v.name} için tarihinizi seçin.</h2>
        </div>
        <Availability compact />
        <div className="pb-10" />
      </section>

      {/* Sonraki */}
      <Link href={`/mekanlar/${next.slug}`} className="group relative block overflow-hidden border-t hairline" data-cursor="Sonraki">
        <ViewTransition name={`venue-${next.slug}`}>
          <div className="absolute inset-0">
            <Image src={next.image} alt="" fill sizes="100vw" className="object-cover opacity-40 transition-all duration-[1.4s] group-hover:scale-105 group-hover:opacity-60" />
          </div>
        </ViewTransition>
        <div className="container-x relative z-10 flex items-end justify-between py-28">
          <div>
            <p className="eyebrow mb-4">Sonraki mekân</p>
            <p className="font-display type-lg text-ivory">{next.name}</p>
          </div>
          <span className="grid size-16 place-items-center rounded-full border border-ivory/30 text-ivory transition-all duration-500 group-hover:bg-ivory group-hover:text-ink">
            <ArrowUpRight className="size-6" />
          </span>
        </div>
      </Link>
    </article>
  );
}
