import { json, type Env } from "../types";
import { rowToApi as programRowToApi, type ProgramRow } from "../admin/_programs";

// Runtime search — deliberately NOT part of the build-time D1 client used by
// destinations.ts/universities.ts/programs.ts. Filtering thousands of
// programs can't ship as static JSON to every visitor, and results need to
// reflect admin edits immediately rather than waiting for a rebuild — see
// the audit's §07/§10. Uses the same `env.DB` binding offers.ts/apply.ts
// already use, no new infrastructure.

type SearchRow = ProgramRow & {
  university_name: string;
  country_slug: string;
  country_name: string;
  country_code: string;
  country_accent: string;
};

function csv(param: string | null): string[] {
  return param
    ? param
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
}

// Sanitize free text into a safe FTS5 query: strip everything but
// alphanumerics/spaces, then AND together a prefix match per word. Avoids
// ever handing raw user input to MATCH, which has its own query syntax
// (quotes, colons, hyphens-as-NOT) that would otherwise throw or, worse,
// silently mean something the user didn't type.
function ftsQuery(q: string): string | null {
  const words = q
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return null;
  return words.map((w) => `${w}*`).join(" AND ");
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const params = new URL(request.url).searchParams;

  const conditions = [`p.status = 'published'`, `u.status = 'published'`, `c.status = 'published'`];
  const bindings: unknown[] = [];

  const q = params.get("q")?.trim();
  if (q) {
    const fts = ftsQuery(q);
    if (fts) {
      conditions.push(`p.slug IN (SELECT slug FROM programs_fts WHERE programs_fts MATCH ?)`);
      bindings.push(fts);
    }
  }

  const countries = csv(params.get("country"));
  if (countries.length) {
    conditions.push(`c.slug IN (${countries.map(() => "?").join(",")})`);
    bindings.push(...countries);
  }

  const universities = csv(params.get("university"));
  if (universities.length) {
    conditions.push(`u.slug IN (${universities.map(() => "?").join(",")})`);
    bindings.push(...universities);
  }

  const degreeTypes = csv(params.get("degreeType"));
  if (degreeTypes.length) {
    conditions.push(`p.degree_type IN (${degreeTypes.map(() => "?").join(",")})`);
    bindings.push(...degreeTypes);
  }

  const fields = csv(params.get("fieldOfStudy"));
  if (fields.length) {
    conditions.push(`p.field_of_study IN (${fields.map(() => "?").join(",")})`);
    bindings.push(...fields);
  }

  const minTuition = params.get("minTuition");
  if (minTuition) {
    conditions.push(`p.tuition_per_year >= ?`);
    bindings.push(Number(minTuition));
  }
  const maxTuition = params.get("maxTuition");
  if (maxTuition) {
    conditions.push(`p.tuition_per_year <= ?`);
    bindings.push(Number(maxTuition));
  }

  const minDuration = params.get("minDuration");
  if (minDuration) {
    conditions.push(`p.duration_months >= ?`);
    bindings.push(Number(minDuration));
  }
  const maxDuration = params.get("maxDuration");
  if (maxDuration) {
    conditions.push(`p.duration_months <= ?`);
    bindings.push(Number(maxDuration));
  }

  const maxIelts = params.get("maxIelts");
  if (maxIelts) {
    conditions.push(`(p.min_ielts IS NULL OR p.min_ielts <= ?)`);
    bindings.push(Number(maxIelts));
  }

  if (params.get("scholarship") === "1") {
    conditions.push(`json_array_length(p.scholarships) > 0`);
  }

  const intakeMonths = csv(params.get("intakeMonth"));
  if (intakeMonths.length) {
    conditions.push(
      `EXISTS (SELECT 1 FROM program_intakes pi WHERE pi.program_slug = p.slug AND pi.status = 'open' AND pi.month IN (${intakeMonths
        .map(() => "?")
        .join(",")}))`
    );
    bindings.push(...intakeMonths);
  }

  const workRights = csv(params.get("workRights"));
  if (workRights.length) {
    conditions.push(`c.work_rights IN (${workRights.map(() => "?").join(",")})`);
    bindings.push(...workRights);
  }

  const visaProcessing = csv(params.get("visaProcessing"));
  if (visaProcessing.length) {
    conditions.push(`c.visa_processing IN (${visaProcessing.map(() => "?").join(",")})`);
    bindings.push(...visaProcessing);
  }

  const page = Math.max(1, Number(params.get("page")) || 1);
  const limit = Math.min(48, Math.max(1, Number(params.get("limit")) || 12));
  const offset = (page - 1) * limit;

  const where = conditions.join(" AND ");
  const fromJoin = `FROM programs p JOIN universities u ON u.slug = p.university_slug JOIN countries c ON c.slug = u.country_slug WHERE ${where}`;

  const countRow = await env.DB.prepare(`SELECT COUNT(*) as n ${fromJoin}`)
    .bind(...bindings)
    .first<{ n: number }>();

  const { results } = await env.DB.prepare(
    `SELECT p.*, u.name AS university_name, c.slug AS country_slug, c.name AS country_name, c.code AS country_code, c.accent AS country_accent
     ${fromJoin}
     ORDER BY p.name
     LIMIT ? OFFSET ?`
  )
    .bind(...bindings, limit, offset)
    .all<SearchRow>();

  const items = results.map((row) => ({
    ...programRowToApi(row),
    universityName: row.university_name,
    countrySlug: row.country_slug,
    countryName: row.country_name,
    countryCode: row.country_code,
    countryAccent: row.country_accent,
  }));

  return json({ results: items, total: countRow?.n ?? 0, page, limit });
};
