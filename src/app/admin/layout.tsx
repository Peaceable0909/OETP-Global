"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Globe2, Quote, Settings, BarChart3, Landmark, GraduationCap } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login/" || pathname === "/admin/login";
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      const res = await fetch("/api/admin/session");
      if (cancelled) return;
      if (res.ok) {
        if (isLoginPage) router.replace("/admin/");
      } else if (!isLoginPage) {
        router.replace("/admin/login/");
      }
      setChecked(true);
    }
    check();
    return () => {
      cancelled = true;
    };
  }, [isLoginPage, router]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login/");
  }

  if (isLoginPage) return <>{children}</>;

  if (!checked) {
    return <div className="px-5 py-24 text-center text-sm text-ink-soft">Checking session…</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Admin</p>
          <h1 className="font-display text-2xl font-bold">Site Content</h1>
        </div>
        <nav className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/"
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold ${
              pathname === "/admin/" ? "bg-brand-600 text-white" : "bg-brand-100 text-brand-700 hover:bg-brand-200"
            }`}
          >
            <Globe2 className="h-4 w-4" /> Countries
          </Link>
          <Link
            href="/admin/universities/"
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold ${
              pathname?.startsWith("/admin/universities") ? "bg-brand-600 text-white" : "bg-brand-100 text-brand-700 hover:bg-brand-200"
            }`}
          >
            <Landmark className="h-4 w-4" /> Universities
          </Link>
          <Link
            href="/admin/programs/"
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold ${
              pathname?.startsWith("/admin/programs") ? "bg-brand-600 text-white" : "bg-brand-100 text-brand-700 hover:bg-brand-200"
            }`}
          >
            <GraduationCap className="h-4 w-4" /> Programs
          </Link>
          <Link
            href="/admin/stories/"
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold ${
              pathname?.startsWith("/admin/stories") ? "bg-brand-600 text-white" : "bg-brand-100 text-brand-700 hover:bg-brand-200"
            }`}
          >
            <Quote className="h-4 w-4" /> Stories
          </Link>
          <Link
            href="/admin/analytics/"
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold ${
              pathname === "/admin/analytics/" ? "bg-brand-600 text-white" : "bg-brand-100 text-brand-700 hover:bg-brand-200"
            }`}
          >
            <BarChart3 className="h-4 w-4" /> Analytics
          </Link>
          <Link
            href="/admin/settings/"
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold ${
              pathname === "/admin/settings/" ? "bg-brand-600 text-white" : "bg-brand-100 text-brand-700 hover:bg-brand-200"
            }`}
          >
            <Settings className="h-4 w-4" /> Settings
          </Link>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-bold text-ink-soft hover:bg-brand-50"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </nav>
      </div>
      {children}
    </div>
  );
}
