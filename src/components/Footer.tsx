import Link from "next/link";
import { site } from "@/lib/data/site";
import type { Destination } from "@/lib/data/destinations";
import Flag from "@/components/Flag";
import { MessageCircle, Send } from "lucide-react";

export default function Footer({ destinations }: { destinations: Destination[] }) {
  return (
    <footer className="relative overflow-hidden bg-brand-950 text-brand-100">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-brand-600/20 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 font-display text-lg font-bold text-white">
              C
            </span>
            <span className="leading-tight">
              <span className="block font-display text-[15px] font-bold text-white">COMPETENCE</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-300">
                & Business Services
              </span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-200/80">{site.description}</p>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">Destinations</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {destinations.map((d) => (
              <li key={d.slug}>
                <Link href={`/destinations/${d.slug}/`} className="inline-flex items-center gap-2 text-brand-200/80 transition-colors hover:text-white">
                  <Flag code={d.code} color={d.accent} /> {d.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              { href: "/services/", label: "Our Services" },
              { href: "/jobs/", label: "Job Opportunities" },
              { href: "/faq/", label: "FAQ" },
              { href: "/about/", label: "About Us" },
              { href: "/contact/", label: "Contact" },
              { href: "/apply/", label: "Apply Now" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-brand-200/80 transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">Talk to us</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-green-500/15 px-4 py-2 font-semibold text-green-300 transition-colors hover:bg-green-500/25">
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp an Advisor
              </a>
            </li>
            <li>
              <a href={site.telegram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-sky-500/15 px-4 py-2 font-semibold text-sky-300 transition-colors hover:bg-sky-500/25">
                <Send className="h-4 w-4" aria-hidden="true" /> Telegram Assistant
              </a>
            </li>
            <li className="pt-1 text-brand-200/80">{site.address}</li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10 py-5 text-center text-xs text-brand-300/70">
        © {new Date().getFullYear()} {site.name}. Some services are free; others carry transparent fees you approve upfront.
      </div>
    </footer>
  );
}
