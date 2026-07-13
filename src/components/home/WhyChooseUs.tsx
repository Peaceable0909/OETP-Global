import { Gift, ShieldCheck, Users, Backpack, PlaneTakeoff } from "lucide-react";
import Reveal from "@/components/Reveal";

const points = [
  { icon: Gift, title: "Genuine Offers", desc: "We partner only with accredited institutions and companies — every offer is verified." },
  { icon: ShieldCheck, title: "Transparent Process", desc: "No hidden fees. No surprises. You see every cost before you commit." },
  { icon: Users, title: "End-to-End Support", desc: "We're with you from your first question to your first week abroad." },
];

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-fuchsia-50 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-700">
            Why Choose Us
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-[2.5rem]">More Than Just Consultants</h2>
          <ul className="mt-8 space-y-6">
            {points.map((p, i) => (
              <Reveal key={p.title} delay={i * 100}>
                <li className="flex gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-brand-700 shadow-lg shadow-brand-600/10">
                    <p.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display font-bold">{p.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{p.desc}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </Reveal>

        {/* traveler composition — a simplified, icon-built stand-in for a mascot illustration */}
        <Reveal delay={150}>
          <div className="relative mx-auto aspect-square w-full max-w-sm">
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-brand-200/60 to-fuchsia-200/40 blur-2xl" />
            <div className="relative grid h-full place-items-center">
              <div className="relative grid h-40 w-40 place-items-center rounded-[2.5rem] bg-gradient-to-br from-brand-600 to-fuchsia-600 shadow-2xl shadow-brand-600/40">
                <Backpack className="h-16 w-16 text-white" aria-hidden="true" />
              </div>
              <span className="absolute -left-2 top-6 grid h-14 w-14 animate-float place-items-center rounded-2xl bg-white shadow-xl shadow-brand-600/15">
                <PlaneTakeoff className="h-6 w-6 text-brand-700" aria-hidden="true" />
              </span>
              <span className="absolute -right-4 bottom-10 grid h-16 w-16 animate-float-slow place-items-center rounded-2xl bg-white shadow-xl shadow-brand-600/15">
                <ShieldCheck className="h-7 w-7 text-emerald-600" aria-hidden="true" />
              </span>
              <span className="absolute bottom-0 left-8 grid h-12 w-12 animate-float place-items-center rounded-xl bg-white shadow-xl shadow-brand-600/15">
                <Gift className="h-5 w-5 text-hot" aria-hidden="true" />
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
