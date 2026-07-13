import type { Metadata } from "next";
import FaqAccordion from "@/components/FaqAccordion";
import SectionHeading from "@/components/SectionHeading";
import CTABand from "@/components/CTABand";
import { faqs, site } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about admissions, visas, tuition, work rights, documents and our service charges.",
};

export default function FaqPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Everything, Answered"
          sub="If it's not here, message us — a real counselor replies, not a bot wall."
        />
        <div className="mt-12">
          <FaqAccordion items={faqs} />
        </div>
        <p className="mt-10 text-center text-sm font-semibold text-ink-soft">
          Still curious?{" "}
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-700 underline-offset-4 hover:underline">
            Ask us on WhatsApp →
          </a>
        </p>
      </section>
      <CTABand />
    </>
  );
}
