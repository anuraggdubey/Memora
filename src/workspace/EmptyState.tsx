import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
};
export default function EmptyState({ icon: Icon, title, subtitle, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <Icon size={48} className="text-[#E8E8E8]" strokeWidth={1.5} />
      <p className="mt-4 text-[14px] text-[#1A1A1A]">{title}</p>
      {subtitle && <p className="mt-1 text-[13px] text-[#888]">{subtitle}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 px-4 h-9 rounded-[10px] border border-[#E0E0E0] bg-white text-[13px] hover:bg-[#F5F5F5] transition-all duration-200"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
