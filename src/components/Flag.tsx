type Props = {
  code: string;
  color?: string;
  className?: string;
};

// A small colored code badge (e.g. "AL" on a red chip) — deliberately not a
// Unicode flag emoji. Flag emoji render inconsistently across platforms, and
// Windows in particular has no flag glyphs at all: it falls back to the bare
// two-letter code with no styling, which is indistinguishable from broken text.
// A branded badge looks identical and intentional everywhere.
export default function Flag({ code, color, className = "" }: Props) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center font-extrabold uppercase leading-none text-white ${
        className || "h-5 min-w-[1.9rem] rounded-md px-1 text-[10px]"
      }`}
      style={{ backgroundColor: color ?? "#6b7280" }}
    >
      {code}
    </span>
  );
}
