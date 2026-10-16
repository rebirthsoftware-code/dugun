import Link from "next/link";
import type { SiteInfo } from "@/lib/content";
import type { EventType } from "@/lib/data";
import { IstanbulClock } from "./Clock";
import { Logo } from "./Logo";
import { Year } from "./Year";

export function Footer({ site, eventTypes }: { site: SiteInfo; eventTypes: EventType[] }) {
  return (
    <footer className="surface-ink relative overflow-hidden">
      <div className="container-x grid gap-14 py-20 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-6">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-mute">{site.tagline}</p>
          <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-mute">
            {site.city} · <IstanbulClock />
          </p>
        </div>

        <FooterCol title="Etkinlikler">
          {eventTypes.map((v) => (
            <li key={v.slug}>
              <Link href={`/etkinlikler/${v.slug}`} className="hover:text-gold">
                {v.name}
              </Link>
            </li>
          ))}
        </FooterCol>

        <FooterCol title="Keşfet">
          <li>
            <Link href="/galeri" className="hover:text-gold">
              Galeri
            </Link>
          </li>
          <li>
            <Link href="/#deneyim" className="hover:text-gold">
              Deneyim
            </Link>
          </li>
          <li>
            <Link href="/#sss" className="hover:text-gold">
              Sık Sorulanlar
            </Link>
          </li>
          <li>
            <Link href="/rezervasyon" className="hover:text-gold">
              Rezervasyon
            </Link>
          </li>
        </FooterCol>

        <FooterCol title="İletişim">
          <li>
            <a href={site.phoneHref} className="hover:text-gold">
              {site.phone}
            </a>
          </li>
          <li>
            <a href={site.whatsapp} target="_blank" rel="noreferrer" className="hover:text-gold">
              WhatsApp ↗
            </a>
          </li>
          {site.email && (
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-gold">
                {site.email}
              </a>
            </li>
          )}
          {site.instagram && (
            <li>
              <a href={site.instagram} target="_blank" rel="noreferrer" className="hover:text-gold">
                Instagram ↗
              </a>
            </li>
          )}
          <li>
            <a href={site.mapsHref} target="_blank" rel="noreferrer" className="hover:text-gold">
              {site.addressFull}
            </a>
          </li>
        </FooterCol>
      </div>

      <div className="container-x flex flex-col gap-4 border-t hairline py-6 font-sans text-[11px] uppercase tracking-[0.22em] text-mute sm:flex-row sm:items-center sm:justify-between">
        <span>© <Year /> {site.fullName}</span>
        <span>{site.district}, {site.city}</span>
      </div>

      <div
        aria-hidden
        className="pointer-events-none select-none px-[2vw] pb-[1vw] font-display text-[clamp(4rem,19.5vw,22rem)] leading-[0.78] tracking-[0.02em] text-outline"
      >
        {site.name.toLocaleUpperCase("tr")}
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-5">{title}</p>
      <ul className="space-y-3 text-sm text-ivory/75">{children}</ul>
    </div>
  );
}
