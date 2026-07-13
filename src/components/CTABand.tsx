import Link from "next/link";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/data/site";

export default function CTABand() {
  return (
    <section className="relative overflow-hidden bg-brand-950 py-20 text-white">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[50rem] -translate-x-1/2 rounded-full bg-brand-600/30 blur-3xl" />
      <Reveal className="relative mx-auto max-w-3xl px-5 text-center">
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl lg:text-5xl">
          Your new life won&apos;t apply for itself.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-brand-200/85">
          Applications take under 10 minutes. You&apos;ll get an Application ID instantly and
          hear from a counselor within 48 hours.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/apply/"
            className="rounded-full bg-gradient-to-r from-hot to-hot-deep px-8 py-4 font-bold text-white shadow-xl shadow-hot/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            Start My Application →
          </Link>
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-2 border-white/25 px-8 py-4 font-bold transition-colors hover:bg-white/10"
          >
            💬 Ask a Question First
          </a>
        </div>
      </Reveal>
    </section>
  );
}
