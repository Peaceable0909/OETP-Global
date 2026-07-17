"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { DOCUMENT_PORTAL_URL } from "@/lib/documentPortal";

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
        scrolled ? "bg-white border-b border-line" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
        <Link href="/" className="group flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo.png"
            alt="CompeTenza Business Services"
            className="h-10 w-auto transition-transform duration-300 group-hover:scale-[1.03] sm:h-11"
          />
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`relative text-sm font-semibold transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:rounded-full after:bg-study after:transition-all after:duration-300 hover:text-study ${
                  pathname?.startsWith(l.href) ? "text-study after:w-full" : "text-ink-soft after:w-0 hover:after:w-full"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href={DOCUMENT_PORTAL_URL}
            className="hidden rounded-full bg-study px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-study-deep sm:block"
          >
            Apply Now
          </a>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-white text-ink lg:hidden"
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
        className={`overflow-hidden bg-white transition-all duration-300 lg:hidden ${
          open ? "max-h-96 border-b border-line shadow-sm" : "max-h-0"
        }`}
      >
        <ul className="space-y-1 px-5 py-4">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="block rounded-xl px-4 py-3 font-semibold text-ink-soft hover:bg-surface hover:text-study">
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <a href={DOCUMENT_PORTAL_URL} className="mt-2 block rounded-xl bg-study px-4 py-3 text-center font-bold text-white hover:bg-study-deep">
              Apply Now
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
