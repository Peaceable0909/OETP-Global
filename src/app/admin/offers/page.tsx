"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { AdminOffer } from "@/lib/admin/types";

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<AdminOffer[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/offers");
    if (!res.ok) {
      setError("Couldn't load offers.");
      return;
    }
    const data = await res.json();
    setOffers(data.offers);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(slug: string, title: string) {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
    const res = await fetch(`/api/admin/offers/${slug}`, { method: "DELETE" });
    if (res.ok) load();
    else setError("Couldn't delete that offer.");
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-ink-soft">{offers ? `${offers.length} offers` : "Loading…"}</p>
        <Link
          href="/admin/offers/edit/"
          className="inline-flex items-center gap-1.5 rounded-full bg-study px-4 py-2.5 text-sm font-bold text-white"
        >
          <Plus className="h-4 w-4" /> Add Offer
        </Link>
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

      <div className="overflow-hidden rounded-2xl border border-line">
        <table className="w-full text-sm">
          <thead className="bg-brand-50 text-left text-xs font-bold uppercase tracking-wider text-ink-soft">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Destination</th>
              <th className="px-4 py-3">Spots</th>
              <th className="px-4 py-3">Expires</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-50">
            {offers?.map((o) => (
              <tr key={o.slug}>
                <td className="px-4 py-3 font-bold">{o.title}</td>
                <td className="px-4 py-3 text-ink-soft">{o.destination}</td>
                <td className="px-4 py-3 text-ink-soft">
                  {o.totalSpots != null ? `${o.spotsTaken} / ${o.totalSpots}` : "Unlimited"}
                </td>
                <td className="px-4 py-3 text-xs text-ink-soft">
                  {o.expiresAt ? new Date(o.expiresAt).toLocaleString() : "No expiry"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      o.active ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {o.active ? "Live" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/offers/edit/?slug=${o.slug}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-50"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Link>
                    <button
                      onClick={() => remove(o.slug, o.title)}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {offers && offers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-soft">
                  No offers yet — add your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
