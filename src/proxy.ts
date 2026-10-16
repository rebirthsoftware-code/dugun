import { NextResponse, type NextRequest } from "next/server";

const COOKIE = "konak_panel";

/** Edge'de HMAC doğrulaması (Web Crypto). */
async function verify(token: string | undefined, secret: string) {
  if (!token || !secret) return false;
  const [expStr, sig] = token.split(".");
  if (!expStr || !sig || Number(expStr) < Date.now()) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(expStr));
  const hex = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex === sig;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/panel/giris")) return NextResponse.next();
  const secret = process.env.ADMIN_SECRET ?? process.env.ADMIN_PASSWORD ?? "";
  const ok = await verify(request.cookies.get(COOKIE)?.value, secret);
  if (ok) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = "/panel/giris";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/panel/:path*"],
};
