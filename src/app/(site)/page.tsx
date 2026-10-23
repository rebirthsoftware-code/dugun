import { Hero } from "@/components/hero/Hero";
import { Intro } from "@/components/sections/Intro";
import { EventTypes } from "@/components/sections/EventTypes";
import { Flow } from "@/components/sections/Flow";
import { Services } from "@/components/sections/Services";
import { GalleryPreview } from "@/components/sections/Gallery";
import { Testimonials } from "@/components/sections/Testimonials";
import { Availability } from "@/components/sections/Availability";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";
import { getContent } from "@/lib/content";
import { SITE } from "@/lib/utils";

// GitHub yazımları ve yeniden denemeler için sunucu fonksiyonu süresi
export const maxDuration = 60;

export default async function HomePage() {
  const c = await getContent();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EventVenue",
        name: c.site.fullName,
        description: c.site.description,
        telephone: c.site.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: c.site.address,
          addressLocality: c.site.district,
          addressRegion: c.site.city,
          addressCountry: "TR",
        },
        geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
        maximumAttendeeCapacity: Math.max(0, ...c.eventTypes.map((v) => v.capacity)),
      },
      {
        "@type": "FAQPage",
        mainEntity: c.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero hero={c.hero} site={c.site} capacity={Math.max(0, ...c.eventTypes.map((v) => v.capacity))} />
      <Intro intro={c.intro} stats={c.stats} />
      <EventTypes eventTypes={c.eventTypes} />
      <Flow timeline={c.timeline} />
      <Services services={c.services} />
      <GalleryPreview gallery={c.gallery} />
      <Testimonials testimonials={c.testimonials} />
      <Availability eventTypes={c.eventTypes} />
      <FAQ faqs={c.faqs} />
      <CTA cta={c.cta} site={c.site} />
    </>
  );
}
