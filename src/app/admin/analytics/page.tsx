"use client";

import { useEffect, useState } from "react";

type Row = { slug: string; name: string; views: number; lastViewedAt: string | null };

export default function AdminAnalyticsPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/analytics/destinations");
      if (!res.ok) {
        setError("Couldn't load analytics.");
        return;
      }
      const data = await res.json();
      setRows(data.destinations);
    })();
  }, []);

  const max = rows && rows.length > 0 ? Math.max(...rows.map((r) => r.views), 1) : 1;

  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-xl font-bold">Destination Page Views</h2>
      <p className="mt-1 text-sm text-ink-soft">
        How many times each country's page has been viewed on the live site — a rough signal of which
        destinations get the most student interest.
      </p>

      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

      <div className="mt-6 space-y-3">
        {!rows && !error && <p className="text-sm text-ink-soft">Loading…</p>}
        {rows?.map((r) => (
          <div key={r.slug} className="rounded-2xl border border-brand-100 bg-white p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold">{r.name}</span>
              <span className="font-bold text-brand-700">{r.views} views</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-brand-50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700"
                style={{ width: `${Math.max((r.views / max) * 100, r.views > 0 ? 4 : 0)}%` }}
              />
            </div>
            {r.lastViewedAt && (
              <p className="mt-1.5 text-xs text-ink-soft">Last viewed {new Date(r.lastViewedAt).toLocaleString()}</p>
            )}
          </div>
        ))}
        {rows && rows.length === 0 && <p className="text-sm text-ink-soft">No countries yet.</p>}
      </div>
    </div>
  );
}
