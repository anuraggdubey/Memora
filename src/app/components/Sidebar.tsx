"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Brain,
  BarChart2,
  CheckSquare,
  Settings,
  Search,
  PenSquare,
  Plus,
} from "lucide-react";
import { useApp, RECENT_CHATS, USER } from "../context";
import WorkspaceItem from "./WorkspaceItem";
import Avatar from "./Avatar";
import { useState } from "react";

const NAV = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/memories", label: "Memories", icon: Brain },
  { to: "/insights", label: "Insights", icon: BarChart2 },
  { to: "/decisions", label: "Decisions", icon: CheckSquare },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { workspaces, setDrawerOpen } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = RECENT_CHATS.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const go = (to: string) => {
    router.push(to);
    onNavigate?.();
    setDrawerOpen(false);
  };

  const isActive = (to: string, end?: boolean) =>
    end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);

  return (
    <aside className="flex flex-col h-full w-full">
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <span className="text-[15px] font-medium tracking-tight">Memora</span>
        <button
          onClick={() => go("/")}
          className="w-7 h-7 inline-flex items-center justify-center rounded-md hover:bg-white text-[#1A1A1A] transition-all duration-200"
          aria-label="New chat"
        >
          <PenSquare size={15} />
        </button>
      </div>

      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 h-8 bg-white border border-[#E8E8E8] rounded-md px-2.5">
          <Search size={13} className="text-[#BBBBBB]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats..."
            className="w-full bg-transparent outline-none text-[12.5px] placeholder:text-[#BBBBBB]"
          />
        </div>
      </div>

      <nav className="px-3 pb-2 flex-1 overflow-y-auto mem-scrollbar">
        <p className="px-2 pt-2 pb-1.5 text-[11px] uppercase tracking-widest text-gray-400">
          Navigation
        </p>
        <ul className="flex flex-col gap-0.5">
          {NAV.map((n) => (
            <li key={n.to}>
              <Link
                href={n.to}
                onClick={() => {
                  onNavigate?.();
                  setDrawerOpen(false);
                }}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] transition-all duration-200 ${
                  isActive(n.to, n.end)
                    ? "bg-white border border-[#E8E8E8] font-medium"
                    : "text-[#1A1A1A] hover:bg-white"
                }`}
              >
                <n.icon size={15} />
                <span>{n.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-center justify-between px-2 pb-1.5">
          <p className="text-[11px] uppercase tracking-widest text-gray-400">Workspaces</p>
          <button
            className="text-[#888] hover:text-[#1A1A1A] transition-all duration-200"
            aria-label="Add workspace"
          >
            <Plus size={13} />
          </button>
        </div>
        <ul className="flex flex-col gap-0.5">
          {workspaces.map((w) => (
            <li key={w.id}>
              <WorkspaceItem ws={w} />
            </li>
          ))}
        </ul>

        <p className="mt-5 px-2 pb-1.5 text-[11px] uppercase tracking-widest text-gray-400">
          Recent Chats
        </p>
        <ul className="flex flex-col gap-0.5">
          {filtered.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => go(`/chat/${c.id}`)}
                className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md hover:bg-white transition-all duration-200 group"
              >
                <span className="text-[13px] text-[#1A1A1A] truncate text-left">
                  {c.title}
                </span>
                <span className="text-[11px] text-[#BBBBBB] shrink-0">{c.time}</span>
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-2.5 py-1.5 text-[12px] text-[#BBBBBB]">No matches</li>
          )}
        </ul>
      </nav>

      <div className="border-t border-[#E8E8E8] px-3 py-3 flex items-center gap-2.5">
        <Avatar initials={USER.initials} />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] truncate">{USER.name}</p>
          <p className="text-[11px] text-[#888] truncate">{USER.email}</p>
        </div>
      </div>
    </aside>
  );
}
