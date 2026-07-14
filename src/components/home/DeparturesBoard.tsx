import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getContactLinks } from "@/lib/data/site";
import { MessageCircle, Send, Phone, ArrowRight } from "lucide-react";

export default async function DeparturesBoard() {
  const { whatsapp, telegram } = await getContactLinks();
  return (
    <section className="relative overflow-hidden bg-brand-950 py-16 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(1px_1px_at_15%_25%,white,transparent),radial-gradient(1px_1px_at_65%_70%,white,transparent),radial-gradient(1px_1px_at_85%_15%,white,transparent),radial-gradient(1px_1px_at_35%_85%,white,transparent)] [background-size:220px_220px]" />

      <Reveal className="relative mx-auto max-w-6xl px-5 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/30 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/5 px-6 py-3">
            <span className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
              <span className="h-2 w-2 animate-pulse-soft rounded-full bg-emerald-400" />
              Now Boarding
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-white/40">
              Departures — Your Future
            </span>
          </div>

          <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Let&apos;s Build Your Future</h2>
              <p className="mt-2 text-brand-200/85">Start your journey today — an Application ID in under 10 minutes.</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-green-500/15 px-5 py-3 text-sm font-bold text-green-300 transition-colors hover:bg-green-500/25"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> Chat on WhatsApp
              </a>
              <a
                href={telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-sky-500/15 px-5 py-3 text-sm font-bold text-sky-300 transition-colors hover:bg-sky-500/25"
              >
                <Send className="h-4 w-4" aria-hidden="true" /> Talk on Telegram
              </a>
              <a
                href="tel:+2340000000000"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/20"
              >
                <Phone className="h-4 w-4" aria-hidden="true" /> Call Us
              </a>
              <Link
                href="/apply/"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-hot to-hot-deep px-6 py-3 text-sm font-bold text-white shadow-lg shadow-hot/30 transition-transform hover:-translate-y-0.5"
              >
                Apply Now <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
