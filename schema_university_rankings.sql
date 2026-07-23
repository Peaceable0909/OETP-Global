-- Replaces the rigid ranking_national/ranking_world pair with a flexible
-- list of {label, value} rankings — a university's most meaningful rank is
-- often regional (e.g. "#250 in Asia"), which the old two fixed columns had
-- nowhere to put (Shinawatra University's Asia rank ended up mislabeled into
-- ranking_world as a workaround). The old columns are left in place
-- (unused, harmless) rather than dropped — SQLite DROP COLUMN is avoidable
-- risk for zero benefit here.
-- Local:      npx wrangler d1 execute competence-db --local --file=./schema_university_rankings.sql
-- Production: apply via the Cloudflare D1 MCP tool (parameterized) or --remote
ALTER TABLE universities ADD COLUMN rankings TEXT NOT NULL DEFAULT '[]';
