import Link from "next/link";
import { getContent, type SiteContent } from "@/lib/content";
import { sections } from "@/components/panel/fields";
import { SectionForm } from "@/components/panel/SectionForm";
import { cn } from "@/lib/utils";

// GitHub yazımları ve yeniden denemeler için sunucu fonksiyonu süresi
export const maxDuration = 60;

export default async function ContentPage({ searchParams }: PageProps<"/panel/icerik">) {
  const sp = await searchParams;
  const content = await getContent();
  const current = sections.find((s) => s.key === sp.bolum) ?? sections[0];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <p className="eyebrow mb-2">Site içeriği</p>
        <h1 className="font-display text-4xl">Metinler ve görseller</h1>
        <p className="mt-2 max-w-2xl text-sm text-tone-mute">
          Görseller için herhangi bir https bağlantısı kullanabilirsiniz (GitHub&apos;a yüklediğiniz dosyanın &quot;raw&quot; bağlantısı, Vercel Blob
          vb.; Google Drive paylaşım linki çalışmaz). Kaydettiğiniz anda sitede görünür.
          {content.updatedAt && <> Son güncelleme: {new Date(content.updatedAt).toLocaleString("tr-TR")}.</>}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {sections.map((s) => (
          <Link
            key={s.key}
            href={`/panel/icerik?bolum=${s.key}`}
            className={cn("rounded-full border px-4 py-1.5 text-sm transition", current.key === s.key ? "border-ink bg-ink text-ivory" : "border-ink/15 bg-white text-ink/70 hover:border-ink/40")}
          >
            {s.title}
          </Link>
        ))}
      </div>

      <SectionForm key={current.key} def={current} initial={content[current.key as keyof SiteContent]} />
    </div>
  );
}
