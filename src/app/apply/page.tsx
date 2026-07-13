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
    <section className="bg-gradient-to-b from-brand-50 to-white px-5 py-16">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold sm:text-5xl">
          Start Your
          <span className="bg-gradient-to-r from-brand-600 to-fuchsia-500 bg-clip-text text-transparent"> Application</span>
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          Under 10 minutes. Instant Application ID. A counselor reviews your profile — free.
        </p>
      </div>
      <Suspense>
        <ApplyForm destinations={destinations} whatsapp={links.whatsapp} />
      </Suspense>
    </section>
  );
}
