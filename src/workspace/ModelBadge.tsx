type Props = { model: "groq" | "gemini" | "error" | "system" | string };
export default function ModelBadge({ model }: Props) {
  const map: Record<string, { bg: string; fg: string; label: string }> = {
    groq: { bg: "#FFF3E0", fg: "#B45309", label: "Groq" },
    gemini: { bg: "#EEF2FF", fg: "#3730A3", label: "Gemini" },
    error: { bg: "#FEF2F2", fg: "#B91C1C", label: "Error" },
    system: { bg: "#F3F4F6", fg: "#374151", label: "System" },
  };
  const s = map[model] || map.system;
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px]"
      style={{ background: s.bg, color: s.fg }}
    >
      {s.label}
    </span>
  );
}
