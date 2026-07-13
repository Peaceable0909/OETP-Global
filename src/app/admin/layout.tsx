"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Globe2 } from "lucide-react";

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
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-brand-100 pb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Admin</p>
          <h1 className="font-display text-2xl font-bold">Site Content</h1>
        </div>
        <nav className="flex items-center gap-3">
          <Link
            href="/admin/"
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-4 py-2 text-sm font-bold text-brand-700 hover:bg-brand-200"
          >
            <Globe2 className="h-4 w-4" /> Countries
          </Link>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 px-4 py-2 text-sm font-bold text-ink-soft hover:bg-brand-50"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </nav>
      </div>
      {children}
    </div>
  );
}
