"use client";

import { useActionState } from "react";
import { Loader2, LockKeyhole } from "lucide-react";
import { login, type ActionResult } from "@/lib/panel-actions";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, { ok: true } as ActionResult);
  return (
    <form action={action} className="space-y-5 rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
      <input type="hidden" name="next" value={next} />
      <label className="block">
        <span className="mb-2 block font-sans text-[11px] uppercase tracking-[0.2em] text-tone-mute">Şifre</span>
        <div className="flex items-center gap-3 rounded-lg border border-ink/15 px-3 focus-within:border-gold-2">
          <LockKeyhole className="size-4 text-tone-mute" />
          <input name="password" type="password" required autoFocus autoComplete="current-password" className="w-full bg-transparent py-3 text-base outline-none" />
        </div>
      </label>
      {!state.ok && state.message && (
        <p role="alert" className="text-sm text-rose">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink py-3 font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-ivory transition hover:bg-gold-2 disabled:opacity-60"
      >
        {pending && <Loader2 className="size-4 animate-spin" />}
        Giriş yap
      </button>
    </form>
  );
}
