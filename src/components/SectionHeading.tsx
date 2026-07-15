import Reveal from "./Reveal";
import SplitTextReveal from "./reactbits/SplitTextReveal";

type Props = {
  eyebrow?: string;
  title: string;
  sub?: string;
  align?: "left" | "center";
  light?: boolean;
};

export default function SectionHeading({ eyebrow, title, sub, align = "center", light = false }: Props) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <Reveal className={`max-w-2xl ${alignCls}`}>
      {eyebrow && (
        <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${light ? "bg-white/10 text-white/70" : "bg-study-soft text-study"}`}>
          {eyebrow}
        </span>
      )}
      <SplitTextReveal
        as="h2"
        text={title}
        className={`mt-4 block text-[clamp(1.75rem,1.2rem+2.6vw,2.75rem)] font-bold leading-[1.15] ${light ? "text-white" : "text-ink"}`}
      />
      {sub && <p className={`mt-4 text-base leading-relaxed sm:text-lg ${light ? "text-white/70" : "text-ink-soft"}`}>{sub}</p>}
    </Reveal>
  );
}
