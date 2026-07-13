import { cache } from "react";
import { destinationImage, specializationImage } from "@/lib/imagePaths";
import { queryD1 } from "@/lib/data/d1";

export type Destination = {
  slug: string;
  name: string;
  code: string;
  tagline: string;
  heroGradient: string;
  photo: string;
  accent: string;
  summary: string;
  capital: string;
  language: string;
  currency: string;
  intakeMonths: string;
  visaProcessing: string;
  programLength: string;
  tuitionFrom: string;
  workRights: string;
  featured: boolean;
  highlights: string[];
  programs: { name: string; length: string; note: string; tuition?: string }[];
  visaSteps: { title: string; detail: string }[];
  requirements: string[];
  documents: string[];
  faqs: { q: string; a: string }[];
  specializations?: { name: string; photo: string }[];
};

// Used when the Cloudflare D1 HTTP API isn't reachable at build time (local
// `next dev`/`next build` without credentials, or a PR preview build) so
// builds never hard-fail. Kept in sync with the D1 `countries` table by the
// one-time migration in scripts/seed-destinations.sql — this is the same
// data, just not the live edit source of truth anymore (see /admin).
const FALLBACK_DESTINATIONS: Destination[] = [
  {
    slug: "albania",
    code: "AL",
    name: "Albania",
    tagline: "One-Year Culinary Program",
    heroGradient: "from-red-700 via-red-600 to-rose-500",
    photo: destinationImage("albania"),
    accent: "#DC2626",
    summary:
      "Albania's one-year culinary program is our hottest offer: no age limit, morning-only classes so you have the whole afternoon to work, job support after graduation, and a clear pathway to bring your family once you secure employment.",
    capital: "Tirana",
    language: "Albanian (programs taught in English)",
    currency: "Euro (€) accepted widely",
    intakeMonths: "Jan, May, Sep",
    visaProcessing: "2 – 4 weeks",
    programLength: "1 year",
    tuitionFrom: "€2,800 / year",
    workRights: "Work while you study — classes are mornings only",
    featured: true,
    highlights: [
      "No age requirement — anyone can apply",
      "Short 1-year program",
      "Morning classes only, afternoons free to work",
      "Job placement support after graduation",
      "Bring family members once you secure work (after studies)",
      "Admissions currently open",
    ],
    programs: [
      { name: "Culinary Arts", length: "1 year", note: "Hands-on professional kitchen training" },
      { name: "Pastry & Baking", length: "1 year", note: "Specialization track" },
      { name: "Food & Beverage Management", length: "1 year", note: "Hospitality-focused" },
    ],
    visaSteps: [
      { title: "Apply online", detail: "Fill our application form and upload your documents." },
      { title: "Admission letter", detail: "We process your admission with the culinary school." },
      { title: "Visa application", detail: "We guide you through the straightforward Albanian student visa." },
      { title: "Fly to Tirana", detail: "Arrival support, accommodation guidance and orientation." },
    ],
    requirements: [
      "No age limit",
      "Secondary school completion",
      "Basic English communication",
      "Valid international passport",
    ],
    documents: ["International passport", "Secondary school certificate", "Passport photograph", "CV / Resume"],
    faqs: [
      { q: "Is there an age limit?", a: "No. The Albania culinary program has no age requirement — this is one of its biggest advantages." },
      { q: "Can I work while studying?", a: "Yes. Classes run in the mornings only, leaving your afternoons and evenings free to work." },
      { q: "Can my family join me?", a: "Family reunification is possible once you secure employment after your studies — not during the study period." },
      { q: "How long is the program?", a: "Just one year, after which you receive an internationally recognized certificate and job placement support." },
    ],
    specializations: [
      { name: "Culinary Arts", photo: specializationImage("culinary-arts") },
      { name: "Pastry & Baking", photo: specializationImage("pastry-baking") },
      { name: "International Cuisine", photo: specializationImage("international-cuisine") },
      { name: "Food & Beverage Mgmt", photo: specializationImage("food-beverage") },
    ],
  },
  {
    slug: "cyprus",
    code: "CY",
    name: "Cyprus",
    tagline: "Straightforward Visa, EU-Standard Education",
    heroGradient: "from-sky-700 via-sky-600 to-cyan-500",
    photo: destinationImage("cyprus"),
    accent: "#0284C7",
    summary:
      "Cyprus combines a genuinely straightforward student visa process with EU-standard education, English-taught programs, and the right to work while you study — one of the most reliable routes for African students.",
    capital: "Nicosia",
    language: "Greek / English-taught programs",
    currency: "Euro (€)",
    intakeMonths: "Feb, Jun, Oct",
    visaProcessing: "4 – 6 weeks",
    programLength: "1 – 4 years",
    tuitionFrom: "€3,200 / year",
    workRights: "Part-time work permitted for students",
    featured: true,
    highlights: [
      "Visa process is straightforward with high success rates",
      "English-taught programs",
      "Work while you study",
      "EU-standard education and lifestyle",
      "Admissions currently open",
    ],
    programs: [
      { name: "Nursing & Health Sciences", length: "3 – 4 years", note: "High demand pathway" },
      { name: "Business Administration", length: "3 – 4 years", note: "Bachelor & Masters" },
      { name: "Hospitality & Tourism", length: "2 – 3 years", note: "Strong local industry" },
      { name: "Foundation / Pathway", length: "1 year", note: "Entry route without IELTS" },
    ],
    visaSteps: [
      { title: "Apply online", detail: "Submit the application form with your academic documents." },
      { title: "University admission", detail: "We secure your admission letter from a partner institution." },
      { title: "Visa processing", detail: "Document guidance and embassy submission support end-to-end." },
      { title: "Travel & arrival", detail: "Pre-departure briefing and arrival support in Cyprus." },
    ],
    requirements: [
      "Secondary school certificate (WAEC/NECO accepted)",
      "Valid international passport",
      "English proficiency (IELTS not always required)",
      "Proof of funds guidance provided",
    ],
    documents: ["International passport", "Academic certificates", "Transcripts", "Passport photograph", "CV / Resume"],
    faqs: [
      { q: "Do I need IELTS?", a: "Not always — many partner institutions accept alternative proof of English or an internal test. We advise you based on your profile." },
      { q: "Can I work while studying?", a: "Yes, students can work part-time in permitted sectors." },
      { q: "How long does the visa take?", a: "Typically 4–6 weeks once your documents are complete." },
    ],
  },
  {
    slug: "malaysia",
    code: "MY",
    name: "Malaysia",
    tagline: "Affordable, English-Taught, Post-Study Options",
    heroGradient: "from-indigo-700 via-blue-600 to-sky-500",
    photo: destinationImage("malaysia"),
    accent: "#4F46E5",
    summary:
      "Malaysia offers globally ranked universities at a fraction of Western costs, fully English-taught programs, a large international student community, and post-study work options.",
    capital: "Kuala Lumpur",
    language: "Malay / English-taught programs",
    currency: "Ringgit (RM)",
    intakeMonths: "Jan, May, Sep",
    visaProcessing: "3 – 6 weeks",
    programLength: "1 – 4 years",
    tuitionFrom: "$2,800 / year",
    workRights: "Part-time work during semester breaks",
    featured: true,
    highlights: [
      "Affordable tuition and living costs",
      "English is widely spoken",
      "Globally ranked universities",
      "Post-study work options",
      "Large African student community",
    ],
    programs: [
      { name: "Business & Management", length: "3 years", note: "Bachelor & Masters" },
      { name: "Information Technology", length: "3 years", note: "Strong tech job market" },
      { name: "Engineering", length: "4 years", note: "Internationally accredited" },
      { name: "Foundation Programs", length: "1 year", note: "Pathway to degree" },
    ],
    visaSteps: [
      { title: "Apply online", detail: "Submit your application and academic documents." },
      { title: "University offer", detail: "We obtain your offer letter and EMGS approval." },
      { title: "Visa approval letter", detail: "Student pass processed before you travel." },
      { title: "Fly to Malaysia", detail: "Airport clearance and arrival support." },
    ],
    requirements: [
      "Secondary school certificate",
      "Valid international passport",
      "Academic transcripts",
      "English proficiency (flexible options)",
    ],
    documents: ["International passport", "Academic certificates", "Transcripts", "Passport photograph"],
    faqs: [
      { q: "Is Malaysia affordable?", a: "Yes — tuition and living costs are among the lowest for the quality of education offered." },
      { q: "Are programs in English?", a: "Yes, international programs are fully English-taught." },
    ],
  },
  {
    slug: "cambodia",
    code: "KH",
    name: "Cambodia",
    tagline: "Fast Admissions, Emerging Opportunity",
    heroGradient: "from-violet-700 via-purple-600 to-fuchsia-500",
    photo: destinationImage("cambodia"),
    accent: "#7C3AED",
    summary:
      "Cambodia is an emerging destination with fast admissions, low costs, English-taught programs and a growing economy full of opportunity in hospitality and business.",
    capital: "Phnom Penh",
    language: "Khmer / English-taught programs",
    currency: "US Dollar ($) widely used",
    intakeMonths: "Rolling admissions",
    visaProcessing: "2 – 4 weeks",
    programLength: "1 – 4 years",
    tuitionFrom: "$2,500 / year",
    workRights: "Work opportunities available",
    featured: true,
    highlights: [
      "Fast, simple admissions",
      "English-taught programs",
      "Very low living costs",
      "US Dollar economy",
      "Growing hospitality and business sectors",
    ],
    programs: [
      { name: "Hospitality Management", length: "2 – 3 years", note: "Booming tourism sector" },
      { name: "Business Administration", length: "3 years", note: "English-taught" },
      { name: "International Relations", length: "3 years", note: "Regional hub" },
    ],
    visaSteps: [
      { title: "Apply online", detail: "Simple application with basic documents." },
      { title: "Admission letter", detail: "Fast processing with partner institutions." },
      { title: "Visa on arrival / e-visa", detail: "One of the simplest visa routes available." },
      { title: "Arrival support", detail: "Accommodation and orientation assistance." },
    ],
    requirements: ["Secondary school certificate", "Valid international passport", "Basic English"],
    documents: ["International passport", "Academic certificates", "Passport photograph"],
    faqs: [
      { q: "How fast is admission?", a: "Cambodia has rolling admissions — processing can complete in as little as 2 weeks." },
      { q: "Is it affordable?", a: "Yes, both tuition and living costs are very low, and the economy uses US dollars." },
    ],
  },
];

