"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FileText, Download } from "lucide-react";
import type { AdminApplication, AdminApplicationDocument } from "@/lib/admin/types";
import { APPLICATION_STATUSES } from "@/lib/admin/applicationStatuses";

function formatSize(bytes: number | null): string {
  if (bytes == null) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ApplicationDetail() {
  const params = useSearchParams();
  const id = params.get("id");

  const [application, setApplication] = useState<AdminApplication | null>(null);
  const [documents, setDocuments] = useState<AdminApplicationDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/applications/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: { application: AdminApplication; documents: AdminApplicationDocument[] }) => {
        setApplication(data.application);
        setDocuments(data.documents);
      })
      .catch(() => setError("Couldn't load this application."))
      .finally(() => setLoading(false));
  }, [id]);

  async function updateStatus(status: string) {
    if (!id) return;
    setUpdating(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Update failed");
      setApplication(data.application);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setUpdating(false);
    }
  }

  if (!id) return <p className="text-sm text-ink-soft">No application specified.</p>;
  if (loading) return <p className="text-sm text-ink-soft">Loading…</p>;
  if (!application) return <p className="text-sm text-red-600">{error ?? "Application not found."}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold">{application.fullName}</h2>
          <p className="text-xs text-ink-soft">{application.id}</p>
        </div>
        <label className="flex items-center gap-2 text-sm font-bold">
          Status
          <select
            value={application.status}
            disabled={updating}
            onChange={(e) => updateStatus(e.target.value)}
            className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand-500"
          >
            {APPLICATION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">Applicant</h3>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-bold text-ink-soft">Email</dt>
            <dd className="text-sm">{application.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold text-ink-soft">Phone</dt>
            <dd className="text-sm">{application.phone}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold text-ink-soft">Country of residence</dt>
            <dd className="text-sm">{application.country}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold text-ink-soft">Destination</dt>
            <dd className="text-sm">{application.destination}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold text-ink-soft">Program</dt>
            <dd className="text-sm">{application.program || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold text-ink-soft">Submitted</dt>
            <dd className="text-sm">{new Date(application.createdAt).toLocaleString()}</dd>
          </div>
        </dl>
        {application.message && (
          <div className="mt-4">
            <dt className="text-xs font-bold text-ink-soft">Message</dt>
            <dd className="mt-1 text-sm leading-relaxed">{application.message}</dd>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">Documents</h3>
        {documents.length === 0 ? (
          <p className="text-sm text-ink-soft">No documents were uploaded with this application.</p>
        ) : (
          <ul className="divide-y divide-line">
            {documents.map((d) => (
              <li key={d.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-doc" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-bold">{d.filename}</p>
                    <p className="text-xs text-ink-soft">
                      {d.docType} · {formatSize(d.sizeBytes)}
                    </p>
                  </div>
                </div>
                <a
                  href={`/api/admin/applications/${application.id}/documents/${d.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-50"
                >
                  <Download className="h-3.5 w-3.5" /> View
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
