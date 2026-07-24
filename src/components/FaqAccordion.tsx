import Reveal from "@/components/Reveal";
import Accordion from "@/components/Accordion";

type Faq = { q: string; a: string };

export default function FaqAccordion({ items }: { items: Faq[] }) {
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((f, i) => (
        <Reveal key={f.q} delay={i * 60}>
          <Accordion title={f.q}>
            <p className="text-sm leading-relaxed text-ink-soft">{f.a}</p>
          </Accordion>
        </Reveal>
      ))}
    </div>
  );
}
