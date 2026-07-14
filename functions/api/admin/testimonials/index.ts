import { json, type Env } from "../../types";
import { requireAdmin } from "../_auth";
import { rowToApi, validateTestimonialInput, bindingsForInsert, type TestimonialRow, type TestimonialInput } from "../_testimonials";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  const { results } = await env.DB.prepare(
    `SELECT * FROM testimonials ORDER BY sort_order, name`
  ).all<TestimonialRow>();

  return json({ testimonials: results.map(rowToApi) });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, 401);

  let input: TestimonialInput;
  try {
    input = await request.json();
  } catch {
    return json({ error: "Expected JSON body" }, 400);
  }

  const error = validateTestimonialInput(input, true);
  if (error) return json({ error }, 400);

  const existing = await env.DB.prepare(`SELECT id FROM testimonials WHERE slug = ?`)
    .bind(input.slug)
    .first();
  if (existing) return json({ error: "A story with this slug already exists." }, 409);

  await env.DB.prepare(
    `INSERT INTO testimonials (slug, name, destination, text, photo, featured, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(...bindingsForInsert(input))
    .run();

  const row = await env.DB.prepare(`SELECT * FROM testimonials WHERE slug = ?`)
    .bind(input.slug)
    .first<TestimonialRow>();

  return json({ testimonial: row ? rowToApi(row) : null }, 201);
};
