-- Campus/location (for universities with multiple campuses) and a simple
-- intake-months list (month names only, no year — see program_intakes for
-- dated/deadline-bearing intakes, which need a year the source PDF rarely
-- states).
-- Local:      npx wrangler d1 execute competence-db --local --file=./schema_programs_campus_intakes.sql
-- Production: apply via the Cloudflare D1 MCP tool (parameterized) or --remote
ALTER TABLE programs ADD COLUMN campus TEXT;
ALTER TABLE programs ADD COLUMN intake_months TEXT NOT NULL DEFAULT '[]';
