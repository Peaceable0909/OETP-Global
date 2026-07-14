import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import HotCakes from "@/components/home/HotCakes";
import AdvisorTeaser from "@/components/home/AdvisorTeaser";
import FeatureStrip from "@/components/home/FeatureStrip";
import DestinationsGrid from "@/components/home/DestinationsGrid";
import JourneyTimeline from "@/components/home/JourneyTimeline";
import AlbaniaSpotlight from "@/components/home/AlbaniaSpotlight";
import StoriesWall from "@/components/home/StoriesWall";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import FaqAccordion from "@/components/FaqAccordion";
import SectionHeading from "@/components/SectionHeading";
import DeparturesBoard from "@/components/home/DeparturesBoard";
import DarkStatsBand from "@/components/home/DarkStatsBand";
import Link from "next/link";
import { faqs, getContactLinks, getTestimonials } from "@/lib/data/site";
import { getDestinations } from "@/lib/data/destinations";

export default async function Home() {
  const [destinations, links, testimonials] = await Promise.all([
    getDestinations(),
    getContactLinks(),
    getTestimonials(),
  ]);
  return (
    <>
      <Hero destinations={destinations} whatsapp={links.whatsapp} />
      <StatsBar />
      <HotCakes destinations={destinations} />
      <DestinationsGrid destinations={destinations} />
      <JourneyTimeline />
      <StoriesWall testimonials={testimonials} />
      <WhyChooseUs />
      <AlbaniaSpotlight />
      <AdvisorTeaser destinations={destinations} />
      <FeatureStrip />
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <SectionHeading
          eyebrow="Questions"
          title="Answers Before You Ask"
          sub="The things every applicant wants to know — including exactly what's free and what's paid."
        />
        <div className="mt-12">
          <FaqAccordion items={faqs.slice(0, 5)} />
        </div>
        <p className="mt-8 text-center">
          <Link href="/faq/" className="font-bold text-study underline-offset-4 hover:underline">
            See all frequently asked questions →
          </Link>
        </p>
      </section>
      <DeparturesBoard />
      <DarkStatsBand />
    </>
  );
}
