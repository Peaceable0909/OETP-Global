import type { Metadata } from "next";
import { Suspense } from "react";
import ApplyForm from "@/components/ApplyForm";
import { getDestinations } from "@/lib/data/destinations";
import { getContactLinks } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Apply Now",
  description: "Apply in under 10 minutes. Upload your documents and get an instant Application ID.",
};

export default async function ApplyPage() {
  const [destinations, links] = await Promise.all([getDestinations(), getContactLinks()]);
  return (
    <section className="bg-white px-5 py-16">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold sm:text-5xl">
          Start Your
          <span className="text-study"> Application</span>
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          Under 10 minutes. Instant Application ID. A counselor reviews your profile — free.
        </p>
        <a
          href="https://competenza-document-form.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:border-study hover:text-study"
        >
          Prefer saving straight to Google Drive? Try our Document Portal →
        </a>
      </div>
      <Suspense>
        <ApplyForm destinations={destinations} whatsapp={links.whatsapp} />
      </Suspense>
    </section>
  );
}
