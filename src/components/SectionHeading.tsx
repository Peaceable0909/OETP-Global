import Reveal from "./Reveal";

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
        <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${light ? "bg-white/10 text-brand-200" : "bg-brand-100 text-brand-700"}`}>
          {eyebrow}
        </span>
      )}
      <h2 className={`mt-4 text-[clamp(1.75rem,1.2rem+2.6vw,2.75rem)] font-bold leading-[1.15] ${light ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
      {sub && <p className={`mt-4 text-base leading-relaxed sm:text-lg ${light ? "text-brand-200/85" : "text-ink-soft"}`}>{sub}</p>}
    </Reveal>
  );
}
