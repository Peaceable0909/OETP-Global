import type { MetadataRoute } from "next";
import { site } from "@/lib/data/site";
import { getDestinations } from "@/lib/data/destinations";
import { getUniversities } from "@/lib/data/universities";
import { getPrograms } from "@/lib/data/programs";

// Required for `output: "export"` — sitemap.ts fetches from D1 at build time,
// so it must be pinned static the same way every other data-driven route is.
export const dynamic = "force-static";

const STATIC_PATHS: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/destinations/", priority: 0.9 },
  { path: "/programs/", priority: 0.9 },
  { path: "/apply/", priority: 0.8 },
  { path: "/about/", priority: 0.5 },
  { path: "/services/", priority: 0.5 },
  { path: "/faq/", priority: 0.5 },
  { path: "/jobs/", priority: 0.5 },
  { path: "/contact/", priority: 0.4 },
  { path: "/privacy/", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [destinations, universities, programs] = await Promise.all([
    getDestinations(),
    getUniversities(),
    getPrograms(),
  ]);
  const uMap = new Map(universities.map((u) => [u.slug, u]));
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map(({ path, priority }) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? ("daily" as const) : ("weekly" as const),
    priority,
  }));

  const destinationEntries: MetadataRoute.Sitemap = destinations.map((d) => ({
    url: `${site.url}/destinations/${d.slug}/`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const universitiesListEntries: MetadataRoute.Sitemap = destinations.map((d) => ({
    url: `${site.url}/destinations/${d.slug}/universities/`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const universityEntries: MetadataRoute.Sitemap = universities.map((u) => ({
    url: `${site.url}/destinations/${u.countrySlug}/universities/${u.slug}/`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const programEntries: MetadataRoute.Sitemap = programs
    .map((p) => {
      const u = uMap.get(p.universitySlug);
      if (!u) return null;
      return {
        url: `${site.url}/destinations/${u.countrySlug}/universities/${u.slug}/programs/${p.slug}/`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.85,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  return [
    ...staticEntries,
    ...destinationEntries,
    ...universitiesListEntries,
    ...universityEntries,
    ...programEntries,
  ];
}
