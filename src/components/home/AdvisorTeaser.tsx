import Reveal from "@/components/Reveal";
import { site } from "@/lib/data/site";
import { featuredDestinations } from "@/lib/data/destinations";

export default function AdvisorTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-10 lg:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-brand-200 bg-gradient-to-r from-brand-100 via-brand-50 to-fuchsia-50 px-8 py-12 sm:px-12">
          <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-brand-300/30 blur-3xl" />
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-bold text-ink-soft">Not sure where to start?</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
                Let our <span className="bg-gradient-to-r from-brand-600 to-fuchsia-500 bg-clip-text text-transparent">AI Advisor</span> find
                your perfect match!
              </h2>
              <p className="mt-3 max-w-lg text-ink-soft">
                Tell it your budget, goals and qualifications — it recommends your best-fit
                destination instantly, then hands you to a human counselor when you&apos;re ready.
              </p>
              <a
                href={site.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-800 px-7 py-3.5 font-bold text-white shadow-xl shadow-brand-600/25 transition-all duration-300 hover:-translate-y-1"
              >
                🤖 Chat with AI Advisor <span aria-hidden>→</span>
              </a>
            </div>

            {/* chat mock */}
            <div className="relative">
              <span className="absolute -top-8 right-4 animate-float text-6xl drop-shadow-xl sm:text-7xl" aria-hidden>
                🤖
              </span>
              <div className="space-y-3">
                <div className="w-fit max-w-[85%] rounded-2xl rounded-bl-md border border-brand-100 bg-white px-4 py-3 text-sm font-medium shadow-lg shadow-brand-600/8">
                  I want to study abroad but I&apos;m not sure which country is best for me.
                </div>
                <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-white px-4 py-3 text-sm font-medium shadow-lg shadow-brand-600/8 ring-1 ring-brand-200">
                  Based on your profile, we recommend these destinations:
                  <span className="mt-2 flex items-center gap-1.5 text-xl">
                    {featuredDestinations.map((d) => (
                      <span key={d.slug}>{d.flag}</span>
                    ))}
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-100 text-[11px] font-extrabold text-brand-700">
                      +2
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
