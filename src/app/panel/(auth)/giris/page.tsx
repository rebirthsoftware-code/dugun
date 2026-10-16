import type { Metadata } from "next";
import { LoginForm } from "@/components/panel/LoginForm";
import { adminConfigured } from "@/lib/auth";

export const metadata: Metadata = { title: "Panel Girişi", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: PageProps<"/panel/giris">) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : "/panel";
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 grid size-14 place-items-center rounded-full border border-gold-2/60">
            <span className="size-5 rotate-45 border border-ink/70" />
          </div>
          <h1 className="font-display text-4xl text-ink">Konak Panel</h1>
          <p className="mt-2 text-sm text-tone-mute">Yönetim paneline giriş yapın.</p>
        </div>
        {adminConfigured() ? (
          <LoginForm next={next} />
        ) : (
          <div className="rounded-lg border border-rose/40 bg-rose/10 p-5 text-sm leading-relaxed text-ink">
            <b>Panel şifresi tanımlı değil.</b> Vercel projesinin ayarlarında <code className="rounded bg-ink/10 px-1">ADMIN_PASSWORD</code> adlı bir ortam
            değişkeni ekleyip yeniden dağıtın.
          </div>
        )}
      </div>
    </div>
  );
}
