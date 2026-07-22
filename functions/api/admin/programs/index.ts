import { json, type Env } from "../../types";
import { requireAdmin } from "../_auth";
import { rowToApi, validateProgramInput, bindingsForInsert, type ProgramRow, type ProgramInput } from "../_programs";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  const url = new URL(request.url);
  const universitySlug = url.searchParams.get("university");

  const { results } = universitySlug
    ? await env.DB.prepare(`SELECT * FROM programs WHERE university_slug = ? ORDER BY name`).bind(universitySlug).all<ProgramRow>()
    : await env.DB.prepare(`SELECT * FROM programs ORDER BY name`).all<ProgramRow>();

  return json({ programs: results.map(rowToApi) });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  let input: ProgramInput;
  try {
    input = await request.json();
  } catch {
    return json({ error: "Expected JSON body" }, 400);
  }

  const error = validateProgramInput(input, true);
  if (error) return json({ error }, 400);

  const existingUniversity = await env.DB.prepare(`SELECT slug FROM universities WHERE slug = ?`)
    .bind(input.universitySlug)
    .first();
  if (!existingUniversity) return json({ error: "That university doesn't exist." }, 400);

  const existing = await env.DB.prepare(`SELECT id FROM programs WHERE slug = ?`).bind(input.slug).first();
  if (existing) return json({ error: "A program with this slug already exists." }, 409);

  await env.DB.prepare(
    `INSERT INTO programs (
      slug, university_slug, name, overview, photo, degree_type, field_of_study,
      campus, intake_months,
      duration_months, tuition_per_year, application_fee, deposit, currency,
      entry_requirements, min_gpa, min_ielts, min_toefl, required_documents,
      modules, career_prospects, scholarships, faqs
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(...bindingsForInsert(input))
    .run();

  const row = await env.DB.prepare(`SELECT * FROM programs WHERE slug = ?`).bind(input.slug).first<ProgramRow>();

  return json({ program: row ? rowToApi(row) : null }, 201);
};
