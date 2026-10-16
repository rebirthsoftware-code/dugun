import { ViewTransition } from "react";
import { Providers } from "@/components/layout/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getContent } from "@/lib/content";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const content = await getContent();
  return (
    <Providers>
      <Header site={content.site} eventTypes={content.eventTypes} menuImages={[content.hero.image, content.eventTypes[0]?.image ?? content.hero.image, content.services[0]?.image ?? content.hero.image, content.intro.image, content.cta.image]} />
      <ViewTransition default="slide">
        <main className="flex-1">{children}</main>
      </ViewTransition>
      <Footer site={content.site} eventTypes={content.eventTypes} />
    </Providers>
  );
}
