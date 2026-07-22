export type ProgramRow = {
  id: number;
  slug: string;
  university_slug: string;
  name: string;
  overview: string | null;
  photo: string | null;
  degree_type: string | null;
  field_of_study: string | null;
  campus: string | null;
  intake_months: string;
  duration_months: number | null;
  tuition_per_year: number | null;
  application_fee: number | null;
  deposit: number | null;
  currency: string;
  entry_requirements: string;
  min_gpa: number | null;
  min_ielts: number | null;
  min_toefl: number | null;
  required_documents: string;
  modules: string;
  career_prospects: string;
  scholarships: string;
  faqs: string;
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

export function rowToApi(row: ProgramRow) {
  return {
    id: row.id,
    slug: row.slug,
    universitySlug: row.university_slug,
    name: row.name,
    overview: row.overview ?? "",
    photo: row.photo ?? "",
    degreeType: row.degree_type ?? "",
    fieldOfStudy: row.field_of_study ?? "",
    campus: row.campus ?? "",
    intakeMonths: parseArray<string>(row.intake_months),
    durationMonths: row.duration_months,
    tuitionPerYear: row.tuition_per_year,
    applicationFee: row.application_fee,
    deposit: row.deposit,
    currency: row.currency || "USD",
    entryRequirements: parseArray<string>(row.entry_requirements),
    minGpa: row.min_gpa,
    minIelts: row.min_ielts,
    minToefl: row.min_toefl,
    requiredDocuments: parseArray<string>(row.required_documents),
    modules: parseArray<{ year: number; courses: string[] }>(row.modules),
    careerProspects: parseArray<string>(row.career_prospects),
    scholarships: parseArray<{ name: string; amount?: string; note?: string }>(row.scholarships),
    faqs: parseArray<{ q: string; a: string }>(row.faqs),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export type ProgramInput = {
  slug: string;
  universitySlug: string;
  name: string;
  overview?: string;
  photo?: string;
  degreeType?: string;
  fieldOfStudy?: string;
  campus?: string;
  intakeMonths?: string[];
  durationMonths?: number | null;
  tuitionPerYear?: number | null;
  applicationFee?: number | null;
  deposit?: number | null;
  currency?: string;
  entryRequirements?: string[];
  minGpa?: number | null;
  minIelts?: number | null;
  minToefl?: number | null;
  requiredDocuments?: string[];
  modules?: { year: number; courses: string[] }[];
  careerProspects?: string[];
  scholarships?: { name: string; amount?: string; note?: string }[];
  faqs?: { q: string; a: string }[];
};

const SLUG_RE = /^[a-z0-9-]+$/;

export function validateProgramInput(input: Partial<ProgramInput>, requireSlug: boolean): string | null {
  if (requireSlug) {
    if (!input.slug || !SLUG_RE.test(input.slug)) {
      return "Slug is required and must be lowercase letters, numbers and hyphens only.";
    }
  }
  if (!input.name || !input.name.trim()) return "Program name is required.";
  if (!input.universitySlug || !input.universitySlug.trim()) return "University is required.";
  return null;
}

export function bindingsForInsert(input: ProgramInput) {
  return [
    input.slug,
    input.universitySlug,
    input.name,
    input.overview || null,
    input.photo || null,
    input.degreeType || null,
    input.fieldOfStudy || null,
    input.campus || null,
    JSON.stringify(input.intakeMonths || []),
    input.durationMonths ?? null,
    input.tuitionPerYear ?? null,
    input.applicationFee ?? null,
    input.deposit ?? null,
    input.currency || "USD",
    JSON.stringify(input.entryRequirements || []),
    input.minGpa ?? null,
    input.minIelts ?? null,
    input.minToefl ?? null,
    JSON.stringify(input.requiredDocuments || []),
    JSON.stringify(input.modules || []),
    JSON.stringify(input.careerProspects || []),
    JSON.stringify(input.scholarships || []),
    JSON.stringify(input.faqs || []),
  ];
}

export function bindingsForUpdate(input: ProgramInput) {
  return [
    input.universitySlug,
    input.name,
    input.overview || null,
    input.photo || null,
    input.degreeType || null,
    input.fieldOfStudy || null,
    input.campus || null,
    JSON.stringify(input.intakeMonths || []),
    input.durationMonths ?? null,
    input.tuitionPerYear ?? null,
    input.applicationFee ?? null,
    input.deposit ?? null,
    input.currency || "USD",
    JSON.stringify(input.entryRequirements || []),
    input.minGpa ?? null,
    input.minIelts ?? null,
    input.minToefl ?? null,
    JSON.stringify(input.requiredDocuments || []),
    JSON.stringify(input.modules || []),
    JSON.stringify(input.careerProspects || []),
    JSON.stringify(input.scholarships || []),
    JSON.stringify(input.faqs || []),
  ];
}
