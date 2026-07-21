import { FileEdit, ClipboardCheck, Mail, ShieldCheck, GraduationCap } from "lucide-react";
import Reveal from "@/components/Reveal";

// A simpler, static cousin of the homepage's JourneyTimeline (no GSAP
// scroll-scrubbing) — this is a secondary-page reference stepper, not a hero
// moment, so it doesn't need that machinery.
const stages = [
  { icon: FileEdit, title: "Apply", color: "#2563eb" },
  { icon: ClipboardCheck, title: "Document Review", color: "#475569" },
  { icon: Mail, title: "Offer", color: "#f59e0b" },
  { icon: ShieldCheck, title: "Visa", color: "#059669" },
  { icon: GraduationCap, title: "Enrollment", color: "#ea580c" },
];

export default function ApplicationTimeline() {
  return (
    <ol className="grid grid-cols-2 gap-6 sm:grid-cols-5">
      {stages.map((s, i) => (
        <Reveal key={s.title} delay={i * 90}>
          <li className="text-center">
            <span
              className="mx-auto grid h-12 w-12 place-items-center rounded-2xl text-white shadow-sm"
              style={{ backgroundColor: s.color }}
            >
              <s.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="mt-2 block text-[11px] font-extrabold uppercase tracking-wider text-ink-mute">
              Step {i + 1}
            </span>
            <h4 className="mt-0.5 text-sm font-bold">{s.title}</h4>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}
