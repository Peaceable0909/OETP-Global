import { site } from "@/lib/data/site";
import { absoluteUrl } from "@/lib/seo";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: absoluteUrl("/images/logo.png"),
    description: site.description,
    email: site.email,
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function educationalOrganizationSchema(u: {
  name: string;
  path: string;
  description?: string;
  image?: string;
  city?: string;
  countryName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: u.name,
    url: absoluteUrl(u.path),
    ...(u.description ? { description: u.description } : {}),
    ...(u.image ? { image: absoluteUrl(u.image) } : {}),
    address: {
      "@type": "PostalAddress",
      ...(u.city ? { addressLocality: u.city } : {}),
      addressCountry: u.countryName,
    },
  };
}

export function courseSchema(p: {
  name: string;
  path: string;
  description?: string;
  universityName: string;
  universityPath: string;
  degreeType?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: p.name,
    description: p.description || `${p.name} at ${p.universityName}`,
    url: absoluteUrl(p.path),
    provider: {
      "@type": "EducationalOrganization",
      name: p.universityName,
      sameAs: absoluteUrl(p.universityPath),
    },
    ...(p.degreeType ? { educationalCredentialAwarded: p.degreeType } : {}),
  };
}

export function faqPageSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
