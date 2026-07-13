"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { AdminTestimonial } from "@/lib/admin/types";

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<AdminTestimonial[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/testimonials");
    if (!res.ok) {
      setError("Couldn't load stories.");
      return;
    }
    const data = await res.json();
    setStories(data.testimonials);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(slug: string, name: string) {
    if (!confirm(`Delete ${name}'s story? This can't be undone.`)) return;
    const res = await fetch(`/api/admin/testimonials/${slug}`, { method: "DELETE" });
    if (res.ok) load();
    else setError("Couldn't delete that story.");
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-ink-soft">{stories ? `${stories.length} stories` : "Loading…"}</p>
        <Link
          href="/admin/stories/edit/"
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-600 to-brand-800 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-600/25"
        >
          <Plus className="h-4 w-4" /> Add Story
        </Link>
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

      <div className="overflow-hidden rounded-2xl border border-brand-100">
        <table className="w-full text-sm">
          <thead className="bg-brand-50 text-left text-xs font-bold uppercase tracking-wider text-ink-soft">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Destination</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-50">
            {stories?.map((s) => (
              <tr key={s.slug}>
                <td className="px-4 py-3 font-bold">{s.name}</td>
                <td className="px-4 py-3 text-ink-soft">{s.destination}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      s.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-ink-soft">{new Date(s.updatedAt).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/stories/edit/?slug=${s.slug}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-brand-200 px-2.5 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-50"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Link>
                    <button
                      onClick={() => remove(s.slug, s.name)}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {stories && stories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-soft">
                  No stories yet — add your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
