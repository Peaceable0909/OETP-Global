-- One-time migration: seeds the 4 countries that previously lived in
-- src/lib/data/destinations.ts into the new `countries` D1 table, as
-- status='published' so nothing changes on the public site when the
-- switch to database-backed destinations goes live.
--
-- Local:      npx wrangler d1 execute competence-db --local --file=./scripts/seed-destinations.sql
-- Production: apply via the Cloudflare D1 MCP tool (parameterized) or
--             npx wrangler d1 execute competence-db --remote --file=./scripts/seed-destinations.sql
-- Safe to re-run: uses INSERT OR IGNORE keyed on the unique `slug` column.

INSERT OR IGNORE INTO countries (
  slug, name, code, tagline, hero_gradient, accent, photo, summary, capital, language,
  currency, intake_months, visa_processing, program_length, tuition_from, work_rights,
  featured, highlights, programs, visa_steps, requirements, documents, faqs, specializations, status
) VALUES
(
  'albania', 'Albania', 'AL', 'One-Year Culinary Program',
  'from-red-700 via-red-600 to-rose-500', '#DC2626', '/images/destinations/albania/hero.jpg',
  'Albania''s one-year culinary program is our hottest offer: no age limit, morning-only classes so you have the whole afternoon to work, job support after graduation, and a clear pathway to bring your family once you secure employment.',
  'Tirana', 'Albanian (programs taught in English)', 'Euro (€) accepted widely',
  'Jan, May, Sep', '2 – 4 weeks', '1 year', '€2,800 / year',
  'Work while you study — classes are mornings only', 1,
  '["No age requirement — anyone can apply","Short 1-year program","Morning classes only, afternoons free to work","Job placement support after graduation","Bring family members once you secure work (after studies)","Admissions currently open"]',
  '[{"name":"Culinary Arts","length":"1 year","note":"Hands-on professional kitchen training"},{"name":"Pastry & Baking","length":"1 year","note":"Specialization track"},{"name":"Food & Beverage Management","length":"1 year","note":"Hospitality-focused"}]',
  '[{"title":"Apply online","detail":"Fill our application form and upload your documents."},{"title":"Admission letter","detail":"We process your admission with the culinary school."},{"title":"Visa application","detail":"We guide you through the straightforward Albanian student visa."},{"title":"Fly to Tirana","detail":"Arrival support, accommodation guidance and orientation."}]',
  '["No age limit","Secondary school completion","Basic English communication","Valid international passport"]',
  '["International passport","Secondary school certificate","Passport photograph","CV / Resume"]',
  '[{"q":"Is there an age limit?","a":"No. The Albania culinary program has no age requirement — this is one of its biggest advantages."},{"q":"Can I work while studying?","a":"Yes. Classes run in the mornings only, leaving your afternoons and evenings free to work."},{"q":"Can my family join me?","a":"Family reunification is possible once you secure employment after your studies — not during the study period."},{"q":"How long is the program?","a":"Just one year, after which you receive an internationally recognized certificate and job placement support."}]',
  '[{"name":"Culinary Arts","photo":"/images/specializations/culinary-arts.jpg"},{"name":"Pastry & Baking","photo":"/images/specializations/pastry-baking.jpg"},{"name":"International Cuisine","photo":"/images/specializations/international-cuisine.jpg"},{"name":"Food & Beverage Mgmt","photo":"/images/specializations/food-beverage.jpg"}]',
  'published'
),
(
  'cyprus', 'Cyprus', 'CY', 'Straightforward Visa, EU-Standard Education',
  'from-sky-700 via-sky-600 to-cyan-500', '#0284C7', '/images/destinations/cyprus/hero.jpg',
  'Cyprus combines a genuinely straightforward student visa process with EU-standard education, English-taught programs, and the right to work while you study — one of the most reliable routes for African students.',
  'Nicosia', 'Greek / English-taught programs', 'Euro (€)',
  'Feb, Jun, Oct', '4 – 6 weeks', '1 – 4 years', '€3,200 / year',
  'Part-time work permitted for students', 1,
  '["Visa process is straightforward with high success rates","English-taught programs","Work while you study","EU-standard education and lifestyle","Admissions currently open"]',
  '[{"name":"Nursing & Health Sciences","length":"3 – 4 years","note":"High demand pathway"},{"name":"Business Administration","length":"3 – 4 years","note":"Bachelor & Masters"},{"name":"Hospitality & Tourism","length":"2 – 3 years","note":"Strong local industry"},{"name":"Foundation / Pathway","length":"1 year","note":"Entry route without IELTS"}]',
  '[{"title":"Apply online","detail":"Submit the application form with your academic documents."},{"title":"University admission","detail":"We secure your admission letter from a partner institution."},{"title":"Visa processing","detail":"Document guidance and embassy submission support end-to-end."},{"title":"Travel & arrival","detail":"Pre-departure briefing and arrival support in Cyprus."}]',
  '["Secondary school certificate (WAEC/NECO accepted)","Valid international passport","English proficiency (IELTS not always required)","Proof of funds guidance provided"]',
  '["International passport","Academic certificates","Transcripts","Passport photograph","CV / Resume"]',
  '[{"q":"Do I need IELTS?","a":"Not always — many partner institutions accept alternative proof of English or an internal test. We advise you based on your profile."},{"q":"Can I work while studying?","a":"Yes, students can work part-time in permitted sectors."},{"q":"How long does the visa take?","a":"Typically 4–6 weeks once your documents are complete."}]',
  '[]',
  'published'
),
(
  'malaysia', 'Malaysia', 'MY', 'Affordable, English-Taught, Post-Study Options',
  'from-indigo-700 via-blue-600 to-sky-500', '#4F46E5', '/images/destinations/malaysia/hero.jpg',
  'Malaysia offers globally ranked universities at a fraction of Western costs, fully English-taught programs, a large international student community, and post-study work options.',
  'Kuala Lumpur', 'Malay / English-taught programs', 'Ringgit (RM)',
  'Jan, May, Sep', '3 – 6 weeks', '1 – 4 years', '$2,800 / year',
  'Part-time work during semester breaks', 1,
  '["Affordable tuition and living costs","English is widely spoken","Globally ranked universities","Post-study work options","Large African student community"]',
  '[{"name":"Business & Management","length":"3 years","note":"Bachelor & Masters"},{"name":"Information Technology","length":"3 years","note":"Strong tech job market"},{"name":"Engineering","length":"4 years","note":"Internationally accredited"},{"name":"Foundation Programs","length":"1 year","note":"Pathway to degree"}]',
  '[{"title":"Apply online","detail":"Submit your application and academic documents."},{"title":"University offer","detail":"We obtain your offer letter and EMGS approval."},{"title":"Visa approval letter","detail":"Student pass processed before you travel."},{"title":"Fly to Malaysia","detail":"Airport clearance and arrival support."}]',
  '["Secondary school certificate","Valid international passport","Academic transcripts","English proficiency (flexible options)"]',
  '["International passport","Academic certificates","Transcripts","Passport photograph"]',
  '[{"q":"Is Malaysia affordable?","a":"Yes — tuition and living costs are among the lowest for the quality of education offered."},{"q":"Are programs in English?","a":"Yes, international programs are fully English-taught."}]',
  '[]',
  'published'
),
(
  'cambodia', 'Cambodia', 'KH', 'Fast Admissions, Emerging Opportunity',
  'from-violet-700 via-purple-600 to-fuchsia-500', '#7C3AED', '/images/destinations/cambodia/hero.jpg',
  'Cambodia is an emerging destination with fast admissions, low costs, English-taught programs and a growing economy full of opportunity in hospitality and business.',
  'Phnom Penh', 'Khmer / English-taught programs', 'US Dollar ($) widely used',
  'Rolling admissions', '2 – 4 weeks', '1 – 4 years', '$2,500 / year',
  'Work opportunities available', 1,
  '["Fast, simple admissions","English-taught programs","Very low living costs","US Dollar economy","Growing hospitality and business sectors"]',
  '[{"name":"Hospitality Management","length":"2 – 3 years","note":"Booming tourism sector"},{"name":"Business Administration","length":"3 years","note":"English-taught"},{"name":"International Relations","length":"3 years","note":"Regional hub"}]',
  '[{"title":"Apply online","detail":"Simple application with basic documents."},{"title":"Admission letter","detail":"Fast processing with partner institutions."},{"title":"Visa on arrival / e-visa","detail":"One of the simplest visa routes available."},{"title":"Arrival support","detail":"Accommodation and orientation assistance."}]',
  '["Secondary school certificate","Valid international passport","Basic English"]',
  '["International passport","Academic certificates","Passport photograph"]',
  '[{"q":"How fast is admission?","a":"Cambodia has rolling admissions — processing can complete in as little as 2 weeks."},{"q":"Is it affordable?","a":"Yes, both tuition and living costs are very low, and the economy uses US dollars."}]',
  '[]',
  'published'
);
