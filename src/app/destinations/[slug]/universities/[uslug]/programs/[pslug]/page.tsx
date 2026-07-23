import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDestination } from "@/lib/data/destinations";
import { getUniversities, getUniversity } from "@/lib/data/universities";
import { getPrograms, getProgram, getRelatedPrograms, getIntakesByProgram } from "@/lib/data/programs";
import Reveal from "@/components/Reveal";
import SmartImage from "@/components/SmartImage";
import ProgramCard from "@/components/ProgramCard";
import { formatMoney } from "@/lib/currency";
import FaqAccordion from "@/components/FaqAccordion";
import ApplicationTimeline from "@/components/ApplicationTimeline";
import CTABand from "@/components/CTABand";
import StatCounter from "@/components/StatCounter";
import { FileText } from "lucide-react";
import type { ReactNode } from "react";

export async function generateStaticParams() {
  const [programs, universities] = await Promise.all([getPrograms(), getUniversities()]);
  const uMap = new Map(universities.map((u) => [u.slug, u]));
  return programs
    .map((p) => {
      const u = uMap.get(p.universitySlug);
      return u ? { slug: u.countrySlug, uslug: u.slug, pslug: p.slug } : null;
    })
    .filter((x): x is { slug: string; uslug: string; pslug: string } => x !== null);
}

