import { getPrograms } from "@/lib/data/programs";
import { getUniversities } from "@/lib/data/universities";
import { getDestinations } from "@/lib/data/destinations";
import type { SearchResultProgram } from "@/lib/search";

// Build-time equivalent of functions/api/programs/search.ts's default
// (unfiltered) query, joining the same three build-time data sources
// generateStaticParams already uses. Lets /programs/ render real program
// listings in its static HTML instead of staying empty until SearchHub's
// client-side fetch resolves — a crawler never runs that fetch.
export async function getSearchResultPrograms(): Promise<SearchResultProgram[]> {
  const [programs, universities, destinations] = await Promise.all([
    getPrograms(),
    getUniversities(),
    getDestinations(),
  ]);
  const uMap = new Map(universities.map((u) => [u.slug, u]));
  const dMap = new Map(destinations.map((d) => [d.slug, d]));

  return programs
    .map((p): SearchResultProgram | null => {
      const u = uMap.get(p.universitySlug);
      const d = u ? dMap.get(u.countrySlug) : undefined;
      if (!u || !d) return null;
      return {
        ...p,
        universityName: u.name,
        countrySlug: d.slug,
        countryName: d.name,
        countryCode: d.code,
        countryAccent: d.accent,
      };
    })
    .filter((r): r is SearchResultProgram => r !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
}
