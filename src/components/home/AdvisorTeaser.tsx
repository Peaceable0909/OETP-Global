import Reveal from "@/components/Reveal";
import { getContactLinks } from "@/lib/data/site";
import type { Destination } from "@/lib/data/destinations";
import Flag from "@/components/Flag";
import { Bot } from "lucide-react";

export default async function AdvisorTeaser({ destinations }: { destinations: Destination[] }) {
  const featuredDestinations = destinations.filter((d) => d.featured);
  const { telegram } = await getContactLinks();
  return (
    <section className="mx-auto max-w-7xl px-5 pb-10 lg:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-line bg-ai-soft px-8 py-12 sm:px-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-bold text-ink-soft">Not sure where to start?</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-ink sm:text-4xl">
                Let our <span className="text-ai">AI Advisor</span> find
                your perfect match!
              </h2>
              <p className="mt-3 max-w-lg text-ink-soft">
                Tell it your budget, goals and qualifications — it recommends your best-fit
                destination instantly, then hands you to a human counselor when you&apos;re ready.
              </p>
              <a
                href={telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-ai px-7 py-3.5 font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
              >
                <Bot className="h-5 w-5" aria-hidden="true" /> Chat with AI Advisor <span aria-hidden>→</span>
              </a>
            </div>

            {/* chat mock */}
            <div className="relative">
              <span className="absolute -top-10 right-4 grid h-16 w-16 animate-float place-items-center rounded-3xl bg-ai text-white sm:h-20 sm:w-20" aria-hidden>
                <Bot className="h-9 w-9 sm:h-11 sm:w-11" />
              </span>
              <div className="space-y-3">
                <div className="w-fit max-w-[85%] rounded-2xl rounded-bl-md border border-line bg-white px-4 py-3 text-sm font-medium">
                  I want to study abroad but I&apos;m not sure which country is best for me.
                </div>
                <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md border border-line bg-white px-4 py-3 text-sm font-medium">
                  Based on your profile, we recommend these destinations:
                  <span className="mt-2 flex items-center gap-1.5">
                    {featuredDestinations.map((d) => (
                      <Flag key={d.slug} code={d.code} color={d.accent} className="h-6 w-[2.2rem] rounded-lg" />
                    ))}
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-ai-soft text-[11px] font-extrabold text-ai">
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
