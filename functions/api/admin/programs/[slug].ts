import { json, type Env } from "../../types";
import { requireAdmin } from "../_auth";
import { rowToApi, validateProgramInput, bindingsForUpdate, type ProgramRow, type ProgramInput } from "../_programs";

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  const slug = String(params.slug);
  const row = await env.DB.prepare(`SELECT * FROM programs WHERE slug = ?`).bind(slug).first<ProgramRow>();

  if (!row) return json({ error: "Not found" }, 404);
  return json({ program: rowToApi(row) });
};

export const onRequestPut: PagesFunction<Env> = async ({ request, env, params }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  const slug = String(params.slug);
  const existing = await env.DB.prepare(`SELECT id FROM programs WHERE slug = ?`).bind(slug).first();
  if (!existing) return json({ error: "Not found" }, 404);

  let input: ProgramInput;
  try {
    input = await request.json();
  } catch {
    return json({ error: "Expected JSON body" }, 400);
  }

  const error = validateProgramInput(input, false);
  if (error) return json({ error }, 400);

  const existingUniversity = await env.DB.prepare(`SELECT slug FROM universities WHERE slug = ?`)
    .bind(input.universitySlug)
    .first();
  if (!existingUniversity) return json({ error: "That university doesn't exist." }, 400);

  await env.DB.prepare(
    `UPDATE programs SET
      university_slug = ?, name = ?, overview = ?, photo = ?, degree_type = ?, field_of_study = ?,
      campus = ?, intake_months = ?,
      duration_months = ?, tuition_per_year = ?, application_fee = ?, deposit = ?, currency = ?,
      entry_requirements = ?, min_gpa = ?, min_ielts = ?, min_toefl = ?, required_documents = ?,
      modules = ?, career_prospects = ?, scholarships = ?, faqs = ?,
      updated_at = datetime('now')
     WHERE slug = ?`
  )
    .bind(...bindingsForUpdate(input), slug)
    .run();

  const row = await env.DB.prepare(`SELECT * FROM programs WHERE slug = ?`).bind(slug).first<ProgramRow>();

  return json({ program: row ? rowToApi(row) : null });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  const slug = String(params.slug);
  const result = await env.DB.prepare(`DELETE FROM programs WHERE slug = ?`).bind(slug).run();

  if (!result.meta.changes) return json({ error: "Not found" }, 404);
  return json({ ok: true });
};
