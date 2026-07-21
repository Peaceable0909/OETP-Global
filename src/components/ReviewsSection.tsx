import { Star } from "lucide-react";
import Reveal from "@/components/Reveal";
import type { UniversityReview } from "@/lib/data/universities";

export default function ReviewsSection({ reviews, accent }: { reviews: UniversityReview[]; accent: string }) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-ink-soft">
        No reviews yet — be the first student to share your experience once you&apos;re enrolled.
      </p>
    );
  }
  return (
    <div className="grid gap-5 sm:grid-cols-3">
      {reviews.slice(0, 6).map((r, i) => (
        <Reveal key={r.id} delay={i * 80}>
          <div className="h-full rounded-2xl border border-line bg-white p-6">
            <div className="flex gap-0.5" aria-label={`${r.rating} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className="h-4 w-4" fill={s < r.rating ? accent : "none"} stroke={accent} />
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">&ldquo;{r.body}&rdquo;</p>
            <p className="mt-4 text-sm font-bold">{r.author}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
