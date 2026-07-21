import { json, type Env } from "../types";

// Reports which filter values actually exist in published data right now,
// so the search UI never shows a filter section with nothing real behind it
// (most numeric/categorical program fields are still empty until an admin
// fills them in via /admin/programs/ — see the Phase 6 migration notes).
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const base = `FROM programs p JOIN universities u ON u.slug = p.university_slug JOIN countries c ON c.slug = u.country_slug WHERE p.status = 'published' AND u.status = 'published' AND c.status = 'published'`;

  const [
    countries,
    universities,
    degreeTypes,
    fieldsOfStudy,
    tuition,
    duration,
    ielts,
    intakeMonths,
    workRights,
    visaProcessing,
    hasScholarships,
  ] = await Promise.all([
    env.DB.prepare(`SELECT DISTINCT c.slug, c.name ${base} ORDER BY c.name`).all<{ slug: string; name: string }>(),
    env.DB.prepare(`SELECT DISTINCT u.slug, u.name, c.slug AS country_slug ${base} ORDER BY u.name`).all<{
      slug: string;
      name: string;
      country_slug: string;
    }>(),
    env.DB.prepare(
      `SELECT DISTINCT p.degree_type AS v ${base} AND p.degree_type IS NOT NULL AND p.degree_type != '' ORDER BY v`
    ).all<{ v: string }>(),
    env.DB.prepare(
      `SELECT DISTINCT p.field_of_study AS v ${base} AND p.field_of_study IS NOT NULL AND p.field_of_study != '' ORDER BY v`
    ).all<{ v: string }>(),
    env.DB.prepare(`SELECT MIN(p.tuition_per_year) AS min, MAX(p.tuition_per_year) AS max ${base} AND p.tuition_per_year IS NOT NULL`).first<{
      min: number | null;
      max: number | null;
    }>(),
    env.DB.prepare(`SELECT MIN(p.duration_months) AS min, MAX(p.duration_months) AS max ${base} AND p.duration_months IS NOT NULL`).first<{
      min: number | null;
      max: number | null;
    }>(),
    env.DB.prepare(`SELECT MIN(p.min_ielts) AS min, MAX(p.min_ielts) AS max ${base} AND p.min_ielts IS NOT NULL`).first<{
      min: number | null;
      max: number | null;
    }>(),
    env.DB.prepare(
      `SELECT DISTINCT pi.month AS v
       FROM program_intakes pi
       JOIN programs p ON p.slug = pi.program_slug
       JOIN universities u ON u.slug = p.university_slug
       JOIN countries c ON c.slug = u.country_slug
       WHERE pi.status = 'open' AND p.status = 'published' AND u.status = 'published' AND c.status = 'published'
       ORDER BY v`
    ).all<{ v: string }>(),
    env.DB.prepare(
      `SELECT DISTINCT c.work_rights AS v ${base} AND c.work_rights IS NOT NULL AND c.work_rights != '' ORDER BY v`
    ).all<{ v: string }>(),
    env.DB.prepare(
      `SELECT DISTINCT c.visa_processing AS v ${base} AND c.visa_processing IS NOT NULL AND c.visa_processing != '' ORDER BY v`
    ).all<{ v: string }>(),
    env.DB.prepare(`SELECT EXISTS(SELECT 1 ${base} AND json_array_length(p.scholarships) > 0) AS v`).first<{ v: number }>(),
  ]);

  return json({
    countries: countries.results,
    universities: universities.results.map((u) => ({ slug: u.slug, name: u.name, countrySlug: u.country_slug })),
    degreeTypes: degreeTypes.results.map((r) => r.v),
    fieldsOfStudy: fieldsOfStudy.results.map((r) => r.v),
    tuitionRange: tuition,
    durationRange: duration,
    ieltsRange: ielts,
    intakeMonths: intakeMonths.results.map((r) => r.v),
    workRights: workRights.results.map((r) => r.v),
    visaProcessing: visaProcessing.results.map((r) => r.v),
    hasScholarships: !!hasScholarships?.v,
  });
};
