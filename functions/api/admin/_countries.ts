export type CountryRow = {
  id: number;
  slug: string;
  name: string;
  code: string;
  tagline: string | null;
  hero_gradient: string | null;
  accent: string | null;
  photo: string | null;
  summary: string | null;
  capital: string | null;
  language: string | null;
  currency: string | null;
  intake_months: string | null;
  visa_processing: string | null;
  program_length: string | null;
  tuition_from: string | null;
  work_rights: string | null;
  featured: number;
  highlights: string;
  programs: string;
  visa_steps: string;
  requirements: string;
  documents: string;
  faqs: string;
  specializations: string;
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

export function rowToApi(row: CountryRow) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    code: row.code,
    tagline: row.tagline ?? "",
    heroGradient: row.hero_gradient ?? "",
    accent: row.accent ?? "",
    photo: row.photo ?? "",
    summary: row.summary ?? "",
    capital: row.capital ?? "",
    language: row.language ?? "",
    currency: row.currency ?? "",
    intakeMonths: row.intake_months ?? "",
    visaProcessing: row.visa_processing ?? "",
    programLength: row.program_length ?? "",
    tuitionFrom: row.tuition_from ?? "",
    workRights: row.work_rights ?? "",
    featured: !!row.featured,
    highlights: parseArray<string>(row.highlights),
    programs: parseArray<{ name: string; length: string; note: string; tuition?: string }>(row.programs),
    visaSteps: parseArray<{ title: string; detail: string }>(row.visa_steps),
    requirements: parseArray<string>(row.requirements),
    documents: parseArray<string>(row.documents),
    faqs: parseArray<{ q: string; a: string }>(row.faqs),
    specializations: parseArray<{ name: string; photo: string }>(row.specializations),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export type CountryInput = {
  slug: string;
  name: string;
  code: string;
  tagline?: string;
  heroGradient?: string;
  accent?: string;
  photo?: string;
  summary?: string;
  capital?: string;
  language?: string;
  currency?: string;
  intakeMonths?: string;
  visaProcessing?: string;
  programLength?: string;
  tuitionFrom?: string;
  workRights?: string;
  featured?: boolean;
  highlights?: string[];
  programs?: { name: string; length: string; note: string; tuition?: string }[];
  visaSteps?: { title: string; detail: string }[];
  requirements?: string[];
  documents?: string[];
  faqs?: { q: string; a: string }[];
  specializations?: { name: string; photo: string }[];
};

const SLUG_RE = /^[a-z0-9-]+$/;

export function validateCountryInput(input: Partial<CountryInput>, requireSlug: boolean): string | null {
  if (requireSlug) {
    if (!input.slug || !SLUG_RE.test(input.slug)) {
      return "Slug is required and must be lowercase letters, numbers and hyphens only.";
    }
  }
  if (!input.name || !input.name.trim()) return "Country name is required.";
  if (!input.code || !/^[A-Za-z]{2}$/.test(input.code)) return "Country code must be a 2-letter code (e.g. AL).";
  return null;
}

export function bindingsForInsert(input: CountryInput) {
  return [
    input.slug,
    input.name,
    input.code.toUpperCase(),
    input.tagline || null,
    input.heroGradient || null,
    input.accent || null,
    input.photo || null,
    input.summary || null,
    input.capital || null,
    input.language || null,
    input.currency || null,
    input.intakeMonths || null,
    input.visaProcessing || null,
    input.programLength || null,
    input.tuitionFrom || null,
    input.workRights || null,
    input.featured ? 1 : 0,
    JSON.stringify(input.highlights || []),
    JSON.stringify(input.programs || []),
    JSON.stringify(input.visaSteps || []),
    JSON.stringify(input.requirements || []),
    JSON.stringify(input.documents || []),
    JSON.stringify(input.faqs || []),
    JSON.stringify(input.specializations || []),
  ];
}

export function bindingsForUpdate(input: CountryInput) {
  return [
    input.name,
    input.code.toUpperCase(),
    input.tagline || null,
    input.heroGradient || null,
    input.accent || null,
    input.photo || null,
    input.summary || null,
    input.capital || null,
    input.language || null,
    input.currency || null,
    input.intakeMonths || null,
    input.visaProcessing || null,
    input.programLength || null,
    input.tuitionFrom || null,
    input.workRights || null,
    input.featured ? 1 : 0,
    JSON.stringify(input.highlights || []),
    JSON.stringify(input.programs || []),
    JSON.stringify(input.visaSteps || []),
    JSON.stringify(input.requirements || []),
    JSON.stringify(input.documents || []),
    JSON.stringify(input.faqs || []),
    JSON.stringify(input.specializations || []),
  ];
}
