"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className="container-x flex min-h-[80svh] flex-col items-start justify-center gap-6 pt-[var(--header-h)]">
      <span className="eyebrow">Geçici bir sorun</span>
      <h1 className="font-display type-md text-ink">Sayfa şu an yüklenemedi.</h1>
      <p className="max-w-md text-tone-mute">Birkaç saniye sonra tekrar deneyin. Sorun sürerse bizi telefonla ya da WhatsApp ile arayabilirsiniz.</p>
      <div className="flex gap-3">
        <button type="button" onClick={reset} className="rounded-full bg-ink px-6 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory">
          Tekrar dene
        </button>
        <Link href="/" className="rounded-full border border-ink/30 px-6 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.2em]">
          Ana sayfa
        </Link>
      </div>
      {error.digest && <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-tone-mute">Kod · {error.digest}</p>}
    </section>
  );
}
