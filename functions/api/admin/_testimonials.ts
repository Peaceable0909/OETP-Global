export type TestimonialRow = {
  id: number;
  slug: string;
  name: string;
  destination: string | null;
  text: string;
  photo: string | null;
  featured: number;
  sort_order: number;
  status: string;
  created_at: string;
  updated_at: string;
};

export function rowToApi(row: TestimonialRow) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    destination: row.destination ?? "",
    text: row.text,
    photo: row.photo ?? "",
    featured: !!row.featured,
    sortOrder: row.sort_order,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export type TestimonialInput = {
  slug: string;
  name: string;
  destination?: string;
  text: string;
  photo?: string;
  featured?: boolean;
  sortOrder?: number;
};

const SLUG_RE = /^[a-z0-9-]+$/;

export function validateTestimonialInput(input: Partial<TestimonialInput>, requireSlug: boolean): string | null {
  if (requireSlug) {
    if (!input.slug || !SLUG_RE.test(input.slug)) {
      return "Slug is required and must be lowercase letters, numbers and hyphens only.";
    }
  }
  if (!input.name || !input.name.trim()) return "Student name is required.";
  if (!input.text || !input.text.trim()) return "Story text is required.";
  return null;
}

export function bindingsForInsert(input: TestimonialInput) {
  return [
    input.slug,
    input.name,
    input.destination || null,
    input.text,
    input.photo || null,
    input.featured ? 1 : 0,
    input.sortOrder ?? 0,
  ];
}

export function bindingsForUpdate(input: TestimonialInput) {
  return [
    input.name,
    input.destination || null,
    input.text,
    input.photo || null,
    input.featured ? 1 : 0,
    input.sortOrder ?? 0,
  ];
}
