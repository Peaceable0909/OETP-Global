# Competence & Business Services — Website

Marketing + lead-generation platform for an international education and career consultancy.
Built to match the approved purple/violet design mockup: photo-rich destination cards,
hot-offer countdowns, AI-advisor teaser, and an application form with document uploads.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind v4) — static export (`output: "export"`)
- **React Bits** components (`src/components/reactbits/`) — SplitText, Particles, SpotlightCard, GlareHover
- **Cloudflare Pages** — hosting + Pages Functions (`functions/api/`)
- **Cloudflare D1** — database `competence-db` (applications, documents, offers, leads)
- **Cloudflare R2** — document uploads bucket `competence-documents` (**pending: enable R2 in the Cloudflare dashboard**, then uncomment the binding in `wrangler.toml`)

## Local development

```bash
npm install
npm run build                                            # static export to out/
npx wrangler d1 execute competence-db --local --file=./schema.sql   # once, seeds local D1
npx wrangler pages dev --port 8788                       # serves out/ + API functions
```

For UI-only iteration `npm run dev` works too, but `/api/*` won't exist — the offers
sections fall back to the bundled seed data in `src/lib/offers.ts`.

## Deploy

```bash
npm run build
npx wrangler pages deploy out
```

## API (Pages Functions)

- `GET /api/offers` — active, unexpired hot-cake offers from D1
- `POST /api/apply` — multipart form; inserts application, uploads documents to R2,
  returns generated Application ID (`CBS-XXXXXX`)
- `POST /api/lead` — JSON contact/lead capture

## Content to replace before launch

- WhatsApp / Telegram / email placeholders in `src/lib/data/site.ts`
- Tuition figures & program lists in `src/lib/data/destinations.ts` (boss to confirm)
- Job openings in `src/app/jobs/page.tsx`
- Testimonials in `src/lib/data/site.ts` (currently illustrative)
- Unsplash photos → real company/destination photos when available

## Managing hot-cake offers

Offers live in the D1 `offers` table. Add a row and it appears on the site (ticker,
Trending Now, destination banner) — no redeploy needed:

```sql
INSERT INTO offers (slug, title, destination, tagline, badge, total_spots, spots_taken, expires_at, active)
VALUES ('my-offer', 'Title', 'cyprus', 'One-liner', 'HOT', NULL, 0, '2026-10-01T00:00:00Z', 1);
```

Keep `src/lib/offers.ts` `fallbackOffers` roughly in sync — it's what renders if the API
is unreachable.
