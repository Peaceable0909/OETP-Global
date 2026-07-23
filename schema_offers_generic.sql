-- The offers table only ever modeled one narrow shape: "first N students pay
-- €0 instead of €X" — WaiverBanner and OfferCard both hardcode that exact
-- narrative in JSX regardless of what the offer actually is. This adds the
-- fields needed to represent other real offer shapes (e.g. a flat tuition
-- discount with a deadline, free-accommodation perks, a popular-programs
-- list) without any of it being fee-waiver-specific.
-- Local:      npx wrangler d1 execute competence-db --local --file=./schema_offers_generic.sql
-- Production: apply via the Cloudflare D1 MCP tool (parameterized) or --remote
ALTER TABLE offers ADD COLUMN discount_label TEXT;
ALTER TABLE offers ADD COLUMN original_price REAL;
ALTER TABLE offers ADD COLUMN discounted_price REAL;
ALTER TABLE offers ADD COLUMN price_currency TEXT NOT NULL DEFAULT 'USD';
ALTER TABLE offers ADD COLUMN perks TEXT NOT NULL DEFAULT '[]';
ALTER TABLE offers ADD COLUMN popular_programs TEXT NOT NULL DEFAULT '[]';
ALTER TABLE offers ADD COLUMN cta_note TEXT;
