"use client";

import { useEffect } from "react";

export default function PanelError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="mx-auto max-w-xl rounded-xl border border-rose/40 bg-white p-8">
      <p className="eyebrow mb-2">Hata</p>
      <h1 className="font-display text-3xl">Bu sayfa yüklenemedi.</h1>
      <p className="mt-3 text-sm text-tone-mute">
        Büyük olasılıkla veritabanına (GitHub) geçici olarak ulaşılamadı. Birkaç saniye sonra tekrar deneyin.
      </p>
      {error.message && <pre className="mt-4 overflow-auto rounded-md bg-paper p-3 text-xs text-ink/70">{error.message.slice(0, 300)}</pre>}
      <button type="button" onClick={reset} className="mt-6 rounded-md bg-ink px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-ivory">
        Tekrar dene
      </button>
    </div>
  );
}
