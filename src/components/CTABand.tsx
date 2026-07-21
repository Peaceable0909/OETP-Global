import Link from "next/link";
import Reveal from "@/components/Reveal";
import Magnetic from "@/components/Magnetic";
import Cubes from "@/components/reactbits/Cubes";
import SplitTextReveal from "@/components/reactbits/SplitTextReveal";
import { getContactLinks } from "@/lib/data/site";
import { MessageCircle } from "lucide-react";

export default async function CTABand() {
  const { whatsapp } = await getContactLinks();
  return (
    <section className="relative overflow-hidden bg-navy py-20 text-white">
      {/* interactive cube fields on the flanks — hover to tilt, click to ripple */}
      <div className="absolute -left-10 top-1/2 hidden h-64 w-64 -translate-y-1/2 opacity-70 lg:block" aria-hidden="true">
        <Cubes gridSize={6} radius={2.5} rippleColor="#ea580c" faceColor="#111827" />
      </div>
      <div className="absolute -right-10 top-1/2 hidden h-64 w-64 -translate-y-1/2 opacity-70 lg:block" aria-hidden="true">
        <Cubes gridSize={6} radius={2.5} rippleColor="#2563eb" faceColor="#111827" />
      </div>

      <Reveal className="relative mx-auto max-w-3xl px-5 text-center">
        <SplitTextReveal
          as="h2"
          text="Your new life won't apply for itself."
          className="font-display text-3xl font-extrabold sm:text-4xl lg:text-5xl"
        />
        <p className="mx-auto mt-4 max-w-xl text-white/70">
          Applications take under 10 minutes. You&apos;ll get an Application ID instantly and
          hear from a counselor within 48 hours.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Magnetic>
            <Link
              href="/apply/"
              className="btn-sheen inline-block rounded-full bg-hot px-8 py-4 font-bold text-white hover:brightness-95 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              Start My Application →
            </Link>
          </Magnetic>
          <Magnetic>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/25 px-8 py-4 font-bold transition-colors hover:bg-white/10"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" /> Ask a Question First
            </a>
          </Magnetic>
        </div>
      </Reveal>
    </section>
  );
}
