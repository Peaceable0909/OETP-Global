import { json, type Env } from "../types";
import { rowToApi, type CountryRow } from "../admin/_countries";

export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  const slug = String(params.slug);
  const row = await env.DB.prepare(
    `SELECT * FROM countries WHERE slug = ? AND status = 'published'`
  )
    .bind(slug)
    .first<CountryRow>();

  if (!row) return json({ error: "Not found" }, 404);
  return json({ destination: rowToApi(row) });
};
