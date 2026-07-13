import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDestinations, getDestination } from "@/lib/data/destinations";
import Reveal from "@/components/Reveal";
import FaqAccordion from "@/components/FaqAccordion";
import CTABand from "@/components/CTABand";
import WaiverBanner from "@/components/WaiverBanner";
import Flag from "@/components/Flag";
import SmartImage from "@/components/SmartImage";
import { Icon, type IconName } from "@/lib/icons";
import { Briefcase, FileText } from "lucide-react";

export async function generateStaticParams() {
  const destinations = await getDestinations();
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = await getDestination(slug);
  if (!d) return {};
  return { title: `Study in ${d.name}`, description: d.summary };
}

const tabs = [
  { href: "#overview", label: "Overview" },
  { href: "#programs", label: "Programs" },
  { href: "#fees", label: "Fees & Living" },
  { href: "#visa", label: "Visa Process" },
  { href: "#requirements", label: "Requirements" },
  { href: "#faq", label: "FAQ" },
];

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = await getDestination(slug);
  if (!d) notFound();

  const glance: { icon: IconName; label: string; value: string }[] = [
    { icon: "map-pin", label: "Capital", value: d.capital },
    { icon: "languages", label: "Language", value: d.language },
    { icon: "coins", label: "Currency", value: d.currency },
    { icon: "calendar-days", label: "Intake Months", value: d.intakeMonths },
    { icon: "stamp", label: "Visa Processing", value: d.visaProcessing },
    { icon: "hourglass", label: "Program Duration", value: d.programLength },
  ];

  const feeCards: { icon: IconName; value: string; label: string }[] = [
    { icon: "graduation-cap", value: d.tuitionFrom, label: "Tuition from / year" },
    { icon: "stamp", value: d.visaProcessing, label: "Visa processing" },
    { icon: "briefcase", value: d.workRights.split("—")[0].trim(), label: "Work while studying" },
    { icon: "calendar-days", value: d.intakeMonths, label: "Intake months" },
  ];

  return (
    <>
      {/* Hero with photo */}
      <section className="relative overflow-hidden text-white">
        <SmartImage src={d.photo} alt={d.name} accent={d.accent} className="absolute inset-0 h-full w-full object-cover" />
        <div className={`absolute inset-0 bg-gradient-to-r ${d.heroGradient} opacity-40`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-12 lg:px-8">
          <nav className="text-sm font-semibold text-white/75">
            <Link href="/" className="hover:text-white">Home</Link> /{" "}
            <Link href="/destinations/" className="hover:text-white">Destinations</Link> /{" "}
            <span className="text-white">{d.name}</span>
          </nav>
          <p className="mt-8 font-display text-lg font-semibold italic text-white/85">Study in</p>
          <h1 className="flex flex-wrap items-center gap-4 text-5xl font-extrabold sm:text-6xl lg:text-7xl">
            {d.name}
            <Flag code={d.code} color={d.accent} className="h-9 min-w-[3.4rem] rounded-xl px-2 text-lg sm:h-11 sm:min-w-[4rem] sm:text-xl" />
          </h1>
          <p className="mt-3 font-display text-xl font-bold text-white/95 sm:text-2xl">{d.tagline}</p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">{d.summary}</p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            {d.highlights.slice(0, 5).map((h) => (
              <span key={h} className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur-sm">
                ✦ {h}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Fee waiver countdown banner (only renders when destination has a limited offer) */}
      <div className="mx-auto -mt-8 max-w-7xl px-5 lg:px-8">
        <div className="relative z-10">
          <WaiverBanner destination={d.slug} />
        </div>
      </div>

      {/* Tab-style anchor nav */}
      <nav className="sticky top-[60px] z-40 mt-8 border-b border-brand-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 lg:px-8">
          {tabs.map((t, i) => (
            <a
              key={t.href}
              href={t.href}
              className={`whitespace-nowrap border-b-2 px-4 py-3.5 text-sm font-bold transition-colors ${
                i === 0 ? "border-brand-600 text-brand-700" : "border-transparent text-ink-soft hover:text-brand-700"
              }`}
            >
              {t.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 lg:grid-cols-[1fr_20rem] lg:px-8">
        <div className="space-y-16">
          {/* Overview / Why choose */}
          <Reveal>
            <div id="overview" className="scroll-mt-36">
              <h2 className="text-2xl font-bold sm:text-3xl">Why Choose {d.name}?</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {d.highlights.map((h) => (
                  <div key={h} className="flex items-start gap-3 rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-700">◎</span>
                    <p className="text-sm font-semibold leading-relaxed">{h}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Fees strip */}
          <Reveal>
            <div id="fees" className="scroll-mt-36">
              <h2 className="text-2xl font-bold sm:text-3xl">Fees & Living</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {feeCards.map((f) => (
                  <div key={f.label} className="rounded-2xl border border-brand-100 bg-white p-5 text-center shadow-sm">
                    <span className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-brand-100 text-brand-700" aria-hidden>
                      <Icon name={f.icon} className="h-5 w-5" />
                    </span>
                    <p className="mt-2 font-display text-sm font-extrabold leading-tight">{f.value}</p>
                    <p className="mt-1 text-[11px] font-semibold text-ink-soft">{f.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Programs */}
          <Reveal>
            <div id="programs" className="scroll-mt-36">
              <h2 className="text-2xl font-bold sm:text-3xl">Available Programs</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {d.programs.map((p) => (
                  <div key={p.name} className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg hover:shadow-brand-600/10">
                    <h3 className="font-display font-bold">{p.name}</h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-brand-600">{p.length}</p>
                    <p className="mt-2 text-sm text-ink-soft">{p.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Specializations (photo grid, e.g. Albania culinary) */}
          {d.specializations && (
            <Reveal>
              <h2 className="text-2xl font-bold sm:text-3xl">Popular Culinary Specializations</h2>
              <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {d.specializations.map((s) => (
                  <figure key={s.name} className="group relative h-40 overflow-hidden rounded-2xl shadow-lg">
                    <SmartImage
                      src={s.photo}
                      alt={s.name}
                      accent={d.accent}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <figcaption className="absolute bottom-3 left-4 text-sm font-extrabold text-white drop-shadow">
                      {s.name}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </Reveal>
          )}

          {/* Visa steps */}
          <Reveal>
            <div id="visa" className="scroll-mt-36">
              <h2 className="text-2xl font-bold sm:text-3xl">Visa Process, Step by Step</h2>
              <ol className="mt-6 space-y-4">
                {d.visaSteps.map((s, i) => (
                  <li key={s.title} className="flex gap-4 rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 font-display font-extrabold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-display font-bold">{s.title}</h3>
                      <p className="mt-1 text-sm text-ink-soft">{s.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          {/* Requirements + documents */}
          <Reveal>
            <div id="requirements" className="scroll-mt-36 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl bg-brand-50 p-6">
                <h2 className="font-display text-lg font-bold">Admission Requirements</h2>
                <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
                  {d.requirements.map((r) => (
                    <li key={r} className="flex gap-2"><span className="text-brand-600">✓</span> {r}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-brand-50 p-6">
                <h2 className="font-display text-lg font-bold">Documents You&apos;ll Upload</h2>
                <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
                  {d.documents.map((r) => (
                    <li key={r} className="flex gap-2">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" /> {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          {/* FAQ */}
          <div id="faq" className="scroll-mt-36">
            <Reveal>
              <h2 className="text-2xl font-bold sm:text-3xl">Frequently Asked — {d.name}</h2>
            </Reveal>
            <div className="mt-6">
              <FaqAccordion items={d.faqs} />
            </div>
          </div>
        </div>

        {/* At a glance sidebar */}
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <Reveal delay={100}>
            <div className="rounded-3xl border border-brand-100 bg-white p-7 shadow-xl shadow-brand-600/10">
              <h2 className="font-display text-lg font-bold">At a Glance</h2>
              <dl className="mt-5 space-y-3.5">
                {glance.map((g) => (
                  <div key={g.label} className="flex items-baseline justify-between gap-4 border-b border-brand-50 pb-3 text-sm">
                    <dt className="inline-flex items-center gap-1.5 font-semibold text-ink-soft">
                      <Icon name={g.icon} className="h-4 w-4 text-brand-600" />
                      {g.label}
                    </dt>
                    <dd className="text-right font-bold">{g.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-semibold leading-relaxed text-emerald-800">
                <Briefcase className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {d.workRights}
              </p>
              <Link
                href={`/apply/?destination=${d.slug}`}
                className="mt-6 block rounded-full bg-gradient-to-r from-brand-600 to-brand-800 px-6 py-3.5 text-center font-bold text-white shadow-lg shadow-brand-600/25 transition-transform duration-300 hover:scale-[1.02]"
              >
                Apply Now →
              </Link>
            </div>
          </Reveal>
        </aside>
      </div>

      <CTABand />
    </>
  );
}
