import type { Metadata } from "next";
import SearchHub from "@/components/SearchHub";
import SectionHeading from "@/components/SectionHeading";
import CTABand from "@/components/CTABand";
import { pageMetadata } from "@/lib/seo";
import { getSearchResultPrograms } from "@/lib/data/searchIndex";

export const metadata: Metadata = pageMetadata({
  title: "Compare Study Abroad Programs by Country, Tuition & Intake",
  description: "Search every program across our destinations by subject, tuition, duration, intake, and more.",
  path: "/programs/",
});

export default async function ProgramsPage() {
  const allResults = await getSearchResultPrograms();
  return (
    <>
      <section className="bg-white px-5 pt-16 lg:px-8">
        <SectionHeading
          eyebrow="Search"
          title="Find the Program That Fits You"
          sub="Every program below is offered through a verified partner institution, with admission and visa processes we know inside-out. Search by subject or filter by what matters to you."
        />
      </section>
      <SearchHub initialResults={allResults.slice(0, 12)} initialTotal={allResults.length} />
      <CTABand />
    </>
  );
}
