type Props = {
  code: string;
  color?: string;
  className?: string;
};

// ISO 3166-1 alpha-2 -> flag emoji (regional indicator symbols).
function toFlagEmoji(code: string): string {
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export default function Flag({ code, className = "" }: Props) {
  return (
    <span aria-hidden="true" className={`inline-block leading-none ${className || "text-base"}`}>
      {toFlagEmoji(code)}
    </span>
  );
}
