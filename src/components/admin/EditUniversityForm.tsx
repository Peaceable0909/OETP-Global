"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Save, UploadCloud, Plus, Pencil } from "lucide-react";
import type { AdminUniversity, AdminCountry, AdminProgram } from "@/lib/admin/types";
import ImagePicker from "./ImagePicker";
import ImageListEditor from "./ImageListEditor";
import StringListEditor from "./StringListEditor";
import RepeatableEditor from "./RepeatableEditor";

// Numeric fields are edited as plain strings (like every other field here)
// and only converted to number | null right before the API call — simplest
// way to let the input be empty without fighting controlled-input semantics.
type FormState = Omit<
  AdminUniversity,
  "id" | "status" | "createdAt" | "updatedAt" | "rankings" | "foundedYear" | "studentPopulation" | "internationalStudentPct"
> & {
  // Kept as string values (like every other numeric field in this form) so
  // RepeatableEditor — built for Record<string, string>[] — can edit it
  // directly; converted to {label, value:number}[] only at save() time.
  rankings: Record<string, string>[];
  foundedYear: string;
  studentPopulation: string;
  internationalStudentPct: string;
};

function emptyForm(): FormState {
  return {
    slug: "",
    countrySlug: "",
    name: "",
    city: "",
    tagline: "",
    description: "",
    heroPhoto: "",
    rankings: [],
    foundedYear: "",
    studentPopulation: "",
    internationalStudentPct: "",
    campusType: "",
    gallery: [],
    keyPoints: [],
    videos: [],
    accreditations: [],
    accommodationSummary: "",
    accommodationCostRange: "",
    studentLife: [],
    faqs: [],
    featured: false,
  };
}

