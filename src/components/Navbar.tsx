"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/destinations/", label: "Destinations" },
  { href: "/programs/", label: "Programs" },
  { href: "/jobs/", label: "Jobs" },
  { href: "/services/", label: "Services" },
  { href: "/about/", label: "About Us" },
  { href: "/faq/", label: "FAQ" },
  { href: "/contact/", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/85 backdrop-blur-xl shadow-[0_1px_30px_rgba(124,58,237,0.12)]" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 font-display text-lg font-800 text-white shadow-lg shadow-brand-600/30 transition-transform duration-300 group-hover:rotate-6">
            C
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[15px] font-bold tracking-tight">COMPETENCE</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
              & Business Services
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`relative text-sm font-semibold transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:rounded-full after:bg-brand-600 after:transition-all after:duration-300 hover:text-brand-700 ${
                  pathname?.startsWith(l.href) ? "text-brand-700 after:w-full" : "text-ink-soft after:w-0 hover:after:w-full"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/apply/"
            className="hidden rounded-full bg-gradient-to-r from-brand-600 to-brand-800 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-600/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-600/40 sm:block"
          >
            Apply Now
          </Link>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-brand-200 bg-white/70 text-ink lg:hidden"
          >
            <span className="relative block h-3.5 w-5">
              <span className={`absolute left-0 top-0 h-0.5 w-full rounded bg-current transition-all duration-300 ${open ? "top-1.5 rotate-45" : ""}`} />
              <span className={`absolute left-0 top-1.5 h-0.5 w-full rounded bg-current transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 top-3 h-0.5 w-full rounded bg-current transition-all duration-300 ${open ? "top-1.5 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </nav>

      <div
        className={`overflow-hidden bg-white/95 backdrop-blur-xl transition-all duration-300 lg:hidden ${
          open ? "max-h-96 border-b border-brand-100 shadow-xl" : "max-h-0"
        }`}
      >
        <ul className="space-y-1 px-5 py-4">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="block rounded-xl px-4 py-2.5 font-semibold text-ink-soft hover:bg-brand-50 hover:text-brand-700">
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/apply/" className="mt-2 block rounded-xl bg-gradient-to-r from-brand-600 to-brand-800 px-4 py-3 text-center font-bold text-white">
              Apply Now
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
