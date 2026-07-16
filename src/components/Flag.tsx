import SmartImage from "@/components/SmartImage";

type Props = {
  code: string;
  color?: string;
  className?: string;
};

// Real flag images (self-hosted SVGs under public/images/flags/, sourced from
// the MIT-licensed flag-icons project) — not a Unicode flag emoji. Flag emoji
// render inconsistently across platforms, and Windows in particular has no
// flag glyphs at all: it falls back to the bare two-letter code with no
// styling. An actual flag picture looks the same everywhere. `color` tints
// SmartImage's placeholder in the unlikely event a code has no matching file.
export default function Flag({ code, color, className = "" }: Props) {
  return (
    <SmartImage
      src={`/images/flags/${code.toLowerCase()}.svg`}
      alt=""
      aria-hidden="true"
      accent={color}
      className={`inline-block shrink-0 overflow-hidden object-cover ${
        className || "h-5 w-[1.9rem] rounded-sm"
      }`}
    />
  );
}
