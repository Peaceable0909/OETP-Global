-- Admin panel schema additions for competence-db (D1).
-- For local dev: npx wrangler d1 execute competence-db --local --file=./schema_admin.sql
-- For production: npx wrangler d1 execute competence-db --remote --file=./schema_admin.sql

CREATE TABLE IF NOT EXISTS countries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  tagline TEXT,
  hero_gradient TEXT,
  accent TEXT,
  photo TEXT,
  summary TEXT,
  capital TEXT,
  language TEXT,
  currency TEXT,
  intake_months TEXT,
  visa_processing TEXT,
  program_length TEXT,
  tuition_from TEXT,
  work_rights TEXT,
  featured INTEGER NOT NULL DEFAULT 0,
  highlights TEXT NOT NULL DEFAULT '[]',
  programs TEXT NOT NULL DEFAULT '[]',
  visa_steps TEXT NOT NULL DEFAULT '[]',
  requirements TEXT NOT NULL DEFAULT '[]',
  documents TEXT NOT NULL DEFAULT '[]',
  faqs TEXT NOT NULL DEFAULT '[]',
  specializations TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL,
  last_seen_at TEXT
);

CREATE TABLE IF NOT EXISTS admin_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  r2_key TEXT UNIQUE NOT NULL,
  kind TEXT NOT NULL,
  country_slug TEXT,
  uploaded_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_countries_status ON countries(status);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON admin_sessions(expires_at);
