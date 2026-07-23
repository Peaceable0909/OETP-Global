import type { Metadata } from "next";
import FaqAccordion from "@/components/FaqAccordion";
import SectionHeading from "@/components/SectionHeading";
import CTABand from "@/components/CTABand";
import JsonLd from "@/components/JsonLd";
import { faqPageSchema } from "@/lib/structuredData";
import { pageMetadata } from "@/lib/seo";
import { faqs, getContactLinks } from "@/lib/data/site";

export const metadata: Metadata = pageMetadata({
  title: "FAQ",
  description: "Answers about admissions, visas, tuition, work rights, documents and our service charges.",
  path: "/faq/",
});

export default async function FaqPage() {
  const { whatsapp } = await getContactLinks();
  return (
    <>
      <JsonLd data={faqPageSchema(faqs)} />
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
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="font-bold text-whatsapp underline-offset-4 hover:underline">
            Ask us on WhatsApp →
          </a>
        </p>
      </section>
      <CTABand />
    </>
  );
}
