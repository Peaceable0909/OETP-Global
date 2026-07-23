-- Key Points (bullets for the new "About University" section) and a proper
-- multi-video list (campus tour, student interviews, etc.), each with its
-- own title. Supersedes the single unused `video_url` column, which is left
-- in place rather than dropped (harmless, never read after this migration).
-- Local:      npx wrangler d1 execute competence-db --local --file=./schema_universities_about_videos.sql
-- Production: apply via the Cloudflare D1 MCP tool (parameterized) or --remote
ALTER TABLE universities ADD COLUMN key_points TEXT NOT NULL DEFAULT '[]';
ALTER TABLE universities ADD COLUMN videos TEXT NOT NULL DEFAULT '[]';
