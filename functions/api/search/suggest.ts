import { json, type Env } from "../types";

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
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  const fts = ftsQuery(q);
  if (!fts) return json({ suggestions: [] });

  // FTS5's whole-table MATCH only works against the table's real name, not an
  // alias — matching it through a JOIN alias throws "no such column" at
  // runtime (caught while testing this locally). Matching in a subquery
  // against the unaliased table, same as programs/search.ts, sidesteps that.
  const { results } = await env.DB.prepare(
    `SELECT p.slug, p.name, u.slug AS university_slug, u.name AS university_name, c.slug AS country_slug
     FROM programs p
     JOIN universities u ON u.slug = p.university_slug
     JOIN countries c ON c.slug = u.country_slug
     WHERE p.slug IN (SELECT slug FROM programs_fts WHERE programs_fts MATCH ?)
       AND p.status = 'published' AND u.status = 'published' AND c.status = 'published'
     ORDER BY p.name
     LIMIT 5`
  )
    .bind(fts)
    .all<{ slug: string; name: string; university_slug: string; university_name: string; country_slug: string }>();

  return json({ suggestions: results });
};
