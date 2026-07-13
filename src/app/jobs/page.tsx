import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { site } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Job Opportunities",
  description: "Verified overseas job offers with transparent terms and a money-back guarantee.",
};

// Placeholder roles until the company provides its confirmed offer list
const roles = [
  { title: "Culinary Staff", country: "Albania 🇦🇱", type: "Full-time", note: "For culinary program graduates — placement support included", visa: "Work permit after study" },
  { title: "Hospitality & Resort Staff", country: "Maldives 🇲🇻", type: "Contract", note: "Resort positions with accommodation included", visa: "Employer-sponsored" },
  { title: "Service & Retail Roles", country: "Cyprus 🇨🇾", type: "Part-time", note: "Student-friendly roles compatible with study schedules", visa: "Student work rights" },
];

export default function JobsPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <SectionHeading
        eyebrow="💼 Work Abroad"
        title="Genuine Job Offers. Guaranteed."
        sub="We only list confirmed, verified offers — backed by a reasonable money-back guarantee. New positions are added as they're confirmed."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {roles.map((r, i) => (
          <Reveal key={r.title} delay={i * 80} className="h-full">
            <div className="flex h-full flex-col rounded-3xl border border-brand-100 bg-white p-7 shadow-lg shadow-brand-600/8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
              <span className="inline-flex w-max rounded-full bg-brand-100 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-brand-700">
                {r.type}
              </span>
              <h2 className="mt-4 font-display text-xl font-bold">{r.title}</h2>
              <p className="mt-1 font-semibold text-brand-700">{r.country}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{r.note}</p>
              <p className="mt-3 text-xs font-bold text-ink-soft">🛂 {r.visa}</p>
              <Link
                href="/apply/"
                className="mt-5 rounded-full bg-gradient-to-r from-brand-600 to-brand-800 px-5 py-3 text-center text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition-transform hover:scale-[1.02]"
              >
                Express Interest →
              </Link>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14">
        <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-r from-brand-700 to-fuchsia-600 p-8 text-center text-white shadow-2xl shadow-brand-600/25">
          <h2 className="font-display text-xl font-extrabold">Have skills to offer?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/85">
            Send us your details and CV — when a matching confirmed offer opens, you&apos;ll be
            the first to hear.
          </p>
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block rounded-full bg-white px-7 py-3 font-bold text-brand-800 shadow-lg transition-transform hover:-translate-y-0.5"
          >
            💬 Send Your Details
          </a>
        </div>
      </Reveal>
    </section>
  );
}
