export type UniversityRow = {
  id: number;
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
  created_at: string;
  updated_at: string;
};

function parseArray<T>(text: string | null): T[] {
  if (!text) return [];
  try {
    const v = JSON.parse(text);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function rowToApi(row: UniversityRow) {
  return {
    id: row.id,
    slug: row.slug,
    countrySlug: row.country_slug,
    name: row.name,
    city: row.city ?? "",
    tagline: row.tagline ?? "",
    description: row.description ?? "",
    heroPhoto: row.hero_photo ?? "",
    rankings: parseArray<{ label: string; value: number }>(row.rankings),
    foundedYear: row.founded_year,
    studentPopulation: row.student_population,
    internationalStudentPct: row.international_student_pct,
    campusType: row.campus_type ?? "",
    gallery: parseArray<string>(row.gallery),
    keyPoints: parseArray<string>(row.key_points),
    videos: parseArray<{ title: string; url: string }>(row.videos),
    accreditations: parseArray<string>(row.accreditations),
    accommodationSummary: row.accommodation_summary ?? "",
    accommodationCostRange: row.accommodation_cost_range ?? "",
    studentLife: parseArray<string>(row.student_life),
    faqs: parseArray<{ q: string; a: string }>(row.faqs),
    featured: !!row.featured,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export type UniversityInput = {
  slug: string;
  countrySlug: string;
  name: string;
  city?: string;
  tagline?: string;
  description?: string;
  heroPhoto?: string;
  rankings?: { label: string; value: number }[];
  foundedYear?: number | null;
  studentPopulation?: number | null;
  internationalStudentPct?: number | null;
  campusType?: string;
  gallery?: string[];
  keyPoints?: string[];
  videos?: { title: string; url: string }[];
  accreditations?: string[];
  accommodationSummary?: string;
  accommodationCostRange?: string;
  studentLife?: string[];
  faqs?: { q: string; a: string }[];
  featured?: boolean;
};

const SLUG_RE = /^[a-z0-9-]+$/;

export function validateUniversityInput(input: Partial<UniversityInput>, requireSlug: boolean): string | null {
  if (requireSlug) {
    if (!input.slug || !SLUG_RE.test(input.slug)) {
      return "Slug is required and must be lowercase letters, numbers and hyphens only.";
    }
  }
  if (!input.name || !input.name.trim()) return "University name is required.";
  if (!input.countrySlug || !input.countrySlug.trim()) return "Country is required.";
  return null;
}

export function bindingsForInsert(input: UniversityInput) {
  return [
    input.slug,
    input.countrySlug,
    input.name,
    input.city || null,
    input.tagline || null,
    input.description || null,
    input.heroPhoto || null,
    JSON.stringify(input.rankings || []),
    input.foundedYear ?? null,
    input.studentPopulation ?? null,
    input.internationalStudentPct ?? null,
    input.campusType || null,
    JSON.stringify(input.gallery || []),
    JSON.stringify(input.keyPoints || []),
    JSON.stringify(input.videos || []),
    JSON.stringify(input.accreditations || []),
    input.accommodationSummary || null,
    input.accommodationCostRange || null,
    JSON.stringify(input.studentLife || []),
    JSON.stringify(input.faqs || []),
    input.featured ? 1 : 0,
  ];
}

export function bindingsForUpdate(input: UniversityInput) {
  return [
    input.countrySlug,
    input.name,
    input.city || null,
    input.tagline || null,
    input.description || null,
    input.heroPhoto || null,
    JSON.stringify(input.rankings || []),
    input.foundedYear ?? null,
    input.studentPopulation ?? null,
    input.internationalStudentPct ?? null,
    input.campusType || null,
    JSON.stringify(input.gallery || []),
    JSON.stringify(input.keyPoints || []),
    JSON.stringify(input.videos || []),
    JSON.stringify(input.accreditations || []),
    input.accommodationSummary || null,
    input.accommodationCostRange || null,
    JSON.stringify(input.studentLife || []),
    JSON.stringify(input.faqs || []),
    input.featured ? 1 : 0,
  ];
}
