import type { Metadata } from "next";
import Link from "next/link";
import { getDestinations } from "@/lib/data/destinations";
import Reveal from "@/components/Reveal";
import Flag from "@/components/Flag";
import SmartImage from "@/components/SmartImage";
import SectionHeading from "@/components/SectionHeading";
import CTABand from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Programs",
  description: "Every program across our destinations — culinary, nursing, business, IT, hospitality and more.",
};

export default async function ProgramsPage() {
  const destinations = await getDestinations();
  const rows = destinations.flatMap((d) =>
    d.programs.map((p) => ({ ...p, dest: d }))
  );

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <SectionHeading
          eyebrow="Programs"
          title="Find the Program That Fits You"
          sub="Every program below is offered through a verified partner institution, with admission and visa processes we know inside-out."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r, i) => (
            <Reveal key={`${r.dest.slug}-${r.name}`} delay={(i % 6) * 60} className="h-full">
              <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-lg shadow-brand-600/8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
                <div className="relative h-36 overflow-hidden">
                  <SmartImage
                    src={r.dest.photo}
                    alt={r.dest.name}
                    accent={r.dest.accent}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-ink shadow">
                    <Flag code={r.dest.code} color={r.dest.accent} /> {r.dest.name}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="font-display text-lg font-bold">{r.name}</h2>
                  <p className="mt-1 text-xs font-extrabold uppercase tracking-wider text-brand-600">{r.length}</p>
                  <p className="mt-2 flex-1 text-sm text-ink-soft">{r.note}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-bold text-ink">From {r.dest.tuitionFrom}</span>
                    <Link
                      href={`/apply/?destination=${r.dest.slug}`}
                      className="rounded-full bg-gradient-to-r from-brand-600 to-brand-800 px-4 py-2 text-xs font-bold text-white transition-transform hover:scale-105"
                    >
                      Apply →
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <CTABand />
    </>
  );
}
