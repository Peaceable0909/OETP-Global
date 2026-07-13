"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Save, UploadCloud } from "lucide-react";
import type { AdminTestimonial } from "@/lib/admin/types";
import ImagePicker from "./ImagePicker";

type FormState = Omit<AdminTestimonial, "id" | "status" | "createdAt" | "updatedAt">;

function emptyForm(): FormState {
  return { slug: "", name: "", destination: "", text: "", photo: "", featured: true, sortOrder: 0 };
}

const textCls =
  "mt-1 w-full rounded-lg border border-brand-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

export default function EditStoryForm() {
  const router = useRouter();
  const params = useSearchParams();
  const slug = params.get("slug");
  const isNew = !slug;

  const [form, setForm] = useState<FormState>(emptyForm());
  const [loading, setLoading] = useState(!isNew);
  const [status, setStatus] = useState<"draft" | "published" | null>(null);
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const res = await fetch(`/api/admin/testimonials/${slug}`);
      if (!res.ok) {
        setMessage({ kind: "error", text: "Couldn't load this story." });
        setLoading(false);
        return;
      }
      const data = (await res.json()) as { testimonial: AdminTestimonial };
      setForm(data.testimonial);
      setStatus(data.testimonial.status);
      setLoading(false);
    })();
  }, [isNew, slug]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save(publish: boolean) {
    setSaving(publish ? "publish" : "draft");
    setMessage(null);
    try {
      const method = isNew ? "POST" : "PUT";
      const url = isNew ? "/api/admin/testimonials" : `/api/admin/testimonials/${slug}`;
      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Save failed");

      const savedSlug = isNew ? form.slug : slug!;

      if (publish) {
        const pubRes = await fetch(`/api/admin/testimonials/${savedSlug}/publish`, { method: "POST" });
        const pubData = await pubRes.json().catch(() => null);
        if (!pubRes.ok) throw new Error(pubData?.error ?? "Publish failed");
        setMessage({
          kind: "ok",
          text: pubData.deployTriggered
            ? "Published — the live site is rebuilding now (usually 1–2 minutes)."
            : `Saved and marked published, but the site rebuild didn't trigger: ${pubData.deployError ?? "no deploy hook configured"}.`,
        });
        setStatus("published");
      } else {
        setMessage({ kind: "ok", text: "Draft saved." });
        setStatus("draft");
      }

      if (isNew) router.replace(`/admin/stories/edit/?slug=${savedSlug}`);
    } catch (err) {
      setMessage({ kind: "error", text: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(null);
    }
  }

  if (loading) return <p className="text-sm text-ink-soft">Loading…</p>;

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold">{isNew ? "Add Story" : `Edit ${form.name || slug}`}</h2>
        {status && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
            }`}
          >
            {status === "published" ? "Live" : "Draft — not live"}
          </span>
        )}
      </div>

      {message && (
        <p
          className={`rounded-xl px-4 py-3 text-sm font-semibold ${
            message.kind === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </p>
      )}

      <section className="rounded-2xl border border-brand-100 bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">Student Story</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {isNew && (
            <label className="block text-xs font-bold text-ink-soft">
              Slug (unique ID, e.g. chinedu)
              <input
                required
                value={form.slug}
                onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                className={textCls}
              />
            </label>
          )}
          <label className="block text-xs font-bold text-ink-soft">
            Student name
            <input required value={form.name} onChange={(e) => set("name", e.target.value)} className={textCls} />
          </label>
          <label className="block text-xs font-bold text-ink-soft">
            Destination (e.g. Cyprus)
            <input value={form.destination} onChange={(e) => set("destination", e.target.value)} className={textCls} />
          </label>
        </div>
        <label className="mt-4 block text-xs font-bold text-ink-soft">
          Story text
          <textarea required value={form.text} onChange={(e) => set("text", e.target.value)} rows={4} className={textCls} />
        </label>
        <label className="mt-4 flex items-center gap-2 text-sm font-bold">
          <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
          Featured on homepage
        </label>
      </section>

      <section className="rounded-2xl border border-brand-100 bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">Photo</h3>
        <ImagePicker
          label="Student photo"
          value={form.photo}
          onChange={(url) => set("photo", url)}
          kind="testimonial"
          countrySlug={form.slug || "new"}
        />
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-100 bg-white/95 px-5 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-3 lg:px-8">
          <button
            onClick={() => save(false)}
            disabled={!!saving}
            className="rounded-full border-2 border-brand-200 px-6 py-3 text-sm font-bold text-brand-800 hover:bg-brand-50 disabled:opacity-60"
          >
            {saving === "draft" ? "Saving…" : "Save Draft"}
          </button>
          <button
            onClick={() => save(true)}
            disabled={!!saving}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-800 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/25 disabled:opacity-60"
          >
            {saving === "publish" ? <UploadCloud className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4" />}
            {saving === "publish" ? "Publishing…" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
