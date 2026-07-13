type Props = {
  code: string;
  color: string;
  className?: string;
};

// Country-code badge used instead of flag emoji (which don't render on Windows
// and clash with the SVG icon system). Matches the approved mockup's "AL"/"CY" chips.
export default function Flag({ code, color, className = "" }: Props) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-md font-display font-extrabold uppercase leading-none text-white ${
        className || "h-5 min-w-[1.9rem] px-1 text-[10px]"
      }`}
      style={{ backgroundColor: color }}
    >
      {code}
    </span>
  );
}
