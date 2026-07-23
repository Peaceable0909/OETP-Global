import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { getContactLinks } from "@/lib/data/site";
import { pageMetadata } from "@/lib/seo";
import Flag from "@/components/Flag";
import { MessageCircle, Stamp } from "lucide-react";

export const metadata: Metadata = pageMetadata({
  title: "Job Opportunities",
  description: "Verified overseas job offers with transparent terms and a money-back guarantee.",
  path: "/jobs/",
});

// Placeholder roles until the company provides its confirmed offer list
const roles = [
  { title: "Culinary Staff", country: "Albania", code: "AL", accent: "#DC2626", type: "Full-time", note: "For culinary program graduates — placement support included", visa: "Work permit after study" },
  { title: "IT & Business Support Roles", country: "Malaysia", code: "MY", accent: "#4F46E5", type: "Contract", note: "Roles for graduates of business and tech programs, employer-sponsored", visa: "Employer-sponsored" },
  { title: "Service & Retail Roles", country: "Cyprus", code: "CY", accent: "#0284C7", type: "Part-time", note: "Student-friendly roles compatible with study schedules", visa: "Student work rights" },
];

export default async function JobsPage() {
  const { whatsapp } = await getContactLinks();
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <SectionHeading
        eyebrow="Work Abroad"
        title="Genuine Job Offers. Guaranteed."
        sub="We only list confirmed, verified offers — backed by a reasonable money-back guarantee. New positions are added as they're confirmed."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {roles.map((r, i) => (
          <Reveal key={r.title} delay={i * 80} className="h-full">
            <div className="flex h-full flex-col rounded-3xl border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg">
              <span className="inline-flex w-max rounded-full bg-jobs-soft px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-jobs">
                {r.type}
              </span>
              <h2 className="mt-4 font-display text-xl font-bold">{r.title}</h2>
              <p className="mt-1 inline-flex items-center gap-1.5 font-semibold text-jobs">
                <Flag code={r.code} color={r.accent} /> {r.country}
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{r.note}</p>
              <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-ink-soft">
                <Stamp className="h-3.5 w-3.5" aria-hidden="true" /> {r.visa}
              </p>
              <Link
                href="/apply/"
                className="mt-5 rounded-full bg-jobs px-5 py-3 text-center text-sm font-bold text-white transition-transform hover:scale-[1.02]"
              >
                Express Interest →
              </Link>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14">
        <div className="mx-auto max-w-3xl rounded-3xl bg-jobs p-8 text-center text-white">
          <h2 className="font-display text-xl font-extrabold">Have skills to offer?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/85">
            Send us your details and CV — when a matching confirmed offer opens, you&apos;ll be
            the first to hear.
          </p>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-bold text-jobs transition-transform hover:-translate-y-0.5"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" /> Send Your Details
          </a>
        </div>
      </Reveal>
    </section>
  );
}