function numOrNull(v: string): number | null {
  const trimmed = v.trim();
  return trimmed === "" ? null : Number(trimmed);
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

export default function EditUniversityForm() {
  const router = useRouter();
  const params = useSearchParams();
  const slug = params.get("slug");
  const isNew = !slug;

  const [form, setForm] = useState<FormState>(emptyForm());
  const [countries, setCountries] = useState<AdminCountry[]>([]);
  const [programs, setPrograms] = useState<AdminProgram[] | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [status, setStatus] = useState<"draft" | "published" | null>(null);
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/destinations")
      .then((r) => r.json())
      .then((data: { countries: AdminCountry[] }) => setCountries(data.countries))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const res = await fetch(`/api/admin/universities/${slug}`);
      if (!res.ok) {
        setMessage({ kind: "error", text: "Couldn't load this university." });
        setLoading(false);
        return;
      }
      const data = (await res.json()) as { university: AdminUniversity };
      const u = data.university;
      setForm({
        ...u,
        rankings: u.rankings.map((r) => ({ label: r.label, value: String(r.value) })),
        foundedYear: u.foundedYear?.toString() ?? "",
        studentPopulation: u.studentPopulation?.toString() ?? "",
        internationalStudentPct: u.internationalStudentPct?.toString() ?? "",
      });
      setStatus(u.status);
      setLoading(false);
    })();
  }, [isNew, slug]);

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/admin/programs?university=${slug}`)
      .then((r) => r.json())
      .then((data: { programs: AdminProgram[] }) => setPrograms(data.programs))
      .catch(() => setPrograms([]));
  }, [isNew, slug]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save(publish: boolean) {
    setSaving(publish ? "publish" : "draft");
    setMessage(null);
    try {
      const payload = {
        ...form,
        rankings: form.rankings
          .filter((r) => (r.label || "").trim() && (r.value || "").trim())
          .map((r) => ({ label: r.label.trim(), value: Number(r.value) })),
        foundedYear: numOrNull(form.foundedYear),
        studentPopulation: numOrNull(form.studentPopulation),
        internationalStudentPct: numOrNull(form.internationalStudentPct),
      };

      const method = isNew ? "POST" : "PUT";
      const url = isNew ? "/api/admin/universities" : `/api/admin/universities/${slug}`;
      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Save failed");

      const savedSlug = isNew ? form.slug : slug!;

      if (publish) {
        const pubRes = await fetch(`/api/admin/universities/${savedSlug}/publish`, { method: "POST" });
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

      if (isNew) router.replace(`/admin/universities/edit/?slug=${savedSlug}`);
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
        <h2 className="font-display text-xl font-bold">{isNew ? "Add University" : `Edit ${form.name || slug}`}</h2>
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
              label="Slug (used in the URL, e.g. girne-american-university)"
              required
              value={form.slug}
              onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
            />
          )}
          <label className="block text-xs font-bold text-ink-soft">
            Country
            <select
              required
              value={form.countrySlug}
              onChange={(e) => set("countrySlug", e.target.value)}
              className={textCls}
            >
              <option value="" disabled>
                Select a country…
              </option>
              {countries.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <Field label="University name" required value={form.name} onChange={(e) => set("name", e.target.value)} />
          <Field label="City" value={form.city} onChange={(e) => set("city", e.target.value)} />
          <Field label="Tagline" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
          <Field label="Campus type (e.g. urban, suburban, campus)" value={form.campusType} onChange={(e) => set("campusType", e.target.value)} />
          <Field label="Founded year" type="number" value={form.foundedYear} onChange={(e) => set("foundedYear", e.target.value)} />
          <Field label="Student population" type="number" value={form.studentPopulation} onChange={(e) => set("studentPopulation", e.target.value)} />
          <Field
            label="International student %"
            type="number"
            step="0.1"
            value={form.internationalStudentPct}
            onChange={(e) => set("internationalStudentPct", e.target.value)}
          />
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm font-bold">
          <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
          Featured on the country page
        </label>
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-brand-600">Rankings</h3>
        <p className="mb-4 text-xs text-ink-soft">
          Type whatever label actually applies — &quot;Thailand&quot;, &quot;Asia&quot;, &quot;World&quot;,
          &quot;ASEAN&quot;, anything — instead of being limited to National/World. Add as many as are meaningful for
          this university; none are required.
        </p>
        <RepeatableEditor
          label="Rankings"
          items={form.rankings}
          onChange={(v) => set("rankings", v)}
          countrySlug={form.slug || "new"}
          fields={[
            { key: "label", label: "Label (e.g. Asia, Thailand, World)" },
            { key: "value", label: "Rank (e.g. 250)" },
          ]}
        />
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">About University</h3>
        <p className="mb-4 text-xs text-ink-soft">
          Shown at the top of the university page, right before the Overview section.
        </p>
        <label className="block text-xs font-bold text-ink-soft">
          About paragraph
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={4}
            placeholder="A few sentences introducing this university."
            className={textCls}
          />
        </label>
        <div className="mt-4">
          <StringListEditor
            label="Key Points"
            values={form.keyPoints}
            onChange={(v) => set("keyPoints", v)}
            placeholder="e.g. Small class sizes with a 15:1 student-faculty ratio"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">Hero Photo</h3>
        <ImagePicker
          label="Hero photo"
          value={form.heroPhoto}
          onChange={(url) => set("heroPhoto", url)}
          kind="university-hero"
          countrySlug={form.slug || "new"}
        />
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">Gallery</h3>
        <ImageListEditor
          label="Campus photos"
          values={form.gallery}
          onChange={(v) => set("gallery", v)}
          kind="university-gallery"
          countrySlug={form.slug || "new"}
        />
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">Videos</h3>
        <p className="mb-4 text-xs text-ink-soft">
          Campus tours, student interviews — paste a YouTube, Vimeo, or direct .mp4 link and give it a title.
        </p>
        <RepeatableEditor
          label="Videos"
          items={form.videos}
          onChange={(v) => set("videos", v as FormState["videos"])}
          countrySlug={form.slug || "new"}
          fields={[
            { key: "title", label: "Title (e.g. Campus Tour, Meet a Student: Aisha)" },
            { key: "url", label: "Video URL" },
          ]}
        />
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">Accreditations</h3>
        <StringListEditor label="Accreditations" values={form.accreditations} onChange={(v) => set("accreditations", v)} placeholder="e.g. WASC accredited" />
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">Campus &amp; Student Life</h3>
        <StringListEditor label="Student life highlights" values={form.studentLife} onChange={(v) => set("studentLife", v)} placeholder="e.g. 40+ student clubs" />
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">Accommodation</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-xs font-bold text-ink-soft sm:col-span-2">
            Summary
            <textarea value={form.accommodationSummary} onChange={(e) => set("accommodationSummary", e.target.value)} rows={2} className={textCls} />
          </label>
          <Field label="Cost range (e.g. $200–400/month)" value={form.accommodationCostRange} onChange={(e) => set("accommodationCostRange", e.target.value)} />
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

      {!isNew && (
        <section className="rounded-2xl border border-line bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-600">Programs at This University</h3>
            <Link
              href={`/admin/programs/edit/?universitySlug=${slug}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-200"
            >
              <Plus className="h-3.5 w-3.5" /> Add Program
            </Link>
          </div>
          {programs === null ? (
            <p className="text-xs text-ink-soft">Loading…</p>
          ) : programs.length === 0 ? (
            <p className="text-xs text-ink-soft">No programs yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {programs.map((p) => (
                <li key={p.slug} className="flex items-center justify-between py-2.5">
                  <div>
                    <span className="text-sm font-bold">{p.name}</span>
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        p.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <Link
                    href={`/admin/programs/edit/?slug=${p.slug}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1 text-xs font-bold text-brand-700 hover:bg-brand-50"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

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
