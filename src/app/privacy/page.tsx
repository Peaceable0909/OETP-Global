import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses, and protects your personal information.`,
  path: "/privacy/",
});

type Section = { title: string; body: string[] };

const sections: Section[] = [
  {
    title: "Information we collect",
    body: [
      "When you use our Apply form, we collect the personal details you provide: full name, email address, phone/WhatsApp number, country of residence, your preferred destination and program, and any notes you add.",
      "We also collect the documents you upload to support your application — your international passport data page, academic certificates, transcripts, CV/résumé, and any other supporting document you choose to submit.",
    ],
  },
  {
    title: "How we use your information",
    body: [
      "To process your application and match you with a suitable destination, university, and program.",
      "To contact you by email or WhatsApp with your Application ID, status updates, and guidance from a counselor.",
      "To share the minimum necessary information with a partner institution or embassy/consulate, only where required to progress your specific application.",
      "To improve our services and keep our destination and program information accurate.",
    ],
  },
  {
    title: "How we store and protect it",
    body: [
      "Application records are stored in our database, and uploaded documents are stored in a private cloud storage bucket — neither is publicly accessible.",
      "Only authorized CompeTenza staff, signed in through a password-protected admin panel, can view your application and documents.",
      "We never sell your personal information or documents to third parties, and we don't use them for advertising.",
    ],
  },
  {
    title: "Cookies and analytics",
    body: [
      "Our public website does not use third-party advertising or tracking cookies. We keep a basic, anonymous count of page views per destination to understand which programs students are interested in.",
      "Our staff admin panel uses a secure session cookie to keep administrators signed in; this cookie is not set for regular visitors.",
    ],
  },
  {
    title: "How long we keep your information",
    body: [
      "We retain your application and documents for as long as needed to process your application and provide ongoing support (including after you've traveled, in case you need further assistance).",
      "You can ask us to delete your information at any time — see \"Your rights\" below.",
    ],
  },
  {
    title: "Your rights",
    body: [
      "You can ask us what information we hold about you, ask us to correct anything inaccurate, or ask us to delete your application and documents.",
      `To make a request, email us at ${site.email} with your full name and Application ID (if you have one). We'll respond within a reasonable time.`,
    ],
  },
  {
    title: "Children's privacy",
    body: [
      "Our services are intended for applicants who are at or near the minimum age for the programs we advertise. If you are under 18, please have a parent or guardian involved in your application.",
    ],
  },
  {
    title: "Changes to this policy",
    body: [
      "We may update this policy from time to time as our services change. The date below reflects the last update. Continued use of our Apply form after a change means you accept the updated policy.",
    ],
  },
];

const EFFECTIVE_DATE = "23 July 2026";

export default function PrivacyPage() {
  return (
    <section className="bg-white px-5 py-16">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h1 className="text-4xl font-extrabold sm:text-5xl">
            Privacy
            <span className="text-study"> Policy</span>
          </h1>
          <p className="mt-4 text-ink-soft">
            Effective {EFFECTIVE_DATE}. This explains what personal information {site.name} collects
            through this website — especially our Apply form — and how we use, store, and protect it.
          </p>
        </Reveal>

        <div className="mt-12 space-y-10">
          {sections.map((s, i) => (
            <Reveal key={s.title} delay={i * 60}>
              <h2 className="font-display text-xl font-bold">{s.title}</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-soft">
                {s.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={sections.length * 60}>
          <div className="mt-12 rounded-2xl bg-surface px-6 py-5 text-sm text-ink-soft">
            Questions about this policy or your data? Contact us at{" "}
            <a href={`mailto:${site.email}`} className="font-semibold text-study hover:underline">
              {site.email}
            </a>{" "}
            or {site.address}.
          </div>
        </Reveal>
      </div>
    </section>
  );
}
