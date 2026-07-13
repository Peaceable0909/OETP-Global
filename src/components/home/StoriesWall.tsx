"use client";

import { useState } from "react";
import { Play, X, Quote } from "lucide-react";
import Reveal from "@/components/Reveal";
import SmartImage from "@/components/SmartImage";
import type { Testimonial } from "@/lib/data/site";
import { testimonialImage } from "@/lib/imagePaths";

export default function StoriesWall({ testimonials }: { testimonials: Testimonial[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const featured = testimonials.slice(0, 3);
  const active = testimonials.find((t) => t.id === openId) ?? null;

  return (
    <section className="relative overflow-hidden bg-brand-950 py-24 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(1px_1px_at_20%_30%,white,transparent),radial-gradient(1px_1px_at_70%_60%,white,transparent),radial-gradient(1px_1px_at_40%_80%,white,transparent),radial-gradient(1px_1px_at_90%_20%,white,transparent)] [background-size:200px_200px]" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-200">
            An Immersive Experience
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-[2.75rem]">Real Stories. Real Success.</h2>
          <p className="mt-3 max-w-lg text-brand-200/85">Thousands have done it. You could be next.</p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {featured.map((t, i) => (
            <Reveal key={t.id} delay={i * 100}>
              <button
                type="button"
                onClick={() => setOpenId(t.id)}
                className="group relative block aspect-[3/4] w-full overflow-hidden rounded-3xl text-left shadow-2xl shadow-black/40"
              >
                <SmartImage
                  src={t.photo || testimonialImage(t.id)}
                  alt={t.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <span className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-brand-800 shadow-xl transition-transform duration-300 group-hover:scale-110">
                    <Play className="h-6 w-6 fill-current" aria-hidden="true" />
                  </span>
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-display text-base font-bold">{t.name}</p>
                  <p className="text-xs font-semibold text-brand-200">
                    {t.destination === "Albania" ? "Culinary Student" : "Student"}, {t.destination}
                  </p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-2" aria-hidden="true">
          {testimonials.map((t, i) => (
            <span key={t.id} className={`h-1.5 rounded-full transition-all ${i === 0 ? "w-6 bg-brand-400" : "w-1.5 bg-white/25"}`} />
          ))}
        </div>
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${active.name}'s story`}
          className="fixed inset-0 z-[100] grid place-items-center bg-black/80 p-5"
          onClick={() => setOpenId(null)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-white p-8 text-ink shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpenId(null)}
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-brand-700 transition-colors hover:bg-brand-100"
            >
              <X className="h-4 w-4" />
            </button>
            <Quote className="h-8 w-8 text-brand-300" aria-hidden="true" />
            <p className="mt-3 text-lg font-medium leading-relaxed text-ink-soft">&ldquo;{active.text}&rdquo;</p>
            <p className="mt-5 font-display font-bold">{active.name}</p>
            <p className="text-sm text-brand-600">Now in {active.destination}</p>
            <p className="mt-4 text-xs text-ink-soft">
              Video testimonial coming soon — real footage replaces this once students send it in.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
