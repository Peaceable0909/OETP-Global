"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { AdminCountry } from "@/lib/admin/types";

export default function AdminDashboardPage() {
  const [countries, setCountries] = useState<AdminCountry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/destinations");
    if (!res.ok) {
      setError("Couldn't load countries.");
      return;
    }
    const data = await res.json();
    setCountries(data.countries);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(slug: string, name: string) {
    if (!confirm(`Delete ${name}? This can't be undone.`)) return;
    const res = await fetch(`/api/admin/destinations/${slug}`, { method: "DELETE" });
    if (res.ok) load();
    else setError("Couldn't delete that country.");
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-ink-soft">{countries ? `${countries.length} countries` : "Loading…"}</p>
        <Link
          href="/admin/destinations/edit/"
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-600 to-brand-800 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-600/25"
        >
          <Plus className="h-4 w-4" /> Add Country
        </Link>
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

      <div className="overflow-hidden rounded-2xl border border-brand-100">
        <table className="w-full text-sm">
          <thead className="bg-brand-50 text-left text-xs font-bold uppercase tracking-wider text-ink-soft">
            <tr>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-50">
            {countries?.map((c) => (
              <tr key={c.slug}>
                <td className="px-4 py-3 font-bold">{c.name} <span className="ml-1 text-xs text-ink-soft">{c.code}</span></td>
                <td className="px-4 py-3 text-ink-soft">{c.slug}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      c.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-ink-soft">{new Date(c.updatedAt).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/destinations/edit/?slug=${c.slug}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-brand-200 px-2.5 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-50"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Link>
                    <button
                      onClick={() => remove(c.slug, c.name)}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {countries && countries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-soft">
                  No countries yet — add your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
