-- Phase 5 schema additions: Universities & Programs as first-class entities
-- (Country → University → Program → Apply). Previously a "program" was only
-- a nested JSON array item on `countries` — see scripts/migrate-universities-seed.sql
-- for the one-time backfill that turns existing embedded programs into real rows here.
-- Local:      npx wrangler d1 execute competence-db --local --file=./schema_universities.sql
-- Production: apply via the Cloudflare D1 MCP tool (parameterized) or --remote

CREATE TABLE IF NOT EXISTS universities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  country_slug TEXT NOT NULL REFERENCES countries(slug),
  name TEXT NOT NULL,
  city TEXT,
  tagline TEXT,
  hero_photo TEXT,
  ranking_national INTEGER,
  ranking_world INTEGER,
  founded_year INTEGER,
  student_population INTEGER,
  international_student_pct REAL,
  campus_type TEXT,
  gallery TEXT NOT NULL DEFAULT '[]',
  video_url TEXT,
  accreditations TEXT NOT NULL DEFAULT '[]',
  accommodation_summary TEXT,
  accommodation_cost_range TEXT,
  student_life TEXT NOT NULL DEFAULT '[]',
  faqs TEXT NOT NULL DEFAULT '[]',
  featured INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS programs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  university_slug TEXT NOT NULL REFERENCES universities(slug),
  name TEXT NOT NULL,
  overview TEXT,
  photo TEXT,
  degree_type TEXT,
  field_of_study TEXT,
  duration_months INTEGER,
  tuition_per_year REAL,
  application_fee REAL,
  deposit REAL,
  currency TEXT NOT NULL DEFAULT 'USD',
  entry_requirements TEXT NOT NULL DEFAULT '[]',
  min_gpa REAL,
  min_ielts REAL,
  min_toefl INTEGER,
  required_documents TEXT NOT NULL DEFAULT '[]',
  modules TEXT NOT NULL DEFAULT '[]',
  career_prospects TEXT NOT NULL DEFAULT '[]',
  scholarships TEXT NOT NULL DEFAULT '[]',
  faqs TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS program_intakes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  program_slug TEXT NOT NULL REFERENCES programs(slug),
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  deadline TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS university_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  university_slug TEXT NOT NULL REFERENCES universities(slug),
  author TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_universities_country ON universities(country_slug);
CREATE INDEX IF NOT EXISTS idx_universities_status ON universities(status);
CREATE INDEX IF NOT EXISTS idx_programs_university ON programs(university_slug);
CREATE INDEX IF NOT EXISTS idx_programs_status ON programs(status);
CREATE INDEX IF NOT EXISTS idx_programs_degree_type ON programs(degree_type);
CREATE INDEX IF NOT EXISTS idx_intakes_program ON program_intakes(program_slug);
CREATE INDEX IF NOT EXISTS idx_intakes_status ON program_intakes(status);
CREATE INDEX IF NOT EXISTS idx_reviews_university ON university_reviews(university_slug);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON university_reviews(status);

-- Search index (Phase 7 will read this from a runtime Functions API, not the
-- build-time D1 client — see the audit's §07/§10). Stores its own copy of the
-- fields it indexes rather than referencing `programs` as external content,
-- so a plain INSERT/UPDATE/DELETE keeps it in sync via the triggers below —
-- no separate rebuild step.
CREATE VIRTUAL TABLE IF NOT EXISTS programs_fts USING fts5(
  slug UNINDEXED,
  name,
  field_of_study,
  university_name,
  country_slug UNINDEXED
);

CREATE TRIGGER IF NOT EXISTS programs_fts_ai AFTER INSERT ON programs BEGIN
  INSERT INTO programs_fts (slug, name, field_of_study, university_name, country_slug)
  SELECT NEW.slug, NEW.name, NEW.field_of_study, u.name, u.country_slug
  FROM universities u WHERE u.slug = NEW.university_slug;
END;

CREATE TRIGGER IF NOT EXISTS programs_fts_ad AFTER DELETE ON programs BEGIN
  DELETE FROM programs_fts WHERE slug = OLD.slug;
END;

CREATE TRIGGER IF NOT EXISTS programs_fts_au AFTER UPDATE ON programs BEGIN
  DELETE FROM programs_fts WHERE slug = OLD.slug;
  INSERT INTO programs_fts (slug, name, field_of_study, university_name, country_slug)
  SELECT NEW.slug, NEW.name, NEW.field_of_study, u.name, u.country_slug
  FROM universities u WHERE u.slug = NEW.university_slug;
END;

-- Keep the denormalized university_name in programs_fts correct when a
-- university is renamed, without needing to touch every program row.
CREATE TRIGGER IF NOT EXISTS universities_au_name AFTER UPDATE OF name ON universities
WHEN OLD.name IS NOT NEW.name
BEGIN
  UPDATE programs_fts SET university_name = NEW.name
  WHERE slug IN (SELECT slug FROM programs WHERE university_slug = NEW.slug);
END;
