import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDestination } from "@/lib/data/destinations";
import { getUniversities, getUniversity, getRelatedUniversities, getReviewsByUniversity } from "@/lib/data/universities";
import { getPrograms, getProgramsByUniversity } from "@/lib/data/programs";
import Reveal from "@/components/Reveal";
import SmartImage from "@/components/SmartImage";
import Flag from "@/components/Flag";
import UniversityCard from "@/components/UniversityCard";
import ProgramsCompare from "@/components/ProgramsCompare";
import Gallery from "@/components/Gallery";
import VideoGrid from "@/components/VideoGrid";
import ReviewsSection from "@/components/ReviewsSection";
import FaqAccordion from "@/components/FaqAccordion";
import RankingBadge from "@/components/RankingBadge";
import CTABand from "@/components/CTABand";

export async function generateStaticParams() {
  const universities = await getUniversities();
  return universities.map((u) => ({ slug: u.countrySlug, uslug: u.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ uslug: string }> }): Promise<Metadata> {
  const { uslug } = await params;
  const u = await getUniversity(uslug);
  if (!u) return {};
  return { title: u.name, description: u.tagline || u.description || `Programs, fees, and requirements at ${u.name}.` };
}

const tabs = [
  { href: "#about", label: "About" },
  { href: "#overview", label: "Overview" },
  { href: "#programs", label: "Programs" },
  { href: "#campus", label: "Campus & Life" },
  { href: "#videos", label: "Videos" },
  { href: "#fees", label: "Fees & Scholarships" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
];

export default async function UniversityPage({ params }: { params: Promise<{ slug: string; uslug: string }> }) {
  const { slug, uslug } = await params;
  const [country, university] = await Promise.all([getDestination(slug), getUniversity(uslug)]);
  if (!country || !university || university.countrySlug !== country.slug) notFound();

  const [programs, allPrograms, related, reviews] = await Promise.all([
    getProgramsByUniversity(university.slug),
    getPrograms(),
    getRelatedUniversities(country.slug, university.slug),
    getReviewsByUniversity(university.slug),
  ]);

  const accent = country.accent;
  const tuitionValues = programs.map((p) => p.tuitionPerYear).filter((v): v is number => v != null);

  return (
    <>
      <section className="relative overflow-hidden text-white">
        <SmartImage
          src={university.heroPhoto}
          alt={university.name}
          accent={accent}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-12 lg:px-8">
          <nav className="text-sm font-semibold text-white/75">
            <Link href="/" className="hover:text-white">Home</Link> /{" "}
            <Link href="/destinations/" className="hover:text-white">Destinations</Link> /{" "}
            <Link href={`/destinations/${country.slug}/`} className="hover:text-white">{country.name}</Link> /{" "}
            <Link href={`/destinations/${country.slug}/universities/`} className="hover:text-white">Universities</Link> /{" "}
            <span className="text-white">{university.name}</span>
          </nav>
          <h1 className="mt-6 flex flex-wrap items-center gap-3 text-4xl font-extrabold sm:text-5xl">
            {university.name}
            <Flag code={country.code} color={accent} className="h-8 w-[3rem] rounded-lg" />
          </h1>
          {university.city && (
            <p className="mt-2 text-lg font-semibold text-white/90">
              {university.city}, {country.name}
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <RankingBadge national={university.rankingNational} world={university.rankingWorld} accent={accent} />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/45 px-4 py-2 text-xs font-bold">
              {programs.length} program{programs.length === 1 ? "" : "s"} available
            </span>
          </div>
        </div>
      </section>

      <nav className="sticky top-[60px] z-40 border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 lg:px-8">
          {tabs.map((t, i) => (
            <a
              key={t.href}
              href={t.href}
              className={`whitespace-nowrap border-b-2 px-4 py-3.5 text-sm font-bold transition-colors ${
                i === 0 ? "" : "border-transparent text-ink-soft hover:text-ink"
              }`}
              style={i === 0 ? { borderColor: accent, color: accent } : undefined}
            >
              {t.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="space-y-16">
          {(university.description || university.keyPoints.length > 0) && (
            <Reveal>
              <div id="about" className="scroll-mt-36">
                <h2 className="text-2xl font-bold sm:text-3xl">About {university.name}</h2>
                {university.description && (
                  <p className="mt-4 max-w-2xl whitespace-pre-line text-ink-soft">{university.description}</p>
                )}
                {university.keyPoints.length > 0 && (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {university.keyPoints.map((k) => (
                      <div key={k} className="flex items-start gap-3 rounded-2xl border border-line bg-white p-5">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface" style={{ color: accent }}>
                          ✓
                        </span>
                        <p className="text-sm font-semibold leading-relaxed">{k}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          )}

          <Reveal>
            <div id="overview" className="scroll-mt-36">
              <h2 className="text-2xl font-bold sm:text-3xl">Overview</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {university.foundedYear && <StatCell label="Founded" value={String(university.foundedYear)} />}
                {university.studentPopulation && (
                  <StatCell label="Students" value={university.studentPopulation.toLocaleString()} />
                )}
                {university.internationalStudentPct != null && (
                  <StatCell label="International Students" value={`${university.internationalStudentPct}%`} />
                )}
                {university.campusType && <StatCell label="Campus" value={university.campusType} />}
              </div>
              {university.accreditations.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {university.accreditations.map((a) => (
                    <span key={a} className="rounded-full border border-line px-3 py-1.5 text-xs font-bold text-ink-soft">
                      {a}
                    </span>
                  ))}
                </div>
              )}
              {university.gallery.length > 0 && (
                <div className="mt-8">
                  <Gallery photos={university.gallery} alt={university.name} accent={accent} />
                </div>
              )}
            </div>
          </Reveal>

          {university.studentLife.length > 0 && (
            <Reveal>
              <div id="campus" className="scroll-mt-36">
                <h2 className="text-2xl font-bold sm:text-3xl">Campus &amp; Student Life</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {university.studentLife.map((s) => (
                    <div key={s} className="flex items-start gap-3 rounded-2xl border border-line bg-white p-5">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface" style={{ color: accent }}>
                        ◎
                      </span>
                      <p className="text-sm font-semibold leading-relaxed">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {university.videos.length > 0 && (
            <Reveal>
              <div id="videos" className="scroll-mt-36">
                <h2 className="text-2xl font-bold sm:text-3xl">Videos</h2>
                <div className="mt-6">
                  <VideoGrid videos={university.videos} accent={accent} />
                </div>
              </div>
            </Reveal>
          )}

          <Reveal>
            <div id="programs" className="scroll-mt-36">
              <h2 className="text-2xl font-bold sm:text-3xl">Programs</h2>
              {programs.length === 0 ? (
                <p className="mt-4 text-ink-soft">No programs listed yet.</p>
              ) : (
                <div className="mt-6">
                  <ProgramsCompare
                    programs={programs}
                    countrySlug={country.slug}
                    universitySlug={university.slug}
                    accent={accent}
                  />
                </div>
              )}
            </div>
          </Reveal>

          <Reveal>
            <div id="fees" className="scroll-mt-36 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-surface p-6">
                <h2 className="font-display text-lg font-bold">Fees</h2>
                <p className="mt-3 text-sm text-ink-soft">
                  {tuitionValues.length > 0
                    ? `Tuition ranges from ${Math.min(...tuitionValues).toLocaleString()} to ${Math.max(...tuitionValues).toLocaleString()} per year across programs.`
                    : "Tuition varies by program — see each program page for details."}
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-surface p-6">
                <h2 className="font-display text-lg font-bold">Accommodation</h2>
                <p className="mt-3 text-sm text-ink-soft">
                  {university.accommodationSummary || "Accommodation guidance provided during your application."}
                  {university.accommodationCostRange && ` (${university.accommodationCostRange})`}
                </p>
              </div>
            </div>
          </Reveal>

          <div id="reviews" className="scroll-mt-36">
            <Reveal>
              <h2 className="text-2xl font-bold sm:text-3xl">Student Reviews</h2>
            </Reveal>
            <div className="mt-6">
              <ReviewsSection reviews={reviews} accent={accent} />
            </div>
          </div>

          {university.faqs.length > 0 && (
            <div id="faq" className="scroll-mt-36">
              <Reveal>
                <h2 className="text-2xl font-bold sm:text-3xl">FAQ</h2>
              </Reveal>
              <div className="mt-6">
                <FaqAccordion items={university.faqs} />
              </div>
            </div>
          )}

          {related.length > 0 && (
            <Reveal>
              <h2 className="text-2xl font-bold sm:text-3xl">Related Universities in {country.name}</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                {related.map((u, i) => (
                  <UniversityCard
                    key={u.slug}
                    university={u}
                    countrySlug={country.slug}
                    accent={accent}
                    programCount={allPrograms.filter((p) => p.universitySlug === u.slug).length}
                    delay={i * 70}
                  />
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </div>
      <CTABand />
    </>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 text-center">
      <p className="font-display text-lg font-extrabold">{value}</p>
      <p className="mt-1 text-xs font-semibold text-ink-mute">{label}</p>
    </div>
  );
}
