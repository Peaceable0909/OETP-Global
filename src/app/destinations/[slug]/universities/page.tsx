import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDestinations, getDestination } from "@/lib/data/destinations";
import { getUniversitiesByCountry } from "@/lib/data/universities";
import { getPrograms } from "@/lib/data/programs";
import UniversityCard from "@/components/UniversityCard";
import Flag from "@/components/Flag";
import CTABand from "@/components/CTABand";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/structuredData";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const destinations = await getDestinations();
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = await getDestination(slug);
  if (!d) return {};
  return pageMetadata({
    title: `Top Universities in ${d.name} — Compare Programs & Fees`,
    description: `Partner universities and institutions in ${d.name}.`,
    path: `/destinations/${d.slug}/universities/`,
    image: d.photo,
  });
}

export default async function CountryUniversitiesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [d, universities, allPrograms] = await Promise.all([
    getDestination(slug),
    getUniversitiesByCountry(slug),
    getPrograms(),
  ]);
  if (!d) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Destinations", path: "/destinations/" },
          { name: d.name, path: `/destinations/${d.slug}/` },
          { name: "Universities", path: `/destinations/${d.slug}/universities/` },
        ])}
      />
      <section className="bg-white px-5 pt-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <nav className="text-sm font-semibold text-ink-soft">
            <Link href="/" className="hover:text-ink">Home</Link> /{" "}
            <Link href="/destinations/" className="hover:text-ink">Destinations</Link> /{" "}
            <Link href={`/destinations/${d.slug}/`} className="hover:text-ink">{d.name}</Link> /{" "}
            <span className="text-ink">Universities</span>
          </nav>
          <h1 className="mt-6 flex flex-wrap items-center gap-3 text-4xl font-extrabold sm:text-5xl">
            Universities in {d.name}
            <Flag code={d.code} color={d.accent} className="h-8 w-[3rem] rounded-lg" />
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">
            {universities.length} partner institution{universities.length === 1 ? "" : "s"} — pick one to see its
            programs, fees, and entry requirements.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        {universities.length === 0 ? (
          <p className="text-ink-soft">No universities listed for {d.name} yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {universities.map((u, i) => (
              <UniversityCard
                key={u.slug}
                university={u}
                countrySlug={d.slug}
                accent={d.accent}
                programCount={allPrograms.filter((p) => p.universitySlug === u.slug).length}
                delay={i * 70}
              />
            ))}
          </div>
        )}
      </section>
      <CTABand />
    </>
  );
}
