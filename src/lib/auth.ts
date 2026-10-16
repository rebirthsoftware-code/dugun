import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "konak_panel";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 gün

function secret() {
  return process.env.ADMIN_SECRET ?? process.env.ADMIN_PASSWORD ?? "";
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** İmzalı, süreli oturum belirteci: <expiry>.<hmac> */
export function createSessionToken() {
  const exp = Date.now() + MAX_AGE * 1000;
  const sig = createHmac("sha256", secret()).update(String(exp)).digest("hex");
  return { token: `${exp}.${sig}`, maxAge: MAX_AGE };
}

export function verifySessionToken(token: string | undefined | null) {
  if (!token || !secret()) return false;
  const [expStr, sig] = token.split(".");
  const exp = Number(expStr);
  if (!exp || !sig || exp < Date.now()) return false;
  const expected = createHmac("sha256", secret()).update(expStr).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
