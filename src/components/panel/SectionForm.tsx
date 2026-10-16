"use client";

import { useActionState, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, Loader2, Plus, RotateCcw, Save, Trash2, Check } from "lucide-react";
import { saveSection, resetSectionAction, type ActionResult } from "@/lib/panel-actions";
import type { Field, SectionDef } from "./fields";
import { cn } from "@/lib/utils";

type Obj = Record<string, unknown>;

function ImagePreview({ src }: { src: string }) {
  const ok = typeof src === "string" && /^https?:\/\//.test(src);
  if (!ok) return <div className="grid h-20 w-28 shrink-0 place-items-center rounded-md border border-dashed border-ink/20 text-[10px] text-tone-mute">önizleme</div>;
  return (
    <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md border border-ink/10 bg-ink/5">
      <Image src={src} alt="" fill sizes="112px" className="object-cover" unoptimized />
    </div>
  );
}

function FieldInput({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  const base = "w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-gold-2";
  if (field.type === "textarea") return <textarea value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} rows={3} className={base} />;
  if (field.type === "number")
    return <input type="number" step="any" value={value === undefined || value === null ? "" : String(value)} onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))} className={base} />;
  if (field.type === "color")
    return (
      <div className="flex items-center gap-2">
        <input type="color" value={String(value ?? "#c9a66b")} onChange={(e) => onChange(e.target.value)} className="h-9 w-12 cursor-pointer rounded border border-ink/15" />
        <input value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={base} />
      </div>
    );
  if (field.type === "strings")
    return <textarea value={Array.isArray(value) ? (value as string[]).join("\n") : ""} onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))} rows={5} className={cn(base, "font-mono text-xs")} />;
  if (field.type === "lines3") {
    const arr = Array.isArray(value) ? (value as string[]) : ["", "", ""];
    return (
      <div className="grid gap-2 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <input key={i} value={arr[i] ?? ""} onChange={(e) => onChange([0, 1, 2].map((j) => (j === i ? e.target.value : arr[j] ?? "")))} className={base} placeholder={`${i + 1}. satır`} />
        ))}
      </div>
    );
  }
  if (field.type === "image")
    return (
      <div className="flex gap-3">
        <ImagePreview src={String(value ?? "")} />
        <input type="url" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} placeholder="https://..." className={base} />
      </div>
    );
  return <input type={field.type === "url" ? "url" : "text"} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={base} />;
}

function ObjectFields({ fields, value, onChange }: { fields: Field[]; value: Obj; onChange: (v: Obj) => void }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => (
        <label key={f.key} className={cn("block", f.width === "half" ? "" : "sm:col-span-2")}>
          <span className="mb-1.5 flex items-baseline justify-between font-sans text-[10px] uppercase tracking-[0.2em] text-tone-mute">
            {f.label}
            {f.hint && <span className="normal-case tracking-normal opacity-70">{f.hint}</span>}
          </span>
          <FieldInput field={f} value={value[f.key]} onChange={(v) => onChange({ ...value, [f.key]: v })} />
        </label>
      ))}
    </div>
  );
}

