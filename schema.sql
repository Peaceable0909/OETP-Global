-- Schema for competence-db (D1). Applied to production on 2026-07-13.
-- For local dev: npx wrangler d1 execute competence-db --local --file=./schema.sql

CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  destination TEXT NOT NULL,
  program TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS application_documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_id TEXT NOT NULL REFERENCES applications(id),
  doc_type TEXT NOT NULL,
  filename TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  size_bytes INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS offers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  tagline TEXT,
  badge TEXT,
  total_spots INTEGER,
  spots_taken INTEGER NOT NULL DEFAULT 0,
  expires_at TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  contact TEXT,
  channel TEXT NOT NULL DEFAULT 'web',
  destination_interest TEXT,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_documents_application ON application_documents(application_id);

INSERT OR IGNORE INTO offers (slug, title, destination, tagline, badge, total_spots, spots_taken, expires_at, active) VALUES
('albania-culinary-waiver', 'Albania Culinary Arts — Application Fee WAIVED', 'albania', 'First 10 students pay €0 instead of €300. No age limit, 1-year program, work while you study.', 'MOST POPULAR', 10, 3, '2026-08-15T23:59:59Z', 1),
('cyprus-admissions-open', 'Cyprus Admissions Now Open', 'cyprus', 'Straightforward visa process, high success rate, work while you study.', 'HOT', NULL, 0, '2026-09-01T23:59:59Z', 1),
('malaysia-business-it', 'Malaysia Business & IT Intake', 'malaysia', 'Affordable tuition, post-study work options, English-taught programs.', 'NEW', NULL, 0, '2026-09-15T23:59:59Z', 1),
('cambodia-hospitality', 'Cambodia Hospitality Management', 'cambodia', 'Fast admissions, clear pathway, English-taught.', 'TRENDING', NULL, 0, '2026-09-30T23:59:59Z', 1);
