-- One-time backfill for Phase 5 (Country → University → Program → Apply).
-- Run this AFTER schema_universities.sql has been applied.
--
-- Every published country gets one placeholder university
-- ("<Country> — Partner Institutions", status='published' since this is
-- restructured *existing* live content, not a new draft), and every item in
-- that country's embedded `programs` JSON array becomes a real row in the
-- new `programs` table, pointed at the placeholder university. Nothing on
-- the live site changes yet — the country page still reads the old
-- `countries.programs` column until the Phase 6 swap ships — this just gets
-- the data into its new shape early so Phase 6 has something real to point
-- at on day one, with the exact same programs visible either way.
--
-- The old embedded program only ever had {name, length, note, tuition?,
-- photo?} — no degree_type/duration_months/tuition_per_year, so those stay
-- NULL rather than guessing; `length`/`tuition` are preserved as readable
-- text inside `overview` instead of being silently dropped. The admin
-- Universities/Programs editor (not built in this phase) is where a staff
-- member fills in the rest.
--
-- Slugs are a best-effort ASCII slugify (spaces/parens/commas/apostrophes
-- stripped, "&" -> "and") — good enough for the program names in production
-- today, but check for stray punctuation before relying on it for a name
-- with characters not seen here.
--
-- entry_requirements/required_documents seed from the *country's* existing
-- requirements/documents lists as a starting point (most partner programs
-- in a given country share the same baseline docs) — editable per program
-- later, not a permanent link.
--
-- Local:      npx wrangler d1 execute competence-db --local --file=./scripts/migrate-universities-seed.sql
-- Production: apply via the Cloudflare D1 MCP tool (parameterized) or
--             npx wrangler d1 execute competence-db --remote --file=./scripts/migrate-universities-seed.sql
-- Safe to re-run: every insert is INSERT OR IGNORE keyed on a deterministic slug.

INSERT OR IGNORE INTO universities (slug, country_slug, name, status)
SELECT
  c.slug || '-partner-institutions',
  c.slug,
  c.name || ' — Partner Institutions',
  'published'
FROM countries c
WHERE c.status = 'published';

INSERT OR IGNORE INTO programs (
  slug, university_slug, name, overview, photo, entry_requirements, required_documents, status
)
SELECT
  c.slug || '-partner-institutions-' ||
    lower(
      replace(replace(replace(replace(replace(replace(
        json_extract(je.value, '$.name'),
      ' & ', ' and '), ' ', '-'), '(', ''), ')', ''), ',', ''), '''', '')
    ),
  c.slug || '-partner-institutions',
  json_extract(je.value, '$.name'),
  TRIM(
    COALESCE(json_extract(je.value, '$.note'), '') ||
    CASE WHEN json_extract(je.value, '$.length') IS NOT NULL
         THEN ' (' || json_extract(je.value, '$.length') ||
              CASE WHEN json_extract(je.value, '$.tuition') IS NOT NULL
                   THEN ' · ' || json_extract(je.value, '$.tuition')
                   ELSE '' END
              || ')'
         ELSE '' END
  ),
  json_extract(je.value, '$.photo'),
  c.requirements,
  c.documents,
  'published'
FROM countries c, json_each(c.programs) je
WHERE c.status = 'published';
