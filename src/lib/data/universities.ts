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
  rankings: { label: string; value: number }[];
  foundedYear: number | null;
  studentPopulation: number | null;
  internationalStudentPct: number | null;
  campusType: string;
  gallery: string[];
  keyPoints: string[];
  videos: { title: string; url: string }[];
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
const BASE_FALLBACK_UNIVERSITIES = [
  { slug: "albania-partner-institutions", countrySlug: "albania", name: "Western Balkans University (WBU)" },
  { slug: "cyprus-partner-institutions", countrySlug: "cyprus", name: "Cyprus — Partner Institutions" },
  { slug: "malaysia-partner-institutions", countrySlug: "malaysia", name: "Malaysia — Partner Institutions" },
  { slug: "cambodia-partner-institutions", countrySlug: "cambodia", name: "Cambodia — Partner Institutions" },
  { slug: "russia-partner-institutions", countrySlug: "russia", name: "Russia — Partner Institutions" },
].map((u) => ({
  ...u,
  city: "",
  tagline: "",
  description: "",
  heroPhoto: universityImage(u.slug),
  rankings: [],
  foundedYear: null,
  studentPopulation: null,
  internationalStudentPct: null,
  campusType: "",
  gallery: [],
  keyPoints: [],
  videos: [],
  accreditations: [],
  accommodationSummary: "",
  accommodationCostRange: "",
  studentLife: [],
  faqs: [],
  featured: false,
  status: "published",
}));

const SHINAWATRA_UNI: University = {
  slug: "shinawatra-university",
  countrySlug: "thailand",
  name: "Shinawatra University",
  city: "Pathum Thani, Bangkok",
  tagline: "International English-Taught Degree Programs & Modern Green Campus",
  description: "Shinawatra University (SIU) is a premier international university in Thailand established in 1999. Located in Pathum Thani near Bangkok, SIU features an eco-conscious green campus, high-tech facilities, and fully English-taught programs across Management, Business Administration, Psychology, and Technology.",
  heroPhoto: "/images/universities/shinawatra-university/hero.jpg",
  rankings: [
    { label: "Thailand Private Universities", value: 15 },
    { label: "ASEAN Green Campus", value: 8 },
  ],
  foundedYear: 1999,
  studentPopulation: 3500,
  internationalStudentPct: 42,
  campusType: "Eco-Friendly Suburban Campus",
  gallery: [
    "/images/universities/shinawatra-university/gallery-1.jpg",
    "/images/universities/shinawatra-university/gallery-2.jpg",
    "/images/universities/shinawatra-university/gallery-3.jpg",
  ],
  keyPoints: [
    "Fully English-taught undergraduate and graduate degrees",
    "High international student population (over 40%)",
    "State-of-the-art green campus with modern student dormitories",
    "Industry-aligned curricula with internship placements in Bangkok",
  ],
  videos: [
    { title: "Shinawatra University Campus Tour & Overview", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { title: "International Student Life at SIU Thailand", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  ],
  accreditations: [
    "Ministry of Higher Education, Science, Research and Innovation (MHESI)",
    "Office of the Higher Education Commission (OHEC) Thailand",
  ],
  accommodationSummary: "Modern on-campus dormitories with air conditioning, private bathrooms, high-speed Wi-Fi, and 24/7 security.",
  accommodationCostRange: "฿4,000 – ฿8,000 / month",
  studentLife: [
    "International Cultural Exchange Clubs",
    "Sports Facilities & Swimming Pool",
    "Student Activity Center & Cafeteria",
    "Bangkok Weekend Shuttle Service",
  ],
  faqs: [
    { q: "Are all programs taught in English?", a: "Yes, all international programs at Shinawatra University are 100% taught in English by international faculty." },
    { q: "Is on-campus accommodation provided?", a: "Yes, SIU has modern student dormitories directly on campus." },
  ],
  featured: true,
  status: "published",
};

const THAILAND_PARTNER_UNI: University = {
  ...SHINAWATRA_UNI,
  slug: "thailand-partner-institutions",
};

const FALLBACK_UNIVERSITIES: University[] = [
  ...BASE_FALLBACK_UNIVERSITIES,
  SHINAWATRA_UNI,
  THAILAND_PARTNER_UNI,
];

type UniversityRow = {
  slug: string;
  country_slug: string;
  name: string;
  city: string | null;
  tagline: string | null;
  description: string | null;
  hero_photo: string | null;
  rankings: string;
  founded_year: number | null;
  student_population: number | null;
  international_student_pct: number | null;
  campus_type: string | null;
  gallery: string;
  key_points: string;
  videos: string;
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
    rankings: parseArray<{ label: string; value: number }>(row.rankings),
    foundedYear: row.founded_year,
    studentPopulation: row.student_population,
    internationalStudentPct: row.international_student_pct,
    campusType: row.campus_type ?? "",
    gallery: parseArray(row.gallery),
    keyPoints: parseArray(row.key_points),
    videos: parseArray(row.videos),
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
