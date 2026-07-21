-- Phase 9 addition: track whether outbound applicant emails actually went
-- out, for admin-facing visibility. Not a hard idempotency mechanism (the
-- status-email de-dupe logic lives in functions/api/admin/applications/[id].ts,
-- comparing previous vs. new status before sending) — just bookkeeping.
-- Local:      npx wrangler d1 execute competence-db --local --file=./schema_applications_notifications.sql
-- Production: apply via the Cloudflare D1 MCP tool (parameterized) or --remote

ALTER TABLE applications ADD COLUMN confirmation_sent_at TEXT;
ALTER TABLE applications ADD COLUMN last_status_email_at TEXT;
