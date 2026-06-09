"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Brain, BarChart2, Settings } from "lucide-react";

const TABS = [
  { to: "/", label: "Chats", icon: MessageSquare, end: true },
  { to: "/memories", label: "Memories", icon: Brain },
  { to: "/insights", label: "Insights", icon: BarChart2 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function BottomTabBar() {
  const pathname = usePathname();

  const isActive = (to: string, end?: boolean) =>
    end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);

  return (
    <nav className="h-14 bg-white border-t border-[#E8E8E8] flex items-stretch">
      {TABS.map((t) => (
        <Link
          key={t.to}
          href={t.to}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-all duration-200 ${
            isActive(t.to, t.end) ? "text-[#1A1A1A]" : "text-[#BBBBBB]"
          }`}
        >
          <t.icon size={20} />
          <span className="text-[10px]">{t.label}</span>
        </Link>
      ))}
    </nav>
  );
}
