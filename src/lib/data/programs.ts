import { cache } from "react";
import { programImage } from "@/lib/imagePaths";
import { queryD1 } from "@/lib/data/d1";

export type Program = {
  slug: string;
  universitySlug: string;
  name: string;
  overview: string;
  photo: string;
  degreeType: string;
  fieldOfStudy: string;
  campus: string;
  intakeMonths: string[];
  durationMonths: number | null;
  tuitionPerYear: number | null;
  applicationFee: number | null;
  deposit: number | null;
  currency: string;
  entryRequirements: string[];
  minGpa: number | null;
  minIelts: number | null;
  minToefl: number | null;
  requiredDocuments: string[];
  modules: { year: number; courses: string[] }[];
  careerProspects: string[];
  scholarships: { name: string; amount?: string; note?: string }[];
  faqs: { q: string; a: string }[];
  status: string;
};

export type ProgramIntake = {
  id: number;
  month: string;
  year: number;
  deadline: string | null;
  status: string;
};

// Mirrors the real Phase-5 migration output (scripts/migrate-universities-seed.sql)
// so builds never hard-fail when the D1 HTTP API is unreachable at build time.
// degreeType/fieldOfStudy/durationMonths/tuitionPerYear etc. weren't part of
// the old embedded {name, length, note, tuition?} shape, so they stay empty —
// `overview` preserves the original length/tuition text instead of losing it.
const FALLBACK_PROGRAMS_RAW: {
  slug: string;
  universitySlug: string;
  name: string;
  overview: string;
  photo?: string;
  entryRequirements: string[];
  requiredDocuments: string[];
}[] = [
  { slug: "albania-partner-institutions-culinary-arts", universitySlug: "albania-partner-institutions", name: "Culinary Arts", overview: "Hands-on professional kitchen training (1 year)", photo: "/api/images/program/albania/1784200281287-albanin.jpg", entryRequirements: ["No age limit", "Secondary school completion", "Basic English communication", "Valid international passport"], requiredDocuments: ["International passport", "Secondary school certificate", "Passport photograph", "CV / Resume"] },
  { slug: "albania-partner-institutions-pastry-and-baking", universitySlug: "albania-partner-institutions", name: "Pastry & Baking", overview: "Specialization track (1 year)", entryRequirements: ["No age limit", "Secondary school completion", "Basic English communication", "Valid international passport"], requiredDocuments: ["International passport", "Secondary school certificate", "Passport photograph", "CV / Resume"] },
  { slug: "albania-partner-institutions-food-and-beverage-management", universitySlug: "albania-partner-institutions", name: "Food & Beverage Management", overview: "Hospitality-focused (1 year)", entryRequirements: ["No age limit", "Secondary school completion", "Basic English communication", "Valid international passport"], requiredDocuments: ["International passport", "Secondary school certificate", "Passport photograph", "CV / Resume"] },

  { slug: "cyprus-partner-institutions-nursing-and-health-sciences", universitySlug: "cyprus-partner-institutions", name: "Nursing & Health Sciences", overview: "High demand pathway (3 – 4 years)", entryRequirements: ["Secondary school certificate (WAEC/NECO accepted)", "Valid international passport", "English proficiency (IELTS not always required)", "Proof of funds guidance provided"], requiredDocuments: ["International passport", "Academic certificates", "Transcripts", "Passport photograph", "CV / Resume"] },
  { slug: "cyprus-partner-institutions-business-administration", universitySlug: "cyprus-partner-institutions", name: "Business Administration", overview: "Bachelor & Masters (3 – 4 years)", entryRequirements: ["Secondary school certificate (WAEC/NECO accepted)", "Valid international passport", "English proficiency (IELTS not always required)", "Proof of funds guidance provided"], requiredDocuments: ["International passport", "Academic certificates", "Transcripts", "Passport photograph", "CV / Resume"] },
  { slug: "cyprus-partner-institutions-hospitality-and-tourism", universitySlug: "cyprus-partner-institutions", name: "Hospitality & Tourism", overview: "Strong local industry (2 – 3 years)", entryRequirements: ["Secondary school certificate (WAEC/NECO accepted)", "Valid international passport", "English proficiency (IELTS not always required)", "Proof of funds guidance provided"], requiredDocuments: ["International passport", "Academic certificates", "Transcripts", "Passport photograph", "CV / Resume"] },
  { slug: "cyprus-partner-institutions-foundation-pathway", universitySlug: "cyprus-partner-institutions", name: "Foundation / Pathway", overview: "Entry route without IELTS (1 year)", entryRequirements: ["Secondary school certificate (WAEC/NECO accepted)", "Valid international passport", "English proficiency (IELTS not always required)", "Proof of funds guidance provided"], requiredDocuments: ["International passport", "Academic certificates", "Transcripts", "Passport photograph", "CV / Resume"] },

  { slug: "malaysia-partner-institutions-business-and-management", universitySlug: "malaysia-partner-institutions", name: "Business & Management", overview: "Bachelor & Masters (3 years)", entryRequirements: ["Secondary school certificate", "Valid international passport", "Academic transcripts", "English proficiency (flexible options)"], requiredDocuments: ["International passport", "Academic certificates", "Transcripts", "Passport photograph"] },
  { slug: "malaysia-partner-institutions-information-technology", universitySlug: "malaysia-partner-institutions", name: "Information Technology", overview: "Strong tech job market (3 years)", entryRequirements: ["Secondary school certificate", "Valid international passport", "Academic transcripts", "English proficiency (flexible options)"], requiredDocuments: ["International passport", "Academic certificates", "Transcripts", "Passport photograph"] },
  { slug: "malaysia-partner-institutions-engineering", universitySlug: "malaysia-partner-institutions", name: "Engineering", overview: "Internationally accredited (4 years)", entryRequirements: ["Secondary school certificate", "Valid international passport", "Academic transcripts", "English proficiency (flexible options)"], requiredDocuments: ["International passport", "Academic certificates", "Transcripts", "Passport photograph"] },
  { slug: "malaysia-partner-institutions-foundation-programs", universitySlug: "malaysia-partner-institutions", name: "Foundation Programs", overview: "Pathway to degree (1 year)", entryRequirements: ["Secondary school certificate", "Valid international passport", "Academic transcripts", "English proficiency (flexible options)"], requiredDocuments: ["International passport", "Academic certificates", "Transcripts", "Passport photograph"] },

  { slug: "cambodia-partner-institutions-hospitality-management", universitySlug: "cambodia-partner-institutions", name: "Hospitality Management", overview: "Booming tourism sector (2 – 3 years)", entryRequirements: ["Secondary school certificate", "Valid international passport", "Basic English"], requiredDocuments: ["International passport", "Academic certificates", "Passport photograph"] },
  { slug: "cambodia-partner-institutions-business-administration", universitySlug: "cambodia-partner-institutions", name: "Business Administration", overview: "English-taught (3 years)", entryRequirements: ["Secondary school certificate", "Valid international passport", "Basic English"], requiredDocuments: ["International passport", "Academic certificates", "Passport photograph"] },
  { slug: "cambodia-partner-institutions-international-relations", universitySlug: "cambodia-partner-institutions", name: "International Relations", overview: "Regional hub (3 years)", entryRequirements: ["Secondary school certificate", "Valid international passport", "Basic English"], requiredDocuments: ["International passport", "Academic certificates", "Passport photograph"] },

  { slug: "thailand-partner-institutions-hospitality-and-tourism-management", universitySlug: "thailand-partner-institutions", name: "Hospitality & Tourism Management", overview: "Strong industry placement network (2 – 3 years)", entryRequirements: ["Secondary school certificate", "Valid international passport", "Basic English proficiency"], requiredDocuments: ["International passport", "Academic certificates", "Passport photograph"] },
  { slug: "thailand-partner-institutions-business-administration", universitySlug: "thailand-partner-institutions", name: "Business Administration", overview: "Bachelor & Masters (3 years)", entryRequirements: ["Secondary school certificate", "Valid international passport", "Basic English proficiency"], requiredDocuments: ["International passport", "Academic certificates", "Passport photograph"] },
  { slug: "thailand-partner-institutions-international-culinary-arts", universitySlug: "thailand-partner-institutions", name: "International Culinary Arts", overview: "Thai and international cuisine (1 – 2 years)", entryRequirements: ["Secondary school certificate", "Valid international passport", "Basic English proficiency"], requiredDocuments: ["International passport", "Academic certificates", "Passport photograph"] },

  { slug: "russia-partner-institutions-medicine-mbbs-equivalent", universitySlug: "russia-partner-institutions", name: "Medicine (MBBS equivalent)", overview: "WHO/ECFMG-listed institutions (6 years)", entryRequirements: ["Secondary school certificate", "Valid international passport", "English proficiency for English-taught programs"], requiredDocuments: ["International passport", "Academic certificates", "Transcripts", "Passport photograph"] },
  { slug: "russia-partner-institutions-engineering", universitySlug: "russia-partner-institutions", name: "Engineering", overview: "Strong technical faculties (4 years)", entryRequirements: ["Secondary school certificate", "Valid international passport", "English proficiency for English-taught programs"], requiredDocuments: ["International passport", "Academic certificates", "Transcripts", "Passport photograph"] },
  { slug: "russia-partner-institutions-business-and-economics", universitySlug: "russia-partner-institutions", name: "Business & Economics", overview: "Bachelor & Masters (4 years)", entryRequirements: ["Secondary school certificate", "Valid international passport", "English proficiency for English-taught programs"], requiredDocuments: ["International passport", "Academic certificates", "Transcripts", "Passport photograph"] },
];

