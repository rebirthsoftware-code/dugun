import { Hero } from "@/components/hero/Hero";
import { Intro } from "@/components/sections/Intro";
import { EventTypes } from "@/components/sections/EventTypes";
import { Flow } from "@/components/sections/Flow";
import { Gastronomy } from "@/components/sections/Gastronomy";
import { Services } from "@/components/sections/Services";
import { GalleryPreview } from "@/components/sections/Gallery";
import { Testimonials } from "@/components/sections/Testimonials";
import { Availability } from "@/components/sections/Availability";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";
import { faqs, eventTypes } from "@/lib/data";
import { SITE } from "@/lib/utils";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EventVenue",
        name: SITE.fullName,
        description: SITE.description,
        url: SITE.url,
        telephone: SITE.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE.address,
          addressLocality: SITE.district,
          addressRegion: SITE.city,
          addressCountry: "TR",
        },
        geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
        maximumAttendeeCapacity: Math.max(...eventTypes.map((v) => v.capacity)),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <Intro />
      <EventTypes />
      <Flow />
      <Gastronomy />
      <Services />
      <GalleryPreview />
      <Testimonials />
      <Availability />
      <FAQ />
      <CTA />
    </>
  );
}
