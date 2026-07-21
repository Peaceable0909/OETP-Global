"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { AdminUniversity } from "@/lib/admin/types";

export default function AdminUniversitiesPage() {
  const [universities, setUniversities] = useState<AdminUniversity[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/universities");
    if (!res.ok) {
      setError("Couldn't load universities.");
      return;
    }
    const data = await res.json();
    setUniversities(data.universities);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(slug: string, name: string) {
    if (!confirm(`Delete ${name}? This can't be undone.`)) return;
    const res = await fetch(`/api/admin/universities/${slug}`, { method: "DELETE" });
    if (res.ok) load();
    else {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Couldn't delete that university.");
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-ink-soft">{universities ? `${universities.length} universities` : "Loading…"}</p>
        <Link
          href="/admin/universities/edit/"
          className="inline-flex items-center gap-1.5 rounded-full bg-study px-4 py-2.5 text-sm font-bold text-white"
        >
          <Plus className="h-4 w-4" /> Add University
        </Link>
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

      <div className="overflow-hidden rounded-2xl border border-line">
        <table className="w-full text-sm">
          <thead className="bg-brand-50 text-left text-xs font-bold uppercase tracking-wider text-ink-soft">
            <tr>
              <th className="px-4 py-3">University</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-50">
            {universities?.map((u) => (
              <tr key={u.slug}>
                <td className="px-4 py-3 font-bold">{u.name}</td>
                <td className="px-4 py-3 text-ink-soft">{u.countrySlug}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      u.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-ink-soft">{new Date(u.updatedAt).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/universities/edit/?slug=${u.slug}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-50"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Link>
                    <button
                      onClick={() => remove(u.slug, u.name)}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {universities && universities.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-soft">
                  No universities yet — add your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
