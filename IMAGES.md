# Adding your own photos (no code needed)

Every photo on the site points at a fixed path under `public/images/`. Until a real
file exists there, that spot shows a clean branded placeholder — nothing looks broken.
The moment you upload a real photo to the **exact path and filename** below, it
replaces the placeholder on the next deploy automatically.

## How to upload (GitHub web UI, no local setup)

1. Open the repo on github.com and browse into the matching folder below (or use
   **Add file → Upload files** from the repo root — GitHub lets you type the full
   path, e.g. `public/images/destinations/albania/hero.jpg`, and it creates any
   missing folders for you).
2. Drag your photo in. **The filename must match exactly** (including `.jpg`).
3. Commit directly to `main` (or open a PR if you want review first).
4. Cloudflare Pages redeploys automatically — check the live site in ~1–2 minutes.

Use `.jpg` for all of these (convert PNG/HEIC first — any online converter works).
Recommended size: 1600px wide max, under 500KB, landscape orientation unless noted.

## Required paths

**Destination hero photos** (top banner of each country page + cards):
```
public/images/destinations/albania/hero.jpg
public/images/destinations/cyprus/hero.jpg
public/images/destinations/malaysia/hero.jpg
public/images/destinations/cambodia/hero.jpg
```

**Albania culinary specialization photos** (4 small cards on the Albania page):
```
public/images/specializations/culinary-arts.jpg
public/images/specializations/pastry-baking.jpg
public/images/specializations/international-cuisine.jpg
public/images/specializations/food-beverage.jpg
```

**Homepage hero scene** (the photo cards floating next to the globe):
```
public/images/hero/graduate.jpg
public/images/hero/city.jpg
```

**Student testimonials** (add one per real testimonial you send us — filename is
the student's first name, lowercase, no spaces):
```
public/images/testimonials/chinedu.jpg
public/images/testimonials/aisha.jpg
public/images/testimonials/tunde.jpg
public/images/testimonials/blessing.jpg
public/images/testimonials/ibrahim.jpg
```

If you send real student names/quotes/photos to replace the current placeholder
testimonial text, tell Claude and it'll update `src/lib/data/site.ts` to match —
that part does need a code change since it's text, not just an image.
