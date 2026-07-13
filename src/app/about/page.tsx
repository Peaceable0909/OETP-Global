import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import StatsBar from "@/components/home/StatsBar";
import CTABand from "@/components/CTABand";
import { site } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `Who ${site.name} is: our mission, our approach, and why students trust us.`,
};

const values = [
  { icon: "🔍", title: "Radical transparency", desc: "Free means free. Paid services are quoted in writing before you commit. No hidden charges at any stage." },
  { icon: "🎯", title: "Only routes that work", desc: "We market destinations where admissions and visa processes are genuinely straightforward — not wherever pays the highest commission." },
  { icon: "🤝", title: "End-to-end, for real", desc: "From your first question to your first week abroad: assessment, admission, visa, pre-departure, arrival." },
  { icon: "🛡️", title: "Guaranteed job offers", desc: "Work opportunities we list are confirmed and genuine, backed by a reasonable money-back guarantee." },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand-50 to-white px-5 pt-16 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold sm:text-5xl">
          We Open Doors That
          <span className="bg-gradient-to-r from-brand-600 to-fuchsia-500 bg-clip-text text-transparent"> Actually Open</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
          {site.name} is an international education and career consultancy. We market
          study, vocational and verified work opportunities in destinations where admission
          and visa processes are genuinely straightforward — and instead of simply referring
          you, we guide you end-to-end: from choosing a destination through documents, visa
          and pre-departure, until you arrive.
        </p>
        <p className="mx-auto mt-4 max-w-2xl rounded-2xl bg-brand-50 px-6 py-4 text-base font-semibold italic text-brand-800">
          &ldquo;Studying or working abroad doesn&apos;t have to be confusing. We&apos;ve already
          identified genuine opportunities, we know the process, and we&apos;ll guide you every
          step of the way.&rdquo;
        </p>
      </section>

      <section className="mx-auto mt-16 grid max-w-5xl gap-6 px-5 md:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-3xl bg-gradient-to-br from-brand-700 to-brand-900 p-8 text-white shadow-2xl shadow-brand-600/25">
            <span className="text-3xl" aria-hidden>🎯</span>
            <h2 className="mt-3 font-display text-xl font-extrabold">Our Mission</h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-100">{site.mission}</p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="h-full rounded-3xl border border-brand-100 bg-white p-8 shadow-xl shadow-brand-600/10">
            <span className="text-3xl" aria-hidden>🔭</span>
            <h2 className="mt-3 font-display text-xl font-extrabold">Our Vision</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{site.vision}</p>
          </div>
        </Reveal>
      </section>

      <div className="pt-20">
        <StatsBar />
      </div>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <SectionHeading
          eyebrow="💜 Our Values"
          title="Why Students Choose Us"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 80}>
              <div className="flex gap-5 rounded-3xl border border-brand-100 bg-white p-7 shadow-lg shadow-brand-600/8">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-100 text-2xl">{v.icon}</span>
                <div>
                  <h2 className="font-display text-lg font-bold">{v.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{v.desc}</p>
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
