"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export const SOURCE_KEY = "konak:source";

/** Pixel olayı: pixel yoksa sessizce atlanır. */
export function track(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") window.fbq("track", event, params);
}

/**
 * Meta Pixel + kaynak takibi.
 * - PageView otomatik; telefon ve WhatsApp tıklamalarında "Contact" olayı.
 * - utm_* / fbclid / yönlendiren bilgisi oturumda saklanır; talep formu bunu "source" olarak gönderir.
 */
export function MetaPixel({ pixelId }: { pixelId?: string }) {
  useEffect(() => {
    try {
      if (!sessionStorage.getItem(SOURCE_KEY)) {
        const u = new URL(window.location.href);
        const parts: string[] = [];
        for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
          const v = u.searchParams.get(k);
          if (v) parts.push(`${k.replace("utm_", "")}=${v}`);
        }
        if (u.searchParams.get("fbclid")) parts.push("meta-reklam");
        if (!parts.length && document.referrer) {
          try {
            const host = new URL(document.referrer).hostname.replace(/^www\./, "");
            if (!host.includes(location.hostname)) parts.push(`ref=${host}`);
          } catch {
            /* yok say */
          }
        }
        if (parts.length) sessionStorage.setItem(SOURCE_KEY, parts.join(" "));
      }
    } catch {
      /* private mode */
    }

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) track("Contact", { content_name: "telefon" });
      else if (href.includes("wa.me") || href.includes("whatsapp")) track("Contact", { content_name: "whatsapp" });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!pixelId) return null;
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId.replace(/[^0-9]/g, "")}');fbq('track','PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img height="1" width="1" style={{ display: "none" }} alt="" src={`https://www.facebook.com/tr?id=${pixelId.replace(/[^0-9]/g, "")}&ev=PageView&noscript=1`} />
      </noscript>
    </>
  );
}
