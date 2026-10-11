import { Hero } from "@/components/hero/Hero";
import { Marquee } from "@/components/ui/Marquee";
import { Manifesto } from "@/components/sections/Manifesto";
import { Venues } from "@/components/sections/Venues";
import { Experience } from "@/components/sections/Experience";
import { Numbers } from "@/components/sections/Numbers";
import { GalleryPreview } from "@/components/sections/Gallery";
import { Testimonials } from "@/components/sections/Testimonials";
import { Availability } from "@/components/sections/Availability";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";
import { faqs, marqueeItems, venues } from "@/lib/data";
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
      <Marquee items={marqueeItems} className="border-y hairline py-5" />
      <Manifesto />
      <Venues />
      <Experience />
      <Numbers />
      <GalleryPreview />
      <Testimonials />
      <Availability />
      <FAQ />
      <CTA />
    </>
  );
}
