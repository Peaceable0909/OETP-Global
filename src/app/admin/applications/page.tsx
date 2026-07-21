"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import type { AdminApplication } from "@/lib/admin/types";

const statusColors: Record<string, string> = {
  new: "bg-amber-100 text-amber-700",
  reviewing: "bg-sky-100 text-sky-700",
  contacted: "bg-violet-100 text-violet-700",
  completed: "bg-emerald-100 text-emerald-700",
};

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<AdminApplication[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/applications")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setApplications(data.applications))
      .catch(() => setError("Couldn't load applications."));
  }, []);

  return (
    <div>
      <div className="mb-5">
        <p className="text-sm text-ink-soft">
          {applications ? `${applications.length} application${applications.length === 1 ? "" : "s"}` : "Loading…"}
        </p>
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

      <div className="overflow-hidden rounded-2xl border border-line">
        <table className="w-full text-sm">
          <thead className="bg-brand-50 text-left text-xs font-bold uppercase tracking-wider text-ink-soft">
            <tr>
              <th className="px-4 py-3">Applicant</th>
              <th className="px-4 py-3">Destination</th>
              <th className="px-4 py-3">Program</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-50">
            {applications?.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-3">
                  <span className="block font-bold">{a.fullName}</span>
                  <span className="text-xs text-ink-soft">{a.email}</span>
                </td>
                <td className="px-4 py-3 text-ink-soft">{a.destination}</td>
                <td className="px-4 py-3 text-ink-soft">{a.program || "—"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusColors[a.status] ?? "bg-surface text-ink-soft"}`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-ink-soft">{new Date(a.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/applications/detail/?id=${a.id}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-50"
                  >
                    <Eye className="h-3.5 w-3.5" /> View
                  </Link>
                </td>
              </tr>
            ))}
            {applications && applications.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-soft">
                  No applications yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
