import Link from "next/link";
import { SITE } from "@/lib/utils";
import { venues } from "@/lib/data";
import { IstanbulClock } from "./Clock";
import { Logo } from "./Logo";
import { Year } from "./Year";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t hairline bg-ink">
      <div className="container-x grid gap-14 py-20 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-6">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-mute">{SITE.tagline}</p>
          <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-mute">
            İstanbul · <IstanbulClock />
          </p>
        </div>

        <FooterCol title="Salonlar">
          {venues.map((v) => (
            <li key={v.slug}>
              <Link href={`/mekanlar/${v.slug}`} className="hover:text-gold">
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
            <a href={SITE.phoneHref} className="hover:text-gold">
              {SITE.phone}
            </a>
          </li>
          <li>
            <a href={`mailto:${SITE.email}`} className="hover:text-gold">
              {SITE.email}
            </a>
          </li>
          <li>
            <a href={SITE.mapsHref} target="_blank" rel="noreferrer" className="hover:text-gold">
              {SITE.address}
            </a>
          </li>
          <li>
            <a href={SITE.instagram} target="_blank" rel="noreferrer" className="hover:text-gold">
              Instagram ↗
            </a>
          </li>
        </FooterCol>
      </div>

      <div className="container-x flex flex-col gap-4 border-t hairline py-6 font-sans text-[11px] uppercase tracking-[0.22em] text-mute sm:flex-row sm:items-center sm:justify-between">
        <span>© <Year /> {SITE.fullName}</span>
        <span>Kuruçeşme, Beşiktaş</span>
      </div>

      <div
        aria-hidden
        className="pointer-events-none select-none px-[2vw] pb-[1vw] font-display text-[clamp(4rem,19.5vw,22rem)] leading-[0.78] tracking-[0.02em] text-outline"
      >
        SERENAD
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
