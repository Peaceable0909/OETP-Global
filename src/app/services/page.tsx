import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import CTABand from "@/components/CTABand";
import { services } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Our Services",
  description: "Admission processing, visa assistance, document review and more — with transparent pricing. Some services are free, others carry clear fees.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <SectionHeading
          eyebrow="🛠️ What We Do"
          title="End-to-End Support, Honestly Priced"
          sub="Everything you need from first question to first day abroad. Green means free, always. Paid services show exact fees before you commit — no surprises, ever."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 70} className="h-full">
              <div className="flex h-full flex-col rounded-3xl border border-brand-100 bg-white p-6 shadow-lg shadow-brand-600/8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand-600/15">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-100 text-2xl">{s.icon}</span>
                <h2 className="mt-4 font-display font-bold">{s.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{s.desc}</p>
                <span
                  className={`mt-4 inline-flex w-max items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider ${
                    s.free ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {s.free ? "✓ Free" : "💳 Paid — quoted upfront"}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14">
          <div className="mx-auto max-w-3xl rounded-3xl bg-brand-50 p-8 text-center">
            <h2 className="font-display text-xl font-bold">Our transparency promise</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Some agencies hide their fees until you&apos;re committed. We don&apos;t. Your free
              assessment tells you exactly which services you need, which are free, and what
              any paid service costs — in writing, before you pay a kobo.
            </p>
          </div>
        </Reveal>
      </section>
      <CTABand />
    </>
  );
}
