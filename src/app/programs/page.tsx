import type { Metadata } from "next";
import SearchHub from "@/components/SearchHub";
import SectionHeading from "@/components/SectionHeading";
import CTABand from "@/components/CTABand";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Compare Study Abroad Programs by Country, Tuition & Intake",
  description: "Search every program across our destinations by subject, tuition, duration, intake, and more.",
  path: "/programs/",
});

export default function ProgramsPage() {
  return (
    <>
      <section className="bg-white px-5 pt-16 lg:px-8">
        <SectionHeading
          eyebrow="Search"
          title="Find the Program That Fits You"
          sub="Every program below is offered through a verified partner institution, with admission and visa processes we know inside-out. Search by subject or filter by what matters to you."
        />
      </section>
      <SearchHub />
      <CTABand />
    </>
  );
}
