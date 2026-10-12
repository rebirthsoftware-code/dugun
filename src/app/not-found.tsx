import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[80svh] flex-col items-start justify-center gap-8 pt-[var(--header-h)]">
      <span className="eyebrow">404</span>
      <h1 className="font-display type-lg text-ink">
        Bu sayfa <span className="italic text-gold-2">davetli</span> değil.
      </h1>
      <p className="max-w-md text-tone-mute">Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir. Sizi ana salona alalım.</p>
      <ButtonLink href="/">Ana sayfa</ButtonLink>
    </section>
  );
}
