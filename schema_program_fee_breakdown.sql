-- Year-by-year fee schedule (registration/management/tuition/total, in the
-- institution's own billing currency) per degree level a program is offered
-- at. Distinct from tuition_per_year (a single USD figure used for
-- cross-country search/facet filtering) — this is the rich, literal
-- breakdown a partner university actually bills, e.g. Shinawatra University's
-- 2026 international fee structure (THB, billed per year of study).
-- Local:      npx wrangler d1 execute competence-db --local --file=./schema_program_fee_breakdown.sql
-- Production: apply via the Cloudflare D1 MCP tool (parameterized) or --remote
ALTER TABLE programs ADD COLUMN fee_breakdown TEXT NOT NULL DEFAULT '[]';
