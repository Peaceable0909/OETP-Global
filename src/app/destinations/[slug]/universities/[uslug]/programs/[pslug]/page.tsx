import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDestination } from "@/lib/data/destinations";
import { getUniversities, getUniversity } from "@/lib/data/universities";
import { getPrograms, getProgram, getRelatedPrograms, getIntakesByProgram, type FeeBreakdownRow } from "@/lib/data/programs";
import Reveal from "@/components/Reveal";
import SmartImage from "@/components/SmartImage";
import ProgramCard from "@/components/ProgramCard";
import { formatMoney } from "@/lib/currency";
import FaqAccordion from "@/components/FaqAccordion";
import ApplicationTimeline from "@/components/ApplicationTimeline";
import CTABand from "@/components/CTABand";
import StatCounter from "@/components/StatCounter";
import JsonLd from "@/components/JsonLd";
import TiltCard from "@/components/TiltCard";
import Accordion from "@/components/Accordion";
import SectionNav, { type NavSection } from "@/components/SectionNav";
import { breadcrumbSchema, courseSchema, faqPageSchema } from "@/lib/structuredData";
import { pageMetadata } from "@/lib/seo";
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
  const university = await getUniversity(p.universitySlug);
  const country = university ? await getDestination(university.countrySlug) : undefined;
  const context = university && country ? ` at ${university.name}, ${country.name}` : "";
  return pageMetadata({
    title: `${p.name}${context} — Fees & How to Apply`,
    description: p.overview || `${p.name}${context} — tuition, requirements, and how to apply.`,
    path: university && country ? `/destinations/${country.slug}/universities/${university.slug}/programs/${p.slug}/` : `/programs/`,
    image: p.photo,
  });
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

  const programPath = `/destinations/${country.slug}/universities/${university.slug}/programs/${program.slug}/`;
  const universityPath = `/destinations/${country.slug}/universities/${university.slug}/`;

  const sections: NavSection[] = [
    { id: "overview", label: "Overview" },
    { id: "costs", label: "Costs" },
    ...(program.feeBreakdown.length > 0 ? [{ id: "fees", label: "Fees Breakdown" }] : []),
    { id: "requirements", label: "Requirements" },
    { id: "documents", label: "Documents" },
    ...(program.modules.length > 0 ? [{ id: "modules", label: "Modules" }] : []),
    ...(program.careerProspects.length > 0 ? [{ id: "career", label: "Careers" }] : []),
    ...(program.scholarships.length > 0 ? [{ id: "scholarships", label: "Scholarships" }] : []),
    { id: "intake", label: "Intake & Timeline" },
    ...(program.faqs.length > 0 ? [{ id: "faq", label: "FAQ" }] : []),
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Destinations", path: "/destinations/" },
            { name: country.name, path: `/destinations/${country.slug}/` },
            { name: university.name, path: universityPath },
            { name: program.name, path: programPath },
          ]),
          courseSchema({
            name: program.name,
            path: programPath,
            description: program.overview || undefined,
            universityName: university.name,
            universityPath,
            degreeType: program.degreeType || undefined,
          }),
          ...(program.faqs.length > 0 ? [faqPageSchema(program.faqs)] : []),
        ]}
      />
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
          <div className="mt-5 flex flex-wrap gap-2.5">
            {program.degreeType && (
              <Badge accent={accent} delay={230}>
                {program.degreeType}
              </Badge>
            )}
            {program.fieldOfStudy && (
              <Badge accent={accent} delay={290}>
                {program.fieldOfStudy}
              </Badge>
            )}
            {program.campus && (
              <Badge accent={accent} delay={350}>
                {program.campus}
              </Badge>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 lg:grid-cols-[1fr_20rem] lg:px-8">
        <div className="space-y-14">
          {/* A sticky element can never hold position past its own parent's
              height — this needs to live inside the tall content column
              (not a slim dedicated wrapper) to have room to stick through
              the whole scroll. */}
          <SectionNav sections={sections} accent={accent} variant="mobile" />

          <section id="overview" className="scroll-mt-28">
            <Reveal>
              <h2 className="text-2xl font-bold sm:text-3xl">Overview</h2>
              <p className="mt-4 max-w-2xl text-ink-soft">
                {program.overview || "Details coming soon — contact us for the latest information on this program."}
              </p>
            </Reveal>
          </section>

          <section id="costs" className="scroll-mt-28">
            <Reveal>
              <h2 className="text-2xl font-bold sm:text-3xl">Costs</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <CostCell
                  label="Tuition / year"
                  amount={program.tuitionPerYear}
                  currency={program.currency}
                  delay={0}
                />
                <CostCell
                  label="Application fee"
                  amount={program.applicationFee}
                  currency={program.currency}
                  delay={80}
                />
                <CostCell label="Deposit" amount={program.deposit} currency={program.currency} delay={160} />
              </div>
              {program.feeBreakdown.length > 0 && (
                <p className="mt-3 text-xs text-ink-soft">
                  {university.name} bills in {program.feeBreakdown[0].currency} — the figures above are a rounded USD
                  reference for comparing programs. See the exact year-by-year schedule below.
                </p>
              )}
            </Reveal>
          </section>

          {program.feeBreakdown.length > 0 && (
            <section id="fees" className="scroll-mt-28">
              <Reveal>
                <h2 className="text-2xl font-bold sm:text-3xl">Tuition & Fees — Year by Year</h2>
                <p className="mt-3 max-w-2xl text-sm text-ink-soft">
                  {university.name}&apos;s literal billing schedule, split out by registration, management, and tuition
                  fees for each year of study.
                </p>
                <div className="mt-6 space-y-4">
                  {groupFeeBreakdown(program.feeBreakdown).map(([level, rows]) => (
                    <Accordion key={level} title={level} defaultOpen>
                      <div className="-mx-6 overflow-x-auto px-6">
                        <table className="w-full min-w-[480px] text-left text-sm">
                          <thead>
                            <tr className="text-xs uppercase tracking-wide text-ink-mute">
                              <th className="py-2 pr-3 font-semibold">Year</th>
                              <th className="py-2 pr-3 font-semibold">Registration</th>
                              <th className="py-2 pr-3 font-semibold">Management</th>
                              <th className="py-2 pr-3 font-semibold">Tuition</th>
                              <th className="py-2 font-semibold">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((r) => (
                              <tr key={r.label} className="border-t border-line">
                                <td className="py-2.5 pr-3 font-semibold">{r.year}</td>
                                <td className="py-2.5 pr-3 text-ink-soft">{formatMoney(r.registrationFee, r.currency)}</td>
                                <td className="py-2.5 pr-3 text-ink-soft">{formatMoney(r.managementFee, r.currency)}</td>
                                <td className="py-2.5 pr-3 text-ink-soft">{formatMoney(r.tuitionFee, r.currency)}</td>
                                <td className="py-2.5 font-bold">{formatMoney(r.total, r.currency)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Accordion>
                  ))}
                </div>
              </Reveal>
            </section>
          )}

          <section id="requirements" className="scroll-mt-28">
            <Reveal>
              <h2 className="text-2xl font-bold sm:text-3xl">Entry Requirements</h2>
            </Reveal>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
              {program.entryRequirements.map((r, i) => (
                <Reveal key={r} delay={i * 60} x={-16} y={0}>
                  <li className="flex gap-2">
                    <span className="text-success">✓</span> {r}
                  </li>
                </Reveal>
              ))}
            </ul>
          </section>

          <section id="documents" className="scroll-mt-28">
            <Reveal>
              <h2 className="text-2xl font-bold sm:text-3xl">Documents You&apos;ll Upload</h2>
            </Reveal>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
              {program.requiredDocuments.map((r, i) => (
                <Reveal key={r} delay={i * 60} x={16} y={0}>
                  <li className="flex gap-2">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-doc" aria-hidden="true" /> {r}
                  </li>
                </Reveal>
              ))}
            </ul>
          </section>

          {program.modules.length > 0 && (
            <section id="modules" className="scroll-mt-28">
              <Reveal>
                <h2 className="text-2xl font-bold sm:text-3xl">Modules</h2>
                <div className="mt-4 space-y-3">
                  {program.modules.map((m) => (
                    <Accordion key={m.year} title={`Year ${m.year}`}>
                      <ul className="space-y-1.5 text-sm text-ink-soft">
                        {m.courses.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </Accordion>
                  ))}
                </div>
              </Reveal>
            </section>
          )}

          {program.careerProspects.length > 0 && (
            <section id="career" className="scroll-mt-28">
              <Reveal>
                <h2 className="text-2xl font-bold sm:text-3xl">Career Prospects</h2>
              </Reveal>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
                {program.careerProspects.map((c, i) => (
                  <Reveal key={c} delay={i * 60} x={-16} y={0}>
                    <li className="flex gap-2">
                      <span style={{ color: accent }}>✦</span> {c}
                    </li>
                  </Reveal>
                ))}
              </ul>
            </section>
          )}

          {program.scholarships.length > 0 && (
            <section id="scholarships" className="scroll-mt-28">
              <Reveal>
                <h2 className="text-2xl font-bold sm:text-3xl">Scholarships</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {program.scholarships.map((s, i) => (
                    <Reveal key={s.name} delay={i * 90}>
                      <TiltCard maxTilt={5}>
                        <div className="h-full rounded-2xl border border-line bg-white p-5 transition-shadow duration-300 hover:shadow-lg">
                          <h3 className="font-display font-bold">{s.name}</h3>
                          {s.amount && (
                            <p className="mt-1 text-sm font-bold" style={{ color: accent }}>
                              {s.amount}
                            </p>
                          )}
                          {s.note && <p className="mt-1 text-sm text-ink-soft">{s.note}</p>}
                        </div>
                      </TiltCard>
                    </Reveal>
                  ))}
                </div>
              </Reveal>
            </section>
          )}

          <section id="intake" className="scroll-mt-28">
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
          </section>

          {program.faqs.length > 0 && (
            <section id="faq" className="scroll-mt-28">
              <Reveal>
                <h2 className="text-2xl font-bold sm:text-3xl">FAQ</h2>
              </Reveal>
              <div className="mt-6">
                <FaqAccordion items={program.faqs} />
              </div>
            </section>
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

        <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
          <SectionNav sections={sections} accent={accent} variant="desktop" />
          <Reveal delay={100}>
            <TiltCard maxTilt={4}>
              <div className="rounded-3xl border border-line bg-white p-7">
                <h2 className="font-display text-lg font-bold">At a Glance</h2>
                <dl className="mt-5 space-y-3.5 text-sm">
                  <Row
                    label="Tuition / year"
                    value={
                      program.tuitionPerYear ? (
                        <StatCounter
                          value={program.tuitionPerYear}
                          duration={900}
                          format={(n) => formatMoney(n, program.currency)}
                        />
                      ) : (
                        "On request"
                      )
                    }
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
            </TiltCard>
          </Reveal>
        </aside>
      </div>
      <CTABand />
    </>
  );
}

function Badge({ children, accent, delay = 0 }: { children: ReactNode; accent: string; delay?: number }) {
  return (
    <span
      className="animate-hero-rise rounded-full px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white"
      style={{ backgroundColor: accent, animationDelay: `${delay}ms` }}
    >
      {children}
    </span>
  );
}

function CostCell({
  label,
  amount,
  currency,
  delay = 0,
}: {
  label: string;
  amount: number | null;
  currency: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} y={16}>
      <div className="rounded-2xl border border-line bg-white p-5 text-center transition-shadow duration-300 hover:shadow-md">
        <p className="font-display text-lg font-extrabold">
          {amount ? <StatCounter value={amount} duration={900} format={(n) => formatMoney(n, currency)} /> : "On request"}
        </p>
        <p className="mt-1 text-xs font-semibold text-ink-mute">{label}</p>
      </div>
    </Reveal>
  );
}

// Fee rows are stored flat with labels like "Bachelor · Year 1" — group them
// back into one table per degree level for display.
function groupFeeBreakdown(rows: FeeBreakdownRow[]): [string, (FeeBreakdownRow & { year: string })[]][] {
  const map = new Map<string, (FeeBreakdownRow & { year: string })[]>();
  for (const r of rows) {
    const [level, year] = r.label.split("·").map((s) => s.trim());
    const list = map.get(level) ?? [];
    list.push({ ...r, year: year || r.label });
    map.set(level, list);
  }
  return Array.from(map.entries());
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
      <dt className="font-semibold text-ink-soft">{label}</dt>
      <dd className="text-right font-bold">{value}</dd>
    </div>
  );
}
