"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { destinations } from "@/lib/data/destinations";
import { site } from "@/lib/data/site";

type UploadField = { name: string; label: string; hint: string };

const uploadFields: UploadField[] = [
  { name: "passport", label: "International Passport", hint: "Data page — PDF or clear photo" },
  { name: "certificate", label: "Certificates", hint: "Secondary school / degree certificate" },
  { name: "transcript", label: "Transcript", hint: "Academic transcript if available" },
  { name: "cv", label: "CV / Resume", hint: "Optional but recommended" },
];

const inputCls =
  "w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-sm font-medium outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

export default function ApplyForm() {
  const params = useSearchParams();
  const preselected = params.get("destination") ?? "";
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ id: string; skipped: string[] } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/apply", { method: "POST", body: new FormData(e.currentTarget) });
      const data = (await res.json().catch(() => null)) as { id?: string; error?: string; skipped?: string[] } | null;
      if (!res.ok || !data?.id) {
        throw new Error(data?.error ?? "Something went wrong. Please try again or message us on WhatsApp.");
      }
      setResult({ id: data.id, skipped: data.skipped ?? [] });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again or message us on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-emerald-200 bg-emerald-50 p-10 text-center shadow-xl">
        <span className="text-5xl">🎉</span>
        <h2 className="mt-4 font-display text-2xl font-extrabold">Application Received!</h2>
        <p className="mt-3 text-ink-soft">Your Application ID is</p>
        <p className="mt-2 inline-block rounded-2xl bg-white px-6 py-3 font-display text-2xl font-extrabold tracking-widest text-brand-700 shadow">
          {result.id}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
          Save this ID — you&apos;ll use it in every conversation with us. A counselor will
          contact you within 24–48 hours.
        </p>
        {result.skipped.length > 0 && (
          <p className="mt-3 rounded-xl bg-amber-100 px-4 py-3 text-xs font-semibold text-amber-800">
            Note: we couldn&apos;t store these uploads yet: {result.skipped.join(", ")}. A counselor
            will collect them from you directly.
          </p>
        )}
        <a
          href={`${site.whatsapp}?text=${encodeURIComponent(`Hello! I just applied. My Application ID is ${result.id}.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-full bg-green-500 px-7 py-3.5 font-bold text-white shadow-lg shadow-green-500/30 transition-transform hover:-translate-y-0.5"
        >
          💬 Continue on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-8">
      {error && (
        <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
          ⚠️ {error}
        </p>
      )}

      <fieldset className="rounded-3xl border border-brand-100 bg-white p-7 shadow-lg shadow-brand-600/8">
        <legend className="px-2 font-display text-lg font-bold">1 · Personal Information</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-bold">
            Full Name *
            <input name="full_name" required placeholder="e.g. Femi Olaniyi" className={`mt-1.5 ${inputCls}`} />
          </label>
          <label className="block text-sm font-bold">
            Email *
            <input name="email" type="email" required placeholder="you@example.com" className={`mt-1.5 ${inputCls}`} />
          </label>
          <label className="block text-sm font-bold">
            Phone (WhatsApp) *
            <input name="phone" required placeholder="+234 ..." className={`mt-1.5 ${inputCls}`} />
          </label>
          <label className="block text-sm font-bold">
            Country of Residence *
            <input name="country" required placeholder="e.g. Nigeria" className={`mt-1.5 ${inputCls}`} />
          </label>
        </div>
      </fieldset>

      <fieldset className="rounded-3xl border border-brand-100 bg-white p-7 shadow-lg shadow-brand-600/8">
        <legend className="px-2 font-display text-lg font-bold">2 · Your Goal</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-bold">
            Preferred Destination *
            <select name="destination" required defaultValue={preselected} className={`mt-1.5 ${inputCls}`}>
              <option value="" disabled>Select a destination…</option>
              {destinations.map((d) => (
                <option key={d.slug} value={d.slug}>{d.flag} {d.name} — {d.tagline}</option>
              ))}
              <option value="undecided">🤔 Not sure yet — advise me</option>
            </select>
          </label>
          <label className="block text-sm font-bold">
            Preferred Program
            <input name="program" placeholder="e.g. Culinary Arts, Nursing…" className={`mt-1.5 ${inputCls}`} />
          </label>
          <label className="block text-sm font-bold sm:col-span-2">
            Anything we should know?
            <textarea name="message" rows={3} placeholder="Your budget, timeline, qualifications…" className={`mt-1.5 ${inputCls}`} />
          </label>
        </div>
      </fieldset>

      <fieldset className="rounded-3xl border border-brand-100 bg-white p-7 shadow-lg shadow-brand-600/8">
        <legend className="px-2 font-display text-lg font-bold">3 · Documents</legend>
        <p className="mb-5 text-xs font-semibold text-ink-soft">
          PDF, JPG or PNG — max 10 MB each. Don&apos;t have everything? Submit what you have;
          a counselor will guide you on the rest.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          {uploadFields.map((f) => (
            <label key={f.name} className="block text-sm font-bold">
              {f.label}
              <input
                type="file"
                name={f.name}
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                className="mt-1.5 w-full cursor-pointer rounded-xl border border-dashed border-brand-300 bg-brand-50/50 px-4 py-3 text-xs font-medium file:mr-3 file:rounded-full file:border-0 file:bg-brand-600 file:px-4 file:py-1.5 file:text-xs file:font-bold file:text-white hover:border-brand-500"
              />
              <span className="mt-1 block text-[11px] font-medium text-ink-soft">{f.hint}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-gradient-to-r from-brand-600 to-brand-800 px-8 py-4 font-display text-lg font-extrabold text-white shadow-xl shadow-brand-600/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Submit Application →"}
      </button>
      <p className="text-center text-xs font-medium text-ink-soft">
        Submitting is free. You instantly receive an Application ID, and we&apos;re transparent
        about any service fees before you commit to anything.
      </p>
    </form>
  );
}
