import { cache } from "react";
import { universityImage } from "@/lib/imagePaths";
import { queryD1 } from "@/lib/data/d1";

export type University = {
  slug: string;
  countrySlug: string;
  name: string;
  city: string;
  tagline: string;
  description: string;
  heroPhoto: string;
  rankingNational: number | null;
  rankingWorld: number | null;
  foundedYear: number | null;
  studentPopulation: number | null;
  internationalStudentPct: number | null;
  campusType: string;
  gallery: string[];
  videoUrl: string;
  accreditations: string[];
  accommodationSummary: string;
  accommodationCostRange: string;
  studentLife: string[];
  faqs: { q: string; a: string }[];
  featured: boolean;
  status: string;
};

export type UniversityReview = {
  id: number;
  author: string;
  rating: number;
  body: string;
};

// Used when the Cloudflare D1 HTTP API isn't reachable at build time (local
// `next dev`/`next build` without credentials, or a PR preview build) so
// builds never hard-fail. Kept in sync with the D1 `universities` table by
// the one-time migration in scripts/migrate-universities-seed.sql — these
// are placeholder "Partner Institutions" entries seeded from each country's
// previously-embedded program list, not yet filled in with real campus
// details (no admin editor for Universities/Programs exists yet).
const FALLBACK_UNIVERSITIES: University[] = [
  { slug: "albania-partner-institutions", countrySlug: "albania", name: "Albania — Partner Institutions" },
  { slug: "cyprus-partner-institutions", countrySlug: "cyprus", name: "Cyprus — Partner Institutions" },
  { slug: "malaysia-partner-institutions", countrySlug: "malaysia", name: "Malaysia — Partner Institutions" },
  { slug: "cambodia-partner-institutions", countrySlug: "cambodia", name: "Cambodia — Partner Institutions" },
  { slug: "thailand-partner-institutions", countrySlug: "thailand", name: "Thailand — Partner Institutions" },
  { slug: "russia-partner-institutions", countrySlug: "russia", name: "Russia — Partner Institutions" },
].map((u) => ({
  ...u,
  city: "",
  tagline: "",
  description: "",
  heroPhoto: universityImage(u.slug),
  rankingNational: null,
  rankingWorld: null,
  foundedYear: null,
  studentPopulation: null,
  internationalStudentPct: null,
  campusType: "",
  gallery: [],
  videoUrl: "",
  accreditations: [],
  accommodationSummary: "",
  accommodationCostRange: "",
  studentLife: [],
  faqs: [],
  featured: false,
  status: "published",
}));

type UniversityRow = {
  slug: string;
  country_slug: string;
  name: string;
  city: string | null;
  tagline: string | null;
  description: string | null;
  hero_photo: string | null;
  ranking_national: number | null;
  ranking_world: number | null;
  founded_year: number | null;
  student_population: number | null;
  international_student_pct: number | null;
  campus_type: string | null;
  gallery: string;
  video_url: string | null;
  accreditations: string;
  accommodation_summary: string | null;
  accommodation_cost_range: string | null;
  student_life: string;
  faqs: string;
  featured: number;
  status: string;
};

function parseArray<T>(text: string): T[] {
  try {
    const v = JSON.parse(text);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function rowToUniversity(row: UniversityRow): University {
  return {
    slug: row.slug,
    countrySlug: row.country_slug,
    name: row.name,
    city: row.city ?? "",
    tagline: row.tagline ?? "",
    description: row.description ?? "",
    heroPhoto: row.hero_photo ?? universityImage(row.slug),
    rankingNational: row.ranking_national,
    rankingWorld: row.ranking_world,
    foundedYear: row.founded_year,
    studentPopulation: row.student_population,
    internationalStudentPct: row.international_student_pct,
    campusType: row.campus_type ?? "",
    gallery: parseArray(row.gallery),
    videoUrl: row.video_url ?? "",
    accreditations: parseArray(row.accreditations),
    accommodationSummary: row.accommodation_summary ?? "",
    accommodationCostRange: row.accommodation_cost_range ?? "",
    studentLife: parseArray(row.student_life),
    faqs: parseArray(row.faqs),
    featured: !!row.featured,
    status: row.status,
  };
}

export const getUniversities = cache(async (): Promise<University[]> => {
  const rows = await queryD1<UniversityRow>("SELECT * FROM universities WHERE status = 'published' ORDER BY name");
  const fromD1 = rows?.map(rowToUniversity);
  return fromD1 && fromD1.length > 0 ? fromD1 : FALLBACK_UNIVERSITIES;
});

export async function getUniversity(slug: string): Promise<University | undefined> {
  const all = await getUniversities();
  return all.find((u) => u.slug === slug);
}

export async function getUniversitiesByCountry(countrySlug: string): Promise<University[]> {
  const all = await getUniversities();
  return all.filter((u) => u.countrySlug === countrySlug);
}

export async function getFeaturedUniversities(countrySlug: string, limit = 4): Promise<University[]> {
  const byCountry = await getUniversitiesByCountry(countrySlug);
  const featured = byCountry.filter((u) => u.featured);
  return (featured.length > 0 ? featured : byCountry).slice(0, limit);
}

export async function getRelatedUniversities(countrySlug: string, excludeSlug: string, limit = 3): Promise<University[]> {
  const byCountry = await getUniversitiesByCountry(countrySlug);
  return byCountry.filter((u) => u.slug !== excludeSlug).slice(0, limit);
}

type ReviewRow = { id: number; university_slug: string; author: string; rating: number; body: string };

// No fallback here on purpose — there is no real review content to fall back
// to yet (the table is empty until students actually leave reviews), and
// showing fabricated reviews would be worse than showing none.
const getPublishedReviews = cache(async (): Promise<ReviewRow[]> => {
  const rows = await queryD1<ReviewRow>(
    "SELECT id, university_slug, author, rating, body FROM university_reviews WHERE status = 'published' ORDER BY created_at DESC"
  );
  return rows ?? [];
});

export async function getReviewsByUniversity(universitySlug: string): Promise<UniversityReview[]> {
  const all = await getPublishedReviews();
  return all.filter((r) => r.university_slug === universitySlug);
}
