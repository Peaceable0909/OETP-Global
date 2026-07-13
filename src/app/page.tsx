import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import HotCakes from "@/components/home/HotCakes";
import AdvisorTeaser from "@/components/home/AdvisorTeaser";
import FeatureStrip from "@/components/home/FeatureStrip";
import DestinationsGrid from "@/components/home/DestinationsGrid";
import Journey from "@/components/home/Journey";
import AlbaniaSpotlight from "@/components/home/AlbaniaSpotlight";
import Testimonials from "@/components/home/Testimonials";
import FaqAccordion from "@/components/FaqAccordion";
import SectionHeading from "@/components/SectionHeading";
import CTABand from "@/components/CTABand";
import DarkStatsBand from "@/components/home/DarkStatsBand";
import Link from "next/link";
import { faqs } from "@/lib/data/site";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBar />
      <HotCakes />
      <AdvisorTeaser />
      <FeatureStrip />
      <DestinationsGrid />
      <Journey />
      <AlbaniaSpotlight />
      <Testimonials />
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <SectionHeading
          eyebrow="❓ Questions"
          title="Answers Before You Ask"
          sub="The things every applicant wants to know — including exactly what's free and what's paid."
        />
        <div className="mt-12">
          <FaqAccordion items={faqs.slice(0, 5)} />
        </div>
        <p className="mt-8 text-center">
          <Link href="/faq/" className="font-bold text-brand-700 underline-offset-4 hover:underline">
            See all frequently asked questions →
          </Link>
        </p>
      </section>
      <CTABand />
      <DarkStatsBand />
    </>
  );
}
