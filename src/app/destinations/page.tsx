import type { Metadata } from "next";
import DestinationsGrid from "@/components/home/DestinationsGrid";
import CTABand from "@/components/CTABand";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/structuredData";
import { pageMetadata } from "@/lib/seo";
import { getDestinations } from "@/lib/data/destinations";

export const metadata: Metadata = pageMetadata({
  title: "Study Abroad Destinations — Thailand, Cyprus, Malaysia, Cambodia, Albania & Russia",
  description: "Explore study and work destinations with straightforward admissions and visa processes: Cyprus, Albania, Malaysia, Cambodia, Thailand, Russia.",
  path: "/destinations/",
});

export default async function DestinationsPage() {
  const destinations = await getDestinations();
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Destinations", path: "/destinations/" }])} />
      <section className="bg-white px-5 pt-16 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold sm:text-5xl">
          Six Doors to Your
          <span className="text-study"> Future</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
          Every destination below was chosen for one reason: the admission and visa process
          actually works. Pick one — or let us match you.
        </p>
      </section>
      <DestinationsGrid destinations={destinations} />
      <CTABand />
    </>
  );
}
