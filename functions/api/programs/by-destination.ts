import { json, type Env } from "../types";

// Powers the Apply form's dependent Program dropdown — deliberately a
// runtime D1 query (same reasoning as programs/facets.ts and search.ts:
// results must reflect admin edits immediately, no rebuild), rather than
// the site's usual build-time queryD1() pattern used for static pages.
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const destination = url.searchParams.get("destination")?.trim();

  if (!destination) return json({ programs: [] });

  const { results } = await env.DB.prepare(
    `SELECT p.slug, p.name, p.degree_type, u.slug AS university_slug, u.name AS university_name
     FROM programs p
     JOIN universities u ON u.slug = p.university_slug
     JOIN countries c ON c.slug = u.country_slug
     WHERE p.status = 'published' AND u.status = 'published' AND c.status = 'published'
       AND c.slug = ?
     ORDER BY u.name, p.name`
  )
    .bind(destination)
    .all<{ slug: string; name: string; degree_type: string | null; university_slug: string; university_name: string }>();

  return json({
    programs: results.map((r) => ({
      slug: r.slug,
      name: r.name,
      degreeType: r.degree_type,
      universitySlug: r.university_slug,
      universityName: r.university_name,
    })),
  });
};
