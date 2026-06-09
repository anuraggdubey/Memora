"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Brain } from "lucide-react";
import { useApp } from "../context";
import MemoryCard from "../components/MemoryCard";
import FilterTabs from "../components/FilterTabs";
import EmptyState from "../components/EmptyState";

const TABS = ["All", "Facts", "Preferences", "Decisions", "Goals", "People", "Projects"];
const MAP: Record<string, string> = {
  Facts: "fact",
  Preferences: "preference",
  Decisions: "decision",
  Goals: "goal",
  People: "people",
  Projects: "project",
};

export default function Memories() {
  const { memories } = useApp();
  const [tab, setTab] = useState("All");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return memories
      .filter((m) => (tab === "All" ? true : m.category === MAP[tab]))
      .filter((m) => m.text.toLowerCase().includes(q.toLowerCase()));
  }, [memories, tab, q]);

  return (
    <div className="flex-1 overflow-y-auto mem-scrollbar">
      <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-8">
        <header className="mb-6">
          <h1 className="text-[22px] font-medium">Memories</h1>
          <p className="text-[13px] text-[#888] mt-0.5">
            Everything Memora has learned about you
          </p>
        </header>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
          <div className="flex items-center gap-2 h-9 max-w-[320px] w-full bg-white border border-[#E8E8E8] rounded-md px-3">
            <Search size={14} className="text-[#BBBBBB]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search memories..."
              className="w-full bg-transparent outline-none text-[13px] placeholder:text-[#BBBBBB]"
            />
          </div>
          <button className="inline-flex items-center gap-1.5 h-9 px-3.5 bg-white border border-[#E0E0E0] rounded-[10px] text-[13px] hover:bg-[#F5F5F5] transition-all duration-200 self-start">
            <Plus size={14} />
            Add memory
          </button>
        </div>

        <div className="mb-5 overflow-x-auto">
          <FilterTabs tabs={TABS} active={tab} onChange={setTab} />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Brain}
            title="No memories yet."
            subtitle="Start chatting and Memora will learn about you."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((m) => (
              <MemoryCard key={m.id} memory={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
