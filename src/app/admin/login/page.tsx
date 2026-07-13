"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Login failed");
      }
      router.push("/admin/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-5 py-16">
      <div className="rounded-3xl border border-brand-100 bg-white p-8 shadow-xl shadow-brand-600/10">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-100 text-brand-700">
          <Lock className="h-5 w-5" />
        </span>
        <h1 className="mt-4 text-center font-display text-xl font-bold">Admin Login</h1>
        <p className="mt-1 text-center text-sm text-ink-soft">Manage countries, programs and images.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">{error}</p>
          )}
          <input
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-xl border border-brand-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-gradient-to-r from-brand-600 to-brand-800 px-6 py-3 font-bold text-white shadow-lg shadow-brand-600/25 disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
