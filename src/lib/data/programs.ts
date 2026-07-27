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
  feeBreakdown: FeeBreakdownRow[];
  status: string;
};

// A single billing year at a single degree level, in the partner
// institution's own currency — e.g. Shinawatra University bills
// registration/management/tuition separately, in THB, per year of study.
// `currency` defaults to THB in the UI layer since every program using this
// so far is Thai; kept per-row (not per-program) in case a future partner
// bills in a different currency.
export type FeeBreakdownRow = {
  label: string;
  registrationFee: number;
  managementFee: number;
  tuitionFee: number;
  total: number;
  currency: string;
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
const WBU_BACHELOR_REQS = ["Minimum 70% average across grades 10-12", "Online interview with the academic department", "English proficiency at B1 level (IELTS 4.0, TOEFL 57, or Cambridge PET)", "Maximum study gap of 3 years since high school", "Non-refundable university application fee of €200"];
const WBU_INTEGRATED_REQS = ["Minimum 80% average across grades 10-12", "Casper test (online situational-judgement exam)", "Online interview with the academic department", "English proficiency at B1 level (IELTS 4.0, TOEFL 57, or Cambridge PET)", "Maximum study gap of 3 years since high school", "Non-refundable university application fee of €300"];
const WBU_MASTER_REQS = ["Minimum 70% in the relevant Bachelor's degree", "English proficiency at B1 level (IELTS 4.0, TOEFL 57, or Cambridge PET)", "Maximum study gap of 5 years since the Bachelor's degree"];
const WBU_DOCS = ["Scanned transcripts (grades 10-12), plus WAEC results for Nigerian applicants", "International passport copy", "English proficiency certificate (if not exempt)", "Legalized (apostille/MFA-stamped) high school diploma and transcripts", "Signed accommodation contract or proof of 9-month accommodation prepayment"];

const FALLBACK_PROGRAMS_RAW: {
  slug: string;
  universitySlug: string;
  name: string;
  overview: string;
  photo?: string;
  entryRequirements: string[];
  requiredDocuments: string[];
}[] = [
  { slug: "albania-partner-institutions-nursing", universitySlug: "albania-partner-institutions", name: "Nursing", overview: "Bachelor's degree (3 years, 180 ECTS)", entryRequirements: WBU_BACHELOR_REQS, requiredDocuments: WBU_DOCS },
  { slug: "albania-partner-institutions-imaging-technician", universitySlug: "albania-partner-institutions", name: "Imaging Technician", overview: "Bachelor's degree (3 years, 180 ECTS)", entryRequirements: WBU_BACHELOR_REQS, requiredDocuments: WBU_DOCS },
  { slug: "albania-partner-institutions-laboratory-technician", universitySlug: "albania-partner-institutions", name: "Laboratory Technician", overview: "Bachelor's degree (3 years, 180 ECTS)", entryRequirements: WBU_BACHELOR_REQS, requiredDocuments: WBU_DOCS },
  { slug: "albania-partner-institutions-physiotherapy", universitySlug: "albania-partner-institutions", name: "Physiotherapy", overview: "Bachelor's degree (3 years, 180 ECTS)", entryRequirements: WBU_BACHELOR_REQS, requiredDocuments: WBU_DOCS },
  { slug: "albania-partner-institutions-dental-technician", universitySlug: "albania-partner-institutions", name: "Dental Technician", overview: "Bachelor's degree (3 years, 180 ECTS)", entryRequirements: WBU_BACHELOR_REQS, requiredDocuments: WBU_DOCS },
  { slug: "albania-partner-institutions-biotechnology", universitySlug: "albania-partner-institutions", name: "Biotechnology", overview: "Bachelor's degree (3 years, 180 ECTS)", entryRequirements: WBU_BACHELOR_REQS, requiredDocuments: WBU_DOCS },
  { slug: "albania-partner-institutions-biomedical-engineering", universitySlug: "albania-partner-institutions", name: "Biomedical Engineering", overview: "Bachelor's degree (3 years, 180 ECTS)", entryRequirements: WBU_BACHELOR_REQS, requiredDocuments: WBU_DOCS },
  { slug: "albania-partner-institutions-business-and-technology", universitySlug: "albania-partner-institutions", name: "Business & Technology", overview: "Bachelor's degree (3 years, 180 ECTS)", entryRequirements: WBU_BACHELOR_REQS, requiredDocuments: WBU_DOCS },
  { slug: "albania-partner-institutions-cyber-security", universitySlug: "albania-partner-institutions", name: "Cyber Security", overview: "Bachelor's degree (3 years, 180 ECTS)", entryRequirements: WBU_BACHELOR_REQS, requiredDocuments: WBU_DOCS },
  { slug: "albania-partner-institutions-computer-science-and-ai", universitySlug: "albania-partner-institutions", name: "Computer Science & AI", overview: "Bachelor's degree (3 years, 180 ECTS)", entryRequirements: WBU_BACHELOR_REQS, requiredDocuments: WBU_DOCS },
  { slug: "albania-partner-institutions-software-engineering", universitySlug: "albania-partner-institutions", name: "Software Engineering", overview: "Bachelor's degree (3 years, 180 ECTS)", entryRequirements: WBU_BACHELOR_REQS, requiredDocuments: WBU_DOCS },
  { slug: "albania-partner-institutions-health-care-management", universitySlug: "albania-partner-institutions", name: "Health Care Management", overview: "Bachelor's degree (3 years, 180 ECTS)", entryRequirements: WBU_BACHELOR_REQS, requiredDocuments: WBU_DOCS },
  { slug: "albania-partner-institutions-optometry-and-visual-sciences", universitySlug: "albania-partner-institutions", name: "Optometry and Visual Sciences", overview: "Bachelor's degree (3 years, 180 ECTS)", entryRequirements: WBU_BACHELOR_REQS, requiredDocuments: WBU_DOCS },
  { slug: "albania-partner-institutions-medicine", universitySlug: "albania-partner-institutions", name: "Medicine", overview: "Integrated Bachelor's & Master's (6 years, 360 ECTS) — curriculum designed by the University of Cambridge", entryRequirements: WBU_INTEGRATED_REQS, requiredDocuments: WBU_DOCS },
  { slug: "albania-partner-institutions-dentistry", universitySlug: "albania-partner-institutions", name: "Dentistry", overview: "Integrated Bachelor's & Master's (6 years, 360 ECTS)", entryRequirements: WBU_INTEGRATED_REQS, requiredDocuments: WBU_DOCS },
  { slug: "albania-partner-institutions-pharmacy", universitySlug: "albania-partner-institutions", name: "Pharmacy", overview: "Integrated Bachelor's & Master's (5 years, 300 ECTS)", entryRequirements: WBU_INTEGRATED_REQS, requiredDocuments: WBU_DOCS },
  { slug: "albania-partner-institutions-hospital-management", universitySlug: "albania-partner-institutions", name: "Hospital Management", overview: "Master's degree (2 years, 120 ECTS)", entryRequirements: WBU_MASTER_REQS, requiredDocuments: WBU_DOCS },
  { slug: "albania-partner-institutions-computer-science-msc", universitySlug: "albania-partner-institutions", name: "Computer Science (MSc)", overview: "Master's degree (2 years, 120 ECTS)", entryRequirements: WBU_MASTER_REQS, requiredDocuments: WBU_DOCS },
  { slug: "albania-partner-institutions-nanotechnology", universitySlug: "albania-partner-institutions", name: "Nanotechnology", overview: "Master's degree (2 years, 120 ECTS)", entryRequirements: WBU_MASTER_REQS, requiredDocuments: WBU_DOCS },
  { slug: "albania-partner-institutions-nursing-msc", universitySlug: "albania-partner-institutions", name: "Nursing (MSc)", overview: "Master's degree (2 years, 120 ECTS)", entryRequirements: WBU_MASTER_REQS, requiredDocuments: WBU_DOCS },
  { slug: "albania-partner-institutions-executive-mba", universitySlug: "albania-partner-institutions", name: "Executive MBA", overview: "Executive MBA (1 year, 60 ECTS)", entryRequirements: WBU_MASTER_REQS, requiredDocuments: WBU_DOCS },

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

  { slug: "thailand-partner-institutions-international-trade-management", universitySlug: "thailand-partner-institutions", name: "International Trade Management", overview: "BBA specialization in cross-border trade and international business (Faculty of Management)", entryRequirements: ["Secondary school certificate", "Valid international passport", "Basic English proficiency"], requiredDocuments: ["International passport", "Academic certificates", "Passport photograph"] },
  { slug: "thailand-partner-institutions-logistics-and-supply-chain-management", universitySlug: "thailand-partner-institutions", name: "Logistics and Supply Chain Management", overview: "BBA specialization in logistics and supply chain (Faculty of Management)", entryRequirements: ["Secondary school certificate", "Valid international passport", "Basic English proficiency"], requiredDocuments: ["International passport", "Academic certificates", "Passport photograph"] },
  { slug: "thailand-partner-institutions-business-chinese", universitySlug: "thailand-partner-institutions", name: "Business Chinese", overview: "BBA specialization combining business with Chinese-language proficiency (Faculty of Management)", entryRequirements: ["Secondary school certificate", "Valid international passport", "Basic English proficiency"], requiredDocuments: ["International passport", "Academic certificates", "Passport photograph"] },
  { slug: "thailand-partner-institutions-business-administration", universitySlug: "thailand-partner-institutions", name: "Business Administration", overview: "Master & Doctoral study in business and political administration (Faculty of Management)", entryRequirements: ["Secondary school certificate", "Valid international passport", "Basic English proficiency"], requiredDocuments: ["International passport", "Academic certificates", "Passport photograph"] },
  { slug: "thailand-partner-institutions-psychology", universitySlug: "thailand-partner-institutions", name: "Psychology", overview: "Master & Doctoral psychological sciences and research (Faculty of Psychology)", entryRequirements: ["Secondary school certificate", "Valid international passport", "Basic English proficiency"], requiredDocuments: ["International passport", "Academic certificates", "Passport photograph"] },

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
  feeBreakdown: [],
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
  fee_breakdown: string;
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
    feeBreakdown: parseArray(row.fee_breakdown),
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
