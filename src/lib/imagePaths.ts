// Canonical filenames for every photo slot on the site. Upload real photos to these
// exact paths under /public/images/ (see IMAGES.md) and they replace the placeholder
// automatically on the next deploy — no code changes needed.

export const destinationImage = (slug: string) => `/images/destinations/${slug}/hero.jpg`;
export const destinationGalleryImage = (slug: string, n: number) => `/images/destinations/${slug}/gallery-${n}.jpg`;
export const testimonialImage = (id: string) => `/images/testimonials/${id}.jpg`;
export const heroSceneImage = (name: "graduate" | "city" | "student") => `/images/hero/${name}.jpg`;
export const specializationImage = (slug: string) => `/images/specializations/${slug}.jpg`;
