import type { Metadata } from "next";
import { site } from "@/lib/data/site";

// A real, brand-appropriate photo used whenever a specific page/entity
// doesn't have its own confirmed-uploaded image — guarantees social link
// previews never show a broken image (many university/program photo paths
// route through /api/images/... which can't be existence-checked at build time).
const DEFAULT_OG_IMAGE = "/images/hero/graduate.jpg";

export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString();
}

/**
 * Builds a full Metadata object (title, description, canonical, Open Graph,
 * Twitter Card) from one shared shape so every route gets the same fields
 * instead of hand-rolling openGraph/twitter/alternates per page.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image || DEFAULT_OG_IMAGE);
  const fullTitle = `${title} — ${site.name}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.name,
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
  };
}
