"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Save, UploadCloud } from "lucide-react";
import type { AdminCountry } from "@/lib/admin/types";
import ImagePicker from "./ImagePicker";
import StringListEditor from "./StringListEditor";
import RepeatableEditor from "./RepeatableEditor";

type FormState = Omit<AdminCountry, "id" | "status" | "createdAt" | "updatedAt">;

function emptyForm(): FormState {
  return {
    slug: "",
    name: "",
    code: "",
    tagline: "",
    heroGradient: "from-brand-700 via-brand-600 to-fuchsia-500",
    accent: "#7C3AED",
    photo: "",
    summary: "",
    capital: "",
    language: "",
    currency: "",
    intakeMonths: "",
    visaProcessing: "",
    programLength: "",
    tuitionFrom: "",
    workRights: "",
    featured: false,
    highlights: [],
    programs: [],
    visaSteps: [],
    requirements: [],
    documents: [],
    faqs: [],
    specializations: [],
  };
}

const textCls =
  "mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-xs font-bold text-ink-soft">
      {label}
      <input {...rest} className={textCls} />
    </label>
  );
}

export default function EditCountryForm() {
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
      const res = await fetch(`/api/admin/destinations/${slug}`);
      if (!res.ok) {
        setMessage({ kind: "error", text: "Couldn't load this country." });
        setLoading(false);
        return;
      }
      const data = (await res.json()) as { country: AdminCountry };
      setForm(data.country);
      setStatus(data.country.status);
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
      const url = isNew ? "/api/admin/destinations" : `/api/admin/destinations/${slug}`;
      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Save failed");

      const savedSlug = isNew ? form.slug : slug!;

      if (publish) {
        const pubRes = await fetch(`/api/admin/destinations/${savedSlug}/publish`, { method: "POST" });
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

      if (isNew) router.replace(`/admin/destinations/edit/?slug=${savedSlug}`);
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
        <h2 className="font-display text-xl font-bold">{isNew ? "Add Country" : `Edit ${form.name || slug}`}</h2>
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

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">Basics</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {isNew && (
            <Field
              label="Slug (used in the URL, e.g. ghana)"
              required
              value={form.slug}
              onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
            />
          )}
          <Field label="Country name" required value={form.name} onChange={(e) => set("name", e.target.value)} />
          <Field label="Code (2 letters, e.g. AL)" required maxLength={2} value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} />
          <Field label="Tagline" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
          <Field label="Accent color (hex)" value={form.accent} onChange={(e) => set("accent", e.target.value)} />
          <Field label="Capital" value={form.capital} onChange={(e) => set("capital", e.target.value)} />
          <Field label="Language" value={form.language} onChange={(e) => set("language", e.target.value)} />
          <Field label="Currency" value={form.currency} onChange={(e) => set("currency", e.target.value)} />
          <Field label="Intake months" value={form.intakeMonths} onChange={(e) => set("intakeMonths", e.target.value)} />
          <Field label="Visa processing time" value={form.visaProcessing} onChange={(e) => set("visaProcessing", e.target.value)} />
          <Field label="Program length" value={form.programLength} onChange={(e) => set("programLength", e.target.value)} />
          <Field label="Tuition from" value={form.tuitionFrom} onChange={(e) => set("tuitionFrom", e.target.value)} />
          <Field label="Work rights" value={form.workRights} onChange={(e) => set("workRights", e.target.value)} />
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm font-bold">
          <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
          Featured on homepage
        </label>
        <label className="mt-4 block text-xs font-bold text-ink-soft">
          Summary
          <textarea
            value={form.summary}
            onChange={(e) => set("summary", e.target.value)}
            rows={3}
            className={textCls}
          />
        </label>
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">Hero Photo</h3>
        <ImagePicker
          label="Hero photo"
          value={form.photo}
          onChange={(url) => set("photo", url)}
          kind="country-hero"
          countrySlug={form.slug || "new"}
        />
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">Highlights</h3>
        <StringListEditor label="Highlights" values={form.highlights} onChange={(v) => set("highlights", v)} placeholder="e.g. No age requirement" />
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">Programs & Pricing</h3>
        <RepeatableEditor
          label="Programs"
          items={form.programs}
          onChange={(v) => set("programs", v as FormState["programs"])}
          countrySlug={form.slug || "new"}
          fields={[
            { key: "name", label: "Program name" },
            { key: "length", label: "Length (e.g. 1 year)" },
            { key: "tuition", label: "Price / tuition (e.g. €2,800/year)" },
            { key: "note", label: "Note", type: "textarea" },
            { key: "photo", label: "Program photo (optional)", type: "image", imageKind: "program" },
          ]}
        />
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">Visa Steps</h3>
        <RepeatableEditor
          label="Visa steps"
          items={form.visaSteps}
          onChange={(v) => set("visaSteps", v as FormState["visaSteps"])}
          countrySlug={form.slug || "new"}
          fields={[
            { key: "title", label: "Step title" },
            { key: "detail", label: "Detail", type: "textarea" },
          ]}
        />
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">Requirements & Documents</h3>
        <div className="grid gap-6 sm:grid-cols-2">
          <StringListEditor label="Requirements" values={form.requirements} onChange={(v) => set("requirements", v)} />
          <StringListEditor label="Documents" values={form.documents} onChange={(v) => set("documents", v)} />
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">FAQs</h3>
        <RepeatableEditor
          label="FAQs"
          items={form.faqs}
          onChange={(v) => set("faqs", v as FormState["faqs"])}
          countrySlug={form.slug || "new"}
          fields={[
            { key: "q", label: "Question" },
            { key: "a", label: "Answer", type: "textarea" },
          ]}
        />
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">Specializations (optional)</h3>
        <RepeatableEditor
          label="Specializations"
          items={form.specializations}
          onChange={(v) => set("specializations", v as FormState["specializations"])}
          countrySlug={form.slug || "new"}
          fields={[
            { key: "name", label: "Name" },
            { key: "photo", label: "Photo", type: "image", imageKind: "specialization" },
          ]}
        />
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white px-5 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-3 lg:px-8">
          <button
            onClick={() => save(false)}
            disabled={!!saving}
            className="rounded-full border-2 border-line px-6 py-3 text-sm font-bold text-brand-800 hover:bg-brand-50 disabled:opacity-60"
          >
            {saving === "draft" ? "Saving…" : "Save Draft"}
          </button>
          <button
            onClick={() => save(true)}
            disabled={!!saving}
            className="inline-flex items-center gap-2 rounded-full bg-study px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
          >
            {saving === "publish" ? <UploadCloud className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4" />}
            {saving === "publish" ? "Publishing…" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
