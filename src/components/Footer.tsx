import Link from "next/link";
import { site, getContactLinks } from "@/lib/data/site";
import type { Destination } from "@/lib/data/destinations";
import Flag from "@/components/Flag";
import { MessageCircle, Send } from "lucide-react";

export default async function Footer({ destinations }: { destinations: Destination[] }) {
  const { whatsapp, telegram } = await getContactLinks();
  return (
    <footer className="relative overflow-hidden bg-navy text-white/80">
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo-mark.png" alt="" className="h-11 w-11 object-contain" />
            <span className="leading-tight">
              <span className="block font-display text-[15px] font-bold text-white">COMPETENZA</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
                Business Services
              </span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">{site.description}</p>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">Destinations</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {destinations.map((d) => (
              <li key={d.slug}>
                <Link href={`/destinations/${d.slug}/`} className="inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white">
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
                <Link href={l.href} className="text-white/70 transition-colors hover:text-white">
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
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-green-500/15 px-4 py-2 font-semibold text-green-300 transition-colors hover:bg-green-500/25">
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp an Advisor
              </a>
            </li>
            <li>
              <a href={telegram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-sky-500/15 px-4 py-2 font-semibold text-sky-300 transition-colors hover:bg-sky-500/25">
                <Send className="h-4 w-4" aria-hidden="true" /> Telegram Assistant
              </a>
            </li>
            <li className="pt-1 text-white/70">{site.address}</li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {site.name}. Some services are free; others carry transparent fees you approve upfront.
      </div>
    </footer>
  );
}
