"use client";

import { useMemo, useState } from "react";
import { CheckSquare } from "lucide-react";
import { useApp } from "./workspace-context";
import type { Decision } from "./workspace-types";
import FilterTabs from "./FilterTabs";
import EmptyState from "./EmptyState";

const TABS = ["All", "Pending", "Implemented", "Abandoned"];

const STATUS_STYLE: Record<Decision["status"], { bg: string; fg: string }> = {
  Pending: { bg: "#FFF3E0", fg: "#B45309" },
  Implemented: { bg: "#ECFDF5", fg: "#047857" },
  Abandoned: { bg: "#FEF2F2", fg: "#B91C1C" },
  "In progress": { bg: "#EEF2FF", fg: "#3730A3" },
};

export default function Decisions() {
  const { decisions, workspaces, updateDecision } = useApp();
  const [tab, setTab] = useState("All");
  const [ws, setWs] = useState("All workspaces");

  const filtered = useMemo(() => {
    return decisions
      .filter((d) => (tab === "All" ? true : d.status === tab))
      .filter((d) => (ws === "All workspaces" ? true : d.workspace === ws));
  }, [decisions, tab, ws]);

  return (
    <div className="flex-1 overflow-y-auto mem-scrollbar">
      <div className="max-w-[900px] mx-auto px-4 md:px-8 py-8">
        <header className="mb-6">
          <h1 className="text-[22px] font-medium">Decisions log</h1>
          <p className="text-[13px] text-[#888] mt-0.5">
            Every choice you've made, with the context to back it up
          </p>
        </header>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">
          <div className="overflow-x-auto">
            <FilterTabs tabs={TABS} active={tab} onChange={setTab} />
          </div>
          <select
            value={ws}
            onChange={(e) => setWs(e.target.value)}
            className="h-9 px-3 bg-white border border-[#E0E0E0] rounded-[10px] text-[13px] outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
          >
            <option>All workspaces</option>
            {workspaces.map((w) => (
              <option key={w.id}>{w.name}</option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title="No decisions logged yet."
            subtitle="When you make a decision in chat, it'll show up here."
          />
        ) : (
          <ol className="relative">
            {filtered.map((d, i) => (
              <li key={d.id} className="relative pl-7 pb-6 last:pb-0">
                <span className="absolute left-[3px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#1A1A1A]" />
                {i !== filtered.length - 1 && (
                  <span className="absolute left-[7px] top-4 bottom-0 w-px bg-[#E8E8E8]" />
                )}
                <div className="bg-white border border-[#E8E8E8] rounded-[10px] p-4">
                  <p className="text-[14px] text-[#1A1A1A]">{d.text}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#F0F0F0] text-[#1A1A1A]">
                      {d.workspace}
                    </span>
                    <span
                      className="text-[11px] px-2.5 py-0.5 rounded-full"
                      style={{
                        background: STATUS_STYLE[d.status].bg,
                        color: STATUS_STYLE[d.status].fg,
                      }}
                    >
                      {d.status}
                    </span>
                    <a className="text-[11px] text-[#888] hover:text-[#1A1A1A] cursor-pointer transition-all duration-200">
                      {d.source}
                    </a>
                    <span className="text-[11px] text-[#BBBBBB] ml-auto">{d.date}</span>
                    <select
                      value={d.status}
                      onChange={(e) => updateDecision(d.id, e.target.value as Decision["status"])}
                      className="text-[11px] h-7 px-2 bg-white border border-[#E0E0E0] rounded-md outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
                    >
                      <option>Pending</option>
                      <option>In progress</option>
                      <option>Implemented</option>
                      <option>Abandoned</option>
                    </select>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
