// Shared shapes between the search hub, its filter rail, and the two
// runtime Functions endpoints they call (functions/api/programs/search.ts,
// functions/api/programs/facets.ts). Kept separate from src/lib/data/ since
// these are runtime-fetched (client-side), not the build-time D1 client.

export type SearchFacets = {
  countries: { slug: string; name: string }[];
  universities: { slug: string; name: string; countrySlug: string }[];
  degreeTypes: string[];
  fieldsOfStudy: string[];
  tuitionRange: { min: number | null; max: number | null };
  durationRange: { min: number | null; max: number | null };
  ieltsRange: { min: number | null; max: number | null };
  intakeMonths: string[];
  workRights: string[];
  visaProcessing: string[];
  hasScholarships: boolean;
};

export type FilterState = {
  q: string;
  country: string[];
  university: string[];
  degreeType: string[];
  fieldOfStudy: string[];
  minTuition: string;
  maxTuition: string;
  minDuration: string;
  maxDuration: string;
  maxIelts: string;
  scholarship: boolean;
  intakeMonth: string[];
  workRights: string[];
  visaProcessing: string[];
};

export function emptyFilters(): FilterState {
  return {
    q: "",
    country: [],
    university: [],
    degreeType: [],
    fieldOfStudy: [],
    minTuition: "",
    maxTuition: "",
    minDuration: "",
    maxDuration: "",
    maxIelts: "",
    scholarship: false,
    intakeMonth: [],
    workRights: [],
    visaProcessing: [],
  };
}

export function activeFilterCount(f: FilterState): number {
  return (
    f.country.length +
    f.university.length +
    f.degreeType.length +
    f.fieldOfStudy.length +
    f.intakeMonth.length +
    f.workRights.length +
    f.visaProcessing.length +
    (f.minTuition ? 1 : 0) +
    (f.maxTuition ? 1 : 0) +
    (f.minDuration ? 1 : 0) +
    (f.maxDuration ? 1 : 0) +
    (f.maxIelts ? 1 : 0) +
    (f.scholarship ? 1 : 0)
  );
}

export function filtersToQueryString(f: FilterState, page: number): string {
  const params = new URLSearchParams();
  if (f.q) params.set("q", f.q);
  if (f.country.length) params.set("country", f.country.join(","));
  if (f.university.length) params.set("university", f.university.join(","));
  if (f.degreeType.length) params.set("degreeType", f.degreeType.join(","));
  if (f.fieldOfStudy.length) params.set("fieldOfStudy", f.fieldOfStudy.join(","));
  if (f.minTuition) params.set("minTuition", f.minTuition);
  if (f.maxTuition) params.set("maxTuition", f.maxTuition);
  if (f.minDuration) params.set("minDuration", f.minDuration);
  if (f.maxDuration) params.set("maxDuration", f.maxDuration);
  if (f.maxIelts) params.set("maxIelts", f.maxIelts);
  if (f.scholarship) params.set("scholarship", "1");
  if (f.intakeMonth.length) params.set("intakeMonth", f.intakeMonth.join(","));
  if (f.workRights.length) params.set("workRights", f.workRights.join(","));
  if (f.visaProcessing.length) params.set("visaProcessing", f.visaProcessing.join(","));
  params.set("page", String(page));
  params.set("limit", "12");
  return params.toString();
}

export type SearchResultProgram = {
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
  universityName: string;
  countrySlug: string;
  countryName: string;
  countryCode: string;
  countryAccent: string;
};
