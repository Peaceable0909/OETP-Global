"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Save, UploadCloud } from "lucide-react";
import type { AdminProgram, AdminUniversity } from "@/lib/admin/types";
import ImagePicker from "./ImagePicker";
import StringListEditor from "./StringListEditor";
import RepeatableEditor from "./RepeatableEditor";
import ModulesEditor from "./ModulesEditor";

// Numeric fields are edited as plain strings and only converted to
// number | null right before the API call, same approach as EditUniversityForm.
type FormState = Omit<
  AdminProgram,
  "id" | "status" | "createdAt" | "updatedAt" | "durationMonths" | "tuitionPerYear" | "applicationFee" | "deposit" | "minGpa" | "minIelts" | "minToefl" | "feeBreakdown"
> & {
  durationMonths: string;
  tuitionPerYear: string;
  applicationFee: string;
  deposit: string;
  minGpa: string;
  minIelts: string;
  minToefl: string;
  // Kept as string fields here (like every other numeric field in this form)
  // so RepeatableEditor — built for Record<string, string>[] — can edit it
  // directly; converted to numbers only at save() time.
  feeBreakdown: Record<string, string>[];
};

function emptyForm(universitySlug: string): FormState {
  return {
    slug: "",
    universitySlug,
    name: "",
    overview: "",
    photo: "",
    degreeType: "",
    fieldOfStudy: "",
    campus: "",
    intakeMonths: [],
    durationMonths: "",
    tuitionPerYear: "",
    applicationFee: "",
    deposit: "",
    currency: "USD",
    entryRequirements: [],
    minGpa: "",
    minIelts: "",
    minToefl: "",
    requiredDocuments: [],
    modules: [],
    careerProspects: [],
    scholarships: [],
    faqs: [],
    feeBreakdown: [],
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

export default function EditProgramForm() {
  const router = useRouter();
  const params = useSearchParams();
  const slug = params.get("slug");
  const presetUniversitySlug = params.get("universitySlug") ?? "";
  const isNew = !slug;

  const [form, setForm] = useState<FormState>(emptyForm(presetUniversitySlug));
  const [universities, setUniversities] = useState<AdminUniversity[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [status, setStatus] = useState<"draft" | "published" | null>(null);
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/universities")
      .then((r) => r.json())
      .then((data: { universities: AdminUniversity[] }) => setUniversities(data.universities))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const res = await fetch(`/api/admin/programs/${slug}`);
      if (!res.ok) {
        setMessage({ kind: "error", text: "Couldn't load this program." });
        setLoading(false);
        return;
      }
      const data = (await res.json()) as { program: AdminProgram };
      const p = data.program;
      setForm({
        ...p,
        durationMonths: p.durationMonths?.toString() ?? "",
        tuitionPerYear: p.tuitionPerYear?.toString() ?? "",
        applicationFee: p.applicationFee?.toString() ?? "",
        deposit: p.deposit?.toString() ?? "",
        minGpa: p.minGpa?.toString() ?? "",
        minIelts: p.minIelts?.toString() ?? "",
        minToefl: p.minToefl?.toString() ?? "",
        feeBreakdown: p.feeBreakdown.map((f) => ({
          label: f.label,
          registrationFee: String(f.registrationFee),
          managementFee: String(f.managementFee),
          tuitionFee: String(f.tuitionFee),
          total: String(f.total),
          currency: f.currency,
        })),
      });
      setStatus(p.status);
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
      const payload = {
        ...form,
        durationMonths: numOrNull(form.durationMonths),
        tuitionPerYear: numOrNull(form.tuitionPerYear),
        applicationFee: numOrNull(form.applicationFee),
        deposit: numOrNull(form.deposit),
        minGpa: numOrNull(form.minGpa),
        minIelts: numOrNull(form.minIelts),
        minToefl: numOrNull(form.minToefl),
        feeBreakdown: form.feeBreakdown.map((f) => ({
          label: f.label || "",
          registrationFee: Number(f.registrationFee) || 0,
          managementFee: Number(f.managementFee) || 0,
          tuitionFee: Number(f.tuitionFee) || 0,
          total: Number(f.total) || 0,
          currency: f.currency || "THB",
        })),
      };

      const method = isNew ? "POST" : "PUT";
      const url = isNew ? "/api/admin/programs" : `/api/admin/programs/${slug}`;
      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Save failed");

      const savedSlug = isNew ? form.slug : slug!;

      if (publish) {
        const pubRes = await fetch(`/api/admin/programs/${savedSlug}/publish`, { method: "POST" });
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

      if (isNew) router.replace(`/admin/programs/edit/?slug=${savedSlug}`);
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
        <h2 className="font-display text-xl font-bold">{isNew ? "Add Program" : `Edit ${form.name || slug}`}</h2>
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
              label="Slug (used in the URL, e.g. bsc-computer-science)"
              required
              value={form.slug}
              onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
            />
          )}
          <label className="block text-xs font-bold text-ink-soft">
            University
            <select
              required
              value={form.universitySlug}
              onChange={(e) => set("universitySlug", e.target.value)}
              className={textCls}
            >
              <option value="" disabled>
                Select a university…
              </option>
              {universities.map((u) => (
                <option key={u.slug} value={u.slug}>
                  {u.name}
                </option>
              ))}
            </select>
          </label>
          <Field label="Program name" required value={form.name} onChange={(e) => set("name", e.target.value)} />
          <Field label="Degree type (e.g. Bachelor, Master)" value={form.degreeType} onChange={(e) => set("degreeType", e.target.value)} />
          <Field label="Field of study" value={form.fieldOfStudy} onChange={(e) => set("fieldOfStudy", e.target.value)} />
          <Field label="Duration (months)" type="number" value={form.durationMonths} onChange={(e) => set("durationMonths", e.target.value)} />
          <Field label="Campus (if the university has more than one)" value={form.campus} onChange={(e) => set("campus", e.target.value)} />
        </div>
        <label className="mt-4 block text-xs font-bold text-ink-soft">
          Overview
          <textarea value={form.overview} onChange={(e) => set("overview", e.target.value)} rows={3} className={textCls} />
        </label>
        <div className="mt-4">
          <StringListEditor
            label="Intake Months"
            values={form.intakeMonths}
            onChange={(v) => set("intakeMonths", v)}
            placeholder="e.g. February"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">Photo</h3>
        <ImagePicker
          label="Program photo"
          value={form.photo}
          onChange={(url) => set("photo", url)}
          kind="program"
          countrySlug={form.universitySlug || "new"}
        />
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">Costs</h3>
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Currency (e.g. USD)" value={form.currency} onChange={(e) => set("currency", e.target.value.toUpperCase())} />
          <Field label="Tuition / year" type="number" step="0.01" value={form.tuitionPerYear} onChange={(e) => set("tuitionPerYear", e.target.value)} />
          <Field label="Application fee" type="number" step="0.01" value={form.applicationFee} onChange={(e) => set("applicationFee", e.target.value)} />
          <Field label="Deposit" type="number" step="0.01" value={form.deposit} onChange={(e) => set("deposit", e.target.value)} />
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">Entry Requirements</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Min GPA" type="number" step="0.1" value={form.minGpa} onChange={(e) => set("minGpa", e.target.value)} />
          <Field label="Min IELTS" type="number" step="0.5" value={form.minIelts} onChange={(e) => set("minIelts", e.target.value)} />
          <Field label="Min TOEFL" type="number" value={form.minToefl} onChange={(e) => set("minToefl", e.target.value)} />
        </div>
        <div className="mt-4">
          <StringListEditor label="Requirements" values={form.entryRequirements} onChange={(v) => set("entryRequirements", v)} />
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">Required Documents</h3>
        <StringListEditor label="Documents" values={form.requiredDocuments} onChange={(v) => set("requiredDocuments", v)} />
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <ModulesEditor modules={form.modules} onChange={(v) => set("modules", v)} />
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">Career Prospects</h3>
        <StringListEditor label="Career prospects" values={form.careerProspects} onChange={(v) => set("careerProspects", v)} placeholder="e.g. Software Engineer" />
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-brand-600">Fee Breakdown (Year-by-Year)</h3>
        <p className="mb-4 text-xs text-ink-soft">
          The institution&apos;s own literal billing schedule, in its own currency (e.g. THB for Shinawatra University)
          — shown as a detailed table on the program page, separate from the single USD &quot;Tuition / year&quot;
          figure above used for cross-country search filtering.
        </p>
        <RepeatableEditor
          label="Fee rows"
          items={form.feeBreakdown}
          onChange={(v) => set("feeBreakdown", v)}
          countrySlug={form.universitySlug || "new"}
          fields={[
            { key: "label", label: "Label (e.g. Bachelor · Year 1)" },
            { key: "currency", label: "Currency (e.g. THB)" },
            { key: "registrationFee", label: "Registration fee" },
            { key: "managementFee", label: "Management fee" },
            { key: "tuitionFee", label: "Tuition fee" },
            { key: "total", label: "Total amount" },
          ]}
        />
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">Scholarships</h3>
        <RepeatableEditor
          label="Scholarships"
          items={form.scholarships}
          onChange={(v) => set("scholarships", v as FormState["scholarships"])}
          countrySlug={form.universitySlug || "new"}
          fields={[
            { key: "name", label: "Scholarship name" },
            { key: "amount", label: "Amount / coverage (e.g. 50% tuition)" },
            { key: "note", label: "Eligibility note", type: "textarea" },
          ]}
        />
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">FAQs</h3>
        <RepeatableEditor
          label="FAQs"
          items={form.faqs}
          onChange={(v) => set("faqs", v as FormState["faqs"])}
          countrySlug={form.universitySlug || "new"}
          fields={[
            { key: "q", label: "Question" },
            { key: "a", label: "Answer", type: "textarea" },
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
