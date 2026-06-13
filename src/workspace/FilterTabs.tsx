type Props = {
  tabs: string[];
  active: string;
  onChange: (t: string) => void;
};
export default function FilterTabs({ tabs, active, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tabs.map((t) => {
        const isActive = t === active;
        return (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={`px-3.5 py-1 rounded-full text-[12px] transition-all duration-200 ${
              isActive ? "bg-[#1A1A1A] text-white" : "text-[#888] hover:text-[#1A1A1A]"
            }`}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}
