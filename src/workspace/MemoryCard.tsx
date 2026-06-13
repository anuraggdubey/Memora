"use client";

import { Bookmark, Pencil, Trash2 } from "lucide-react";
import type { Memory } from "./workspace-types";
import { useApp } from "./workspace-context";
import { useState } from "react";

const CATEGORY_COLORS: Record<Memory["category"], { bg: string; fg: string; label: string }> = {
  fact: { bg: "#EEF2FF", fg: "#3730A3", label: "Fact" },
  preference: { bg: "#FFF3E0", fg: "#B45309", label: "Preference" },
  decision: { bg: "#ECFDF5", fg: "#047857", label: "Decision" },
  goal: { bg: "#FEF2F2", fg: "#B91C1C", label: "Goal" },
  people: { bg: "#FDF4FF", fg: "#86198F", label: "People" },
  project: { bg: "#F0F9FF", fg: "#075985", label: "Project" },
};

export default function MemoryCard({ memory }: { memory: Memory }) {
  const { togglePin, deleteMemory } = useApp();
  const [expanded, setExpanded] = useState(false);
  const cat = CATEGORY_COLORS[memory.category];
  const isLong = memory.text.length > 140;

  return (
    <div
      className={`bg-white border border-[#E8E8E8] rounded-[10px] p-3.5 transition-all duration-200 hover:border-[#D4D4D4] ${
        memory.pinned ? "border-l-[3px] border-l-[#1A1A1A]" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px]"
          style={{ background: cat.bg, color: cat.fg }}
        >
          {cat.label}
        </span>
        <button
          onClick={() => togglePin(memory.id)}
          className="text-[#BBBBBB] hover:text-[#1A1A1A] transition-all duration-200"
          aria-label="Pin memory"
        >
          <Bookmark
            size={14}
            fill={memory.pinned ? "#1A1A1A" : "none"}
            stroke={memory.pinned ? "#1A1A1A" : "currentColor"}
          />
        </button>
      </div>
      <p
        className={`text-[13px] text-[#1A1A1A] leading-relaxed ${
          !expanded && isLong ? "line-clamp-3" : ""
        }`}
      >
        {memory.text}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-[12px] text-[#888] hover:text-[#1A1A1A] transition-all duration-200"
        >
          {expanded ? "see less" : "see more"}
        </button>
      )}
      <div className="mt-3 flex items-center justify-between text-[11px] text-[#BBBBBB]">
        <div className="flex items-center gap-2 min-w-0">
          <span>{memory.date}</span>
          <span>·</span>
          <span className="truncate hover:text-[#1A1A1A] cursor-pointer transition-all duration-200">
            {memory.source}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="hover:text-[#1A1A1A] transition-all duration-200" aria-label="Edit">
            <Pencil size={13} />
          </button>
          <button
            onClick={() => deleteMemory(memory.id)}
            className="hover:text-[#EF4444] transition-all duration-200"
            aria-label="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