export function SectionForm({ def, initial }: { def: SectionDef; initial: unknown }) {
  // Bileşen bölüm anahtarıyla (key) yeniden kurulduğu için başlangıç değeri bir kez okunur.
  const [data, setData] = useState<unknown>(initial);
  const [initialJson] = useState(() => JSON.stringify(initial));
  const [state, action, pending] = useActionState(saveSection, { ok: true } as ActionResult);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [submittedJson, setSubmittedJson] = useState(initialJson);

  const update = (v: unknown) => setData(v);
  const json = useMemo(() => JSON.stringify(data), [data]);
  const saved = state.ok && Boolean(state.message);
  const dirty = json !== (saved ? submittedJson : initialJson);

  const items = Array.isArray(data) ? (data as Obj[]) : [];
  const emptyItem = () => Object.fromEntries(def.fields.map((f) => [f.key, f.type === "strings" || f.type === "lines3" ? [] : f.type === "number" ? undefined : ""]));

  return (
    <form
      action={(fd) => {
        setSubmittedJson(json);
        action(fd);
      }}
      className="rounded-xl border border-ink/10 bg-white"
    >
      <input type="hidden" name="section" value={def.key} />
      <input type="hidden" name="data" value={json} />
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink/10 px-5 py-4">
        <div>
          <h2 className="font-display text-2xl">{def.title}</h2>
          <p className="mt-1 max-w-2xl text-sm text-tone-mute">{def.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => confirm("Bu bölüm varsayılan içeriğe döndürülsün mü?") && resetSectionAction(def.key)}
            className="flex items-center gap-2 rounded-md border border-ink/15 px-3 py-2 text-xs text-tone-mute hover:text-ink"
            title="Varsayılana dön"
          >
            <RotateCcw className="size-3.5" /> Varsayılan
          </button>
          <button
            type="submit"
            disabled={pending || !dirty}
            className={cn("flex items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-ivory transition", dirty ? "bg-ink hover:bg-gold-2" : "bg-ink/30")}
          >
            {pending ? <Loader2 className="size-3.5 animate-spin" /> : saved && !dirty ? <Check className="size-3.5" /> : <Save className="size-3.5" />}
            {pending ? "Kaydediliyor" : saved && !dirty ? "Kaydedildi" : "Kaydet"}
          </button>
        </div>
      </div>
      {!state.ok && state.message && <p className="px-5 pt-4 text-sm text-rose">{state.message}</p>}

      <div className="p-5">
        {def.kind === "object" ? (
          <ObjectFields fields={def.fields} value={(data as Obj) ?? {}} onChange={update} />
        ) : (
          <div className="space-y-3">
            {items.map((item, i) => {
              const title = String(item[def.itemTitle ?? "title"] ?? "") || `${i + 1}. öğe`;
              const open = openIdx === i;
              const img = def.fields.find((f) => f.type === "image");
              return (
                <div key={i} className="rounded-lg border border-ink/10">
                  <div className="flex items-center gap-3 px-3 py-2">
                    {img && <ImagePreview src={String(item[img.key] ?? "")} />}
                    <button type="button" onClick={() => setOpenIdx(open ? null : i)} className="flex-1 text-left">
                      <div className="font-display text-xl">{title}</div>
                      <div className="text-xs text-tone-mute">{open ? "Kapat" : "Düzenle"}</div>
                    </button>
                    <div className="flex items-center gap-1">
                      <button type="button" disabled={i === 0} onClick={() => update(items.map((x, j) => (j === i - 1 ? items[i] : j === i ? items[i - 1] : x)))} className="grid size-8 place-items-center rounded border border-ink/10 disabled:opacity-30" aria-label="Yukarı">
                        <ArrowUp className="size-3.5" />
                      </button>
                      <button type="button" disabled={i === items.length - 1} onClick={() => update(items.map((x, j) => (j === i + 1 ? items[i] : j === i ? items[i + 1] : x)))} className="grid size-8 place-items-center rounded border border-ink/10 disabled:opacity-30" aria-label="Aşağı">
                        <ArrowDown className="size-3.5" />
                      </button>
                      <button type="button" onClick={() => confirm(`"${title}" silinsin mi?`) && update(items.filter((_, j) => j !== i))} className="grid size-8 place-items-center rounded border border-rose/40 text-rose" aria-label="Sil">
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  {open && (
                    <div className="border-t border-ink/10 p-4">
                      <ObjectFields fields={def.fields} value={item} onChange={(v) => update(items.map((x, j) => (j === i ? v : x)))} />
                    </div>
                  )}
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => {
                update([...items, emptyItem()]);
                setOpenIdx(items.length);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-ink/20 py-3 text-sm text-tone-mute hover:border-ink/50 hover:text-ink"
            >
              <Plus className="size-4" /> Yeni ekle
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
