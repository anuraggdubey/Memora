type Props = { model: "groq" | "gemini" };
export default function ModelBadge({ model }: Props) {
  const map = {
    groq: { bg: "#FFF3E0", fg: "#B45309", label: "Groq" },
    gemini: { bg: "#EEF2FF", fg: "#3730A3", label: "Gemini" },
  } as const;
  const s = map[model];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px]"
      style={{ background: s.bg, color: s.fg }}
    >
      {s.label}
    </span>
  );
}
