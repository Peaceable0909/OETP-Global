-- Adds a long-form description field to universities (programs already have
-- this via the `overview` column). Nullable, no default.
-- Local:      npx wrangler d1 execute competence-db --local --file=./schema_universities_description.sql
-- Production: apply via the Cloudflare D1 MCP tool (parameterized) or --remote
ALTER TABLE universities ADD COLUMN description TEXT;