export async function generateMetadata({ params }: { params: Promise<{ pslug: string }> }): Promise<Metadata> {
  const { pslug } = await params;
  const p = await getProgram(pslug);
  if (!p) return {};
  return { title: p.name, description: p.overview || `${p.name} — tuition, requirements, and how to apply.` };
}

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ slug: string; uslug: string; pslug: string }>;
}) {
  const { slug, uslug, pslug } = await params;
  const [country, university, program] = await Promise.all([
    getDestination(slug),
    getUniversity(uslug),
    getProgram(pslug),
  ]);
  if (
    !country ||
    !university ||
    !program ||
    university.countrySlug !== country.slug ||
    program.universitySlug !== university.slug
  ) {
    notFound();
  }

  const [related, intakes] = await Promise.all([
    getRelatedPrograms(university.slug, program.slug),
    getIntakesByProgram(program.slug),
  ]);

  const accent = country.accent;
  const applyHref = `/apply/?destination=${country.slug}&program=${encodeURIComponent(`${program.name} — ${university.name}`)}`;

  return (
    <>
      <section className="relative overflow-hidden text-white">
        <SmartImage
          src={program.photo}
          alt={program.name}
          accent={accent}
          className="hero-kenburns absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-12 lg:px-8">
          <nav className="animate-hero-rise text-sm font-semibold text-white/75">
            <Link href="/" className="hover:text-white">Home</Link> /{" "}
            <Link href="/destinations/" className="hover:text-white">Destinations</Link> /{" "}
            <Link href={`/destinations/${country.slug}/`} className="hover:text-white">{country.name}</Link> /{" "}
            <Link href={`/destinations/${country.slug}/universities/${university.slug}/`} className="hover:text-white">
              {university.name}
            </Link>{" "}
            / <span className="text-white">{program.name}</span>
          </nav>
          <h1
            className="animate-hero-rise mt-6 text-4xl font-extrabold sm:text-5xl"
            style={{ animationDelay: "90ms" }}
          >
            {program.name}
          </h1>
          <p className="animate-hero-rise mt-2 text-lg font-semibold text-white/90" style={{ animationDelay: "160ms" }}>
            {university.name}, {country.name}
          </p>
          <div className="animate-hero-rise mt-5 flex flex-wrap gap-2.5" style={{ animationDelay: "230ms" }}>
            {program.degreeType && <Badge accent={accent}>{program.degreeType}</Badge>}
            {program.fieldOfStudy && <Badge accent={accent}>{program.fieldOfStudy}</Badge>}
            {program.campus && <Badge accent={accent}>{program.campus}</Badge>}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 lg:grid-cols-[1fr_20rem] lg:px-8">
        <div className="space-y-14">
          <Reveal>
            <h2 className="text-2xl font-bold sm:text-3xl">Overview</h2>
            <p className="mt-4 max-w-2xl text-ink-soft">
              {program.overview || "Details coming soon — contact us for the latest information on this program."}
            </p>
          </Reveal>

          <Reveal>
            <h2 className="text-2xl font-bold sm:text-3xl">Costs</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <CostCell
                label="Tuition / year"
                value={program.tuitionPerYear ? formatMoney(program.tuitionPerYear, program.currency) : "On request"}
              />
              <CostCell
                label="Application fee"
                value={program.applicationFee ? formatMoney(program.applicationFee, program.currency) : "On request"}
              />
              <CostCell
                label="Deposit"
                value={program.deposit ? formatMoney(program.deposit, program.currency) : "On request"}
              />
            </div>
          </Reveal>

          <Reveal>
            <h2 className="text-2xl font-bold sm:text-3xl">Entry Requirements</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
              {program.entryRequirements.map((r) => (
                <li key={r} className="flex gap-2">
                  <span className="text-success">✓</span> {r}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal>
            <h2 className="text-2xl font-bold sm:text-3xl">Documents You&apos;ll Upload</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
              {program.requiredDocuments.map((r) => (
                <li key={r} className="flex gap-2">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-doc" aria-hidden="true" /> {r}
                </li>
              ))}
            </ul>
          </Reveal>

          {program.modules.length > 0 && (
            <Reveal>
              <h2 className="text-2xl font-bold sm:text-3xl">Modules</h2>
              <div className="mt-4 space-y-3">
                {program.modules.map((m) => (
                  <details key={m.year} className="group rounded-2xl border border-line bg-white">
                    <summary className="cursor-pointer list-none px-6 py-4 font-display text-sm font-bold marker:hidden [&::-webkit-details-marker]:hidden">
                      Year {m.year}
                    </summary>
                    <ul className="space-y-1.5 px-6 pb-5 text-sm text-ink-soft">
                      {m.courses.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </Reveal>
          )}

          {program.careerProspects.length > 0 && (
            <Reveal>
              <h2 className="text-2xl font-bold sm:text-3xl">Career Prospects</h2>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
                {program.careerProspects.map((c) => (
                  <li key={c} className="flex gap-2">
                    <span style={{ color: accent }}>✦</span> {c}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {program.scholarships.length > 0 && (
            <Reveal>
              <h2 className="text-2xl font-bold sm:text-3xl">Scholarships</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {program.scholarships.map((s) => (
                  <div key={s.name} className="rounded-2xl border border-line bg-white p-5">
                    <h3 className="font-display font-bold">{s.name}</h3>
                    {s.amount && (
                      <p className="mt-1 text-sm font-bold" style={{ color: accent }}>
                        {s.amount}
                      </p>
                    )}
                    {s.note && <p className="mt-1 text-sm text-ink-soft">{s.note}</p>}
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          <Reveal>
            <h2 className="text-2xl font-bold sm:text-3xl">Intake Dates &amp; Application Timeline</h2>
            {program.intakeMonths.length > 0 && (
              <p className="mt-3 text-sm text-ink-soft">
                Typical intake months: {program.intakeMonths.join(", ")}
              </p>
            )}
            {intakes.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2.5">
                {intakes.map((i) => (
                  <span key={i.id} className="rounded-full border border-line px-4 py-2 text-sm font-bold">
                    {i.month} {i.year}
                    {i.deadline && <span className="ml-1.5 font-normal text-ink-soft">· apply by {i.deadline}</span>}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-8">
              <ApplicationTimeline />
            </div>
          </Reveal>

          {program.faqs.length > 0 && (
            <div>
              <Reveal>
                <h2 className="text-2xl font-bold sm:text-3xl">FAQ</h2>
              </Reveal>
              <div className="mt-6">
                <FaqAccordion items={program.faqs} />
              </div>
            </div>
          )}

          {related.length > 0 && (
            <Reveal>
              <h2 className="text-2xl font-bold sm:text-3xl">More Programs at {university.name}</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                {related.map((p, i) => (
                  <ProgramCard
                    key={p.slug}
                    program={p}
                    countrySlug={country.slug}
                    universitySlug={university.slug}
                    accent={accent}
                    delay={i * 70}
                  />
                ))}
              </div>
            </Reveal>
          )}
        </div>

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <Reveal delay={100}>
            <div className="rounded-3xl border border-line bg-white p-7">
              <h2 className="font-display text-lg font-bold">At a Glance</h2>
              <dl className="mt-5 space-y-3.5 text-sm">
                <Row
                  label="Tuition / year"
                  value={program.tuitionPerYear ? formatMoney(program.tuitionPerYear, program.currency) : "On request"}
                />
                <Row
                  label="Duration"
                  value={
                    program.durationMonths ? (
                      <>
                        <StatCounter value={program.durationMonths} duration={800} /> months
                      </>
                    ) : (
                      "Varies"
                    )
                  }
                />
                <Row label="Degree type" value={program.degreeType || "—"} />
                {program.campus && <Row label="Campus" value={program.campus} />}
                <Row label="Min IELTS" value={program.minIelts != null ? String(program.minIelts) : "—"} />
              </dl>
              <a
                href={applyHref}
                className="btn-sheen mt-6 block rounded-full bg-study px-6 py-3.5 text-center font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-study-deep"
              >
                Apply Now →
              </a>
            </div>
          </Reveal>
        </aside>
      </div>
      <CTABand />
    </>
  );
}

function Badge({ children, accent }: { children: ReactNode; accent: string }) {
  return (
    <span
      className="rounded-full px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white"
      style={{ backgroundColor: accent }}
    >
      {children}
    </span>
  );
}

function CostCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 text-center">
      <p className="font-display text-lg font-extrabold">{value}</p>
      <p className="mt-1 text-xs font-semibold text-ink-mute">{label}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
      <dt className="font-semibold text-ink-soft">{label}</dt>
      <dd className="text-right font-bold">{value}</dd>
    </div>
  );
}