type CountryRow = {
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
};

function parseArray<T>(text: string): T[] {
  try {
    const v = JSON.parse(text);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function rowToDestination(row: CountryRow): Destination {
  return {
    slug: row.slug,
    name: row.name,
    code: row.code,
    tagline: row.tagline ?? "",
    heroGradient: row.hero_gradient ?? "",
    photo: row.photo ?? "",
    accent: row.accent ?? "",
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
    highlights: parseArray(row.highlights),
    programs: parseArray(row.programs),
    visaSteps: parseArray(row.visa_steps),
    requirements: parseArray(row.requirements),
    documents: parseArray(row.documents),
    faqs: parseArray(row.faqs),
    specializations: parseArray(row.specializations),
  };
}

export const getDestinations = cache(async (): Promise<Destination[]> => {
  const rows = await queryD1<CountryRow>("SELECT * FROM countries WHERE status = 'published' ORDER BY name");
  const fromD1 = rows?.map(rowToDestination);
  return fromD1 && fromD1.length > 0 ? fromD1 : FALLBACK_DESTINATIONS;
});

export async function getDestination(slug: string): Promise<Destination | undefined> {
  const all = await getDestinations();
  return all.find((d) => d.slug === slug);
}

export async function getFeaturedDestinations(): Promise<Destination[]> {
  const all = await getDestinations();
  return all.filter((d) => d.featured);
}