const FALLBACK_PROGRAMS: Program[] = FALLBACK_PROGRAMS_RAW.map((p) => ({
  slug: p.slug,
  universitySlug: p.universitySlug,
  name: p.name,
  overview: p.overview,
  photo: p.photo ?? programImage(p.slug),
  degreeType: "",
  fieldOfStudy: "",
  campus: "",
  intakeMonths: [],
  durationMonths: null,
  tuitionPerYear: null,
  applicationFee: null,
  deposit: null,
  currency: "USD",
  entryRequirements: p.entryRequirements,
  minGpa: null,
  minIelts: null,
  minToefl: null,
  requiredDocuments: p.requiredDocuments,
  modules: [],
  careerProspects: [],
  scholarships: [],
  faqs: [],
  status: "published",
}));

type ProgramRow = {
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
};

function parseArray<T>(text: string): T[] {
  try {
    const v = JSON.parse(text);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function rowToProgram(row: ProgramRow): Program {
  return {
    slug: row.slug,
    universitySlug: row.university_slug,
    name: row.name,
    overview: row.overview ?? "",
    photo: row.photo ?? programImage(row.slug),
    degreeType: row.degree_type ?? "",
    fieldOfStudy: row.field_of_study ?? "",
    campus: row.campus ?? "",
    intakeMonths: parseArray(row.intake_months),
    durationMonths: row.duration_months,
    tuitionPerYear: row.tuition_per_year,
    applicationFee: row.application_fee,
    deposit: row.deposit,
    currency: row.currency || "USD",
    entryRequirements: parseArray(row.entry_requirements),
    minGpa: row.min_gpa,
    minIelts: row.min_ielts,
    minToefl: row.min_toefl,
    requiredDocuments: parseArray(row.required_documents),
    modules: parseArray(row.modules),
    careerProspects: parseArray(row.career_prospects),
    scholarships: parseArray(row.scholarships),
    faqs: parseArray(row.faqs),
    status: row.status,
  };
}

export const getPrograms = cache(async (): Promise<Program[]> => {
  const rows = await queryD1<ProgramRow>("SELECT * FROM programs WHERE status = 'published' ORDER BY name");
  const fromD1 = rows?.map(rowToProgram);
  return fromD1 && fromD1.length > 0 ? fromD1 : FALLBACK_PROGRAMS;
});

export async function getProgram(slug: string): Promise<Program | undefined> {
  const all = await getPrograms();
  return all.find((p) => p.slug === slug);
}

export async function getProgramsByUniversity(universitySlug: string): Promise<Program[]> {
  const all = await getPrograms();
  return all.filter((p) => p.universitySlug === universitySlug);
}

export async function getRelatedPrograms(universitySlug: string, excludeSlug: string, limit = 3): Promise<Program[]> {
  const byUniversity = await getProgramsByUniversity(universitySlug);
  return byUniversity.filter((p) => p.slug !== excludeSlug).slice(0, limit);
}

type IntakeRow = { id: number; program_slug: string; month: string; year: number; deadline: string | null; status: string };

// No fallback on purpose — the table is genuinely empty until real intake
// dates are entered; showing fabricated dates would mislead a student.
const getAllIntakes = cache(async (): Promise<IntakeRow[]> => {
  const rows = await queryD1<IntakeRow>(
    "SELECT id, program_slug, month, year, deadline, status FROM program_intakes ORDER BY year, month"
  );
  return rows ?? [];
});

export async function getIntakesByProgram(programSlug: string): Promise<ProgramIntake[]> {
  const all = await getAllIntakes();
  return all.filter((i) => i.program_slug === programSlug).map((i) => ({ id: i.id, month: i.month, year: i.year, deadline: i.deadline, status: i.status }));
}
