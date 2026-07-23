"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Save } from "lucide-react";
import type { AdminOffer } from "@/lib/admin/types";
import type { AdminCountry } from "@/lib/admin/types";
import StringListEditor from "./StringListEditor";

type FormState = Omit<
  AdminOffer,
  "id" | "createdAt" | "totalSpots" | "spotsTaken" | "originalPrice" | "discountedPrice"
> & {
  totalSpots: string;
  spotsTaken: string;
  originalPrice: string;
  discountedPrice: string;
};

function emptyForm(): FormState {
  return {
    slug: "",
    title: "",
    destination: "",
    tagline: "",
    badge: "",
    totalSpots: "",
    spotsTaken: "0",
    expiresAt: "",
    active: true,
    discountLabel: "",
    originalPrice: "",
    discountedPrice: "",
    priceCurrency: "USD",
    perks: [],
    popularPrograms: [],
    ctaNote: "",
  };
}

const textCls =
  "mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

const BADGE_OPTIONS = ["", "HOT", "MOST POPULAR", "NEW", "TRENDING"];

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-xs font-bold text-ink-soft">
      {label}
      <input {...rest} className={textCls} />
    </label>
  );
}

// <input type="datetime-local"> works in local time with no timezone suffix;
// offers.expires_at is stored/compared as a UTC ISO string, so convert both ways.
function toLocalInputValue(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInputValue(local: string): string {
  if (!local) return "";
  const d = new Date(local);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString();
}

export default function EditOfferForm() {
  const router = useRouter();
  const params = useSearchParams();
  const slug = params.get("slug");
  const isNew = !slug;

  const [form, setForm] = useState<FormState>(emptyForm());
  const [countries, setCountries] = useState<AdminCountry[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
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
      const res = await fetch(`/api/admin/offers/${slug}`);
      if (!res.ok) {
        setMessage({ kind: "error", text: "Couldn't load this offer." });
        setLoading(false);
        return;
      }
      const data = (await res.json()) as { offer: AdminOffer };
      const o = data.offer;
      setForm({
        ...o,
        totalSpots: o.totalSpots != null ? String(o.totalSpots) : "",
        spotsTaken: String(o.spotsTaken ?? 0),
        expiresAt: toLocalInputValue(o.expiresAt),
        originalPrice: o.originalPrice != null ? String(o.originalPrice) : "",
        discountedPrice: o.discountedPrice != null ? String(o.discountedPrice) : "",
      });
      setLoading(false);
    })();
  }, [isNew, slug]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const method = isNew ? "POST" : "PUT";
      const url = isNew ? "/api/admin/offers" : `/api/admin/offers/${slug}`;
      const body = {
        ...form,
        totalSpots: form.totalSpots === "" ? null : Number(form.totalSpots),
        spotsTaken: form.spotsTaken === "" ? 0 : Number(form.spotsTaken),
        expiresAt: fromLocalInputValue(form.expiresAt),
        originalPrice: form.originalPrice === "" ? null : Number(form.originalPrice),
        discountedPrice: form.discountedPrice === "" ? null : Number(form.discountedPrice),
      };
      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Save failed");

      setMessage({ kind: "ok", text: "Saved — this goes live on the homepage immediately, no rebuild needed." });

      if (isNew) router.replace(`/admin/offers/edit/?slug=${form.slug}`);
    } catch (err) {
      setMessage({ kind: "error", text: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-ink-soft">Loading…</p>;

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold">{isNew ? "Add Offer" : `Edit ${form.title || slug}`}</h2>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            form.active ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
          }`}
        >
          {form.active ? "Live on homepage" : "Hidden"}
        </span>
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
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">Offer</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {isNew && (
            <label className="block text-xs font-bold text-ink-soft">
              Slug (unique ID, e.g. albania-culinary-waiver)
              <input
                required
                value={form.slug}
                onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                className={textCls}
              />
            </label>
          )}
          <label className="block text-xs font-bold text-ink-soft">
            Title
            <input required value={form.title} onChange={(e) => set("title", e.target.value)} className={textCls} />
          </label>
          <label className="block text-xs font-bold text-ink-soft">
            Destination
            <select required value={form.destination} onChange={(e) => set("destination", e.target.value)} className={textCls}>
              <option value="" disabled>
                Select a destination…
              </option>
              {countries.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-bold text-ink-soft">
            Badge
            <select value={form.badge} onChange={(e) => set("badge", e.target.value)} className={textCls}>
              {BADGE_OPTIONS.map((b) => (
                <option key={b} value={b}>
                  {b || "None"}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-bold text-ink-soft">
            Expires at (leave blank for no expiry)
            <input
              type="datetime-local"
              value={form.expiresAt}
              onChange={(e) => set("expiresAt", e.target.value)}
              className={textCls}
            />
          </label>
        </div>
        <label className="mt-4 block text-xs font-bold text-ink-soft">
          Tagline (one or two sentences shown on the card)
          <textarea value={form.tagline} onChange={(e) => set("tagline", e.target.value)} rows={2} className={textCls} />
        </label>
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-brand-600">Discount / Pricing (optional)</h3>
        <p className="mb-4 text-xs text-ink-soft">
          Not every offer is a fee waiver — use whatever headline actually applies (e.g. &quot;$1,000 Tuition
          Discount&quot;, &quot;Application Fee Waived&quot;). Leave the prices blank for an offer with no specific
          discount amount to show.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-xs font-bold text-ink-soft sm:col-span-2">
            Discount headline (e.g. $1,000 Tuition Discount)
            <input value={form.discountLabel} onChange={(e) => set("discountLabel", e.target.value)} className={textCls} />
          </label>
          <Field label="Currency (e.g. USD)" value={form.priceCurrency} onChange={(e) => set("priceCurrency", e.target.value.toUpperCase())} />
          <div />
          <Field label="Original price" type="number" step="0.01" value={form.originalPrice} onChange={(e) => set("originalPrice", e.target.value)} />
          <Field label="Discounted price" type="number" step="0.01" value={form.discountedPrice} onChange={(e) => set("discountedPrice", e.target.value)} />
        </div>
        <label className="mt-4 block text-xs font-bold text-ink-soft">
          Reassurance note under the CTA (e.g. &quot;Pay tuition only after your eligibility is confirmed.&quot;)
          <input value={form.ctaNote} onChange={(e) => set("ctaNote", e.target.value)} className={textCls} />
        </label>
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">Perks</h3>
        <StringListEditor
          label="Perks"
          values={form.perks}
          onChange={(v) => set("perks", v)}
          placeholder="e.g. FREE Accommodation"
        />
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">Popular Programmes</h3>
        <StringListEditor
          label="Popular programmes"
          values={form.popularPrograms}
          onChange={(v) => set("popularPrograms", v)}
          placeholder="e.g. Business Administration"
        />
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">Limited Spots (optional)</h3>
        <p className="mb-4 text-xs text-ink-soft">
          Leave &quot;Total spots&quot; blank for an offer with no spot limit — it&apos;ll show without a progress bar or
          countdown of remaining seats.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-xs font-bold text-ink-soft">
            Total spots
            <input
              type="number"
              min={0}
              value={form.totalSpots}
              onChange={(e) => set("totalSpots", e.target.value)}
              className={textCls}
            />
          </label>
          <label className="block text-xs font-bold text-ink-soft">
            Spots taken
            <input
              type="number"
              min={0}
              value={form.spotsTaken}
              onChange={(e) => set("spotsTaken", e.target.value)}
              className={textCls}
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <label className="flex items-center gap-2 text-sm font-bold">
          <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} />
          Active — show this offer on the homepage
        </label>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white px-5 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-3 lg:px-8">
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-study px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
