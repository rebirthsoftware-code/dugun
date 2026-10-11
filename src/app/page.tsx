import { Hero } from "@/components/hero/Hero";
import { Intro } from "@/components/sections/Intro";
import { Venues } from "@/components/sections/Venues";
import { Flow } from "@/components/sections/Flow";
import { Gastronomy } from "@/components/sections/Gastronomy";
import { Services } from "@/components/sections/Services";
import { GalleryPreview } from "@/components/sections/Gallery";
import { Testimonials } from "@/components/sections/Testimonials";
import { Availability } from "@/components/sections/Availability";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";
import { faqs, venues } from "@/lib/data";
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
        email: SITE.email,
        address: { "@type": "PostalAddress", streetAddress: SITE.address, addressLocality: "İstanbul", addressCountry: "TR" },
        geo: { "@type": "GeoCoordinates", latitude: 41.055, longitude: 29.035 },
        maximumAttendeeCapacity: Math.max(...venues.map((v) => v.capacity.cocktail)),
        aggregateRating: { "@type": "AggregateRating", ratingValue: 4.9, reviewCount: 412 },
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
      <Venues />
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
