type Props = {
  initials: string;
  size?: number;
  bg?: string;
  fg?: string;
};
export default function Avatar({ initials, size = 32, bg = "#E8E8E8", fg = "#1A1A1A" }: Props) {
  return (
    <div
      className="inline-flex items-center justify-center rounded-full select-none"
      style={{ width: size, height: size, background: bg, color: fg, fontSize: Math.max(11, size * 0.38) }}
    >
      {initials}
    </div>
  );
}
