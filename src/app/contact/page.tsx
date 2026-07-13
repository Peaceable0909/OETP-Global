import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import LeadForm from "@/components/LeadForm";
import { site } from "@/lib/data/site";
import { Icon, type IconName } from "@/lib/icons";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to a counselor on WhatsApp or Telegram, or leave your details and we'll reach out.",
};

const channels: { icon: IconName; title: string; desc: string; href: string; cta: string; color: string }[] = [
  { icon: "message-circle", title: "WhatsApp", desc: "Fastest replies — talk to a counselor directly.", href: site.whatsapp, cta: "Open WhatsApp", color: "bg-green-500" },
  { icon: "send", title: "Telegram", desc: "Our assistant collects your details and answers instantly.", href: site.telegram, cta: "Open Telegram", color: "bg-sky-500" },
  { icon: "mail", title: "Email", desc: "For documents and formal enquiries.", href: `mailto:${site.email}`, cta: "Send Email", color: "bg-brand-600" },
];

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <SectionHeading
        eyebrow="Contact"
        title="Real People. Fast Answers."
        sub={`Based in ${site.address}. Reach us on the channel you prefer — or drop your details and we'll contact you.`}
      />

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {channels.map((c, i) => (
          <Reveal key={c.title} delay={i * 80} className="h-full">
            <a
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full flex-col items-center rounded-3xl border border-brand-100 bg-white p-8 text-center shadow-lg shadow-brand-600/8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
            >
              <span className={`grid h-14 w-14 place-items-center rounded-2xl text-white ${c.color}`}>
                <Icon name={c.icon} className="h-6 w-6" />
              </span>
              <h2 className="mt-4 font-display text-lg font-bold">{c.title}</h2>
              <p className="mt-2 flex-1 text-sm text-ink-soft">{c.desc}</p>
              <span className="mt-4 text-sm font-extrabold text-brand-700">{c.cta} →</span>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-brand-100 bg-white p-8 shadow-xl shadow-brand-600/10">
          <h2 className="text-center font-display text-xl font-bold">Or leave your details</h2>
          <p className="mt-2 text-center text-sm text-ink-soft">A counselor will reach out within 24–48 hours.</p>
          <div className="mt-6">
            <LeadForm />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
