"use client";

import { BarChart2 } from "lucide-react";
import EmptyState from "./EmptyState";

export default function Insights() {
  // TODO: Fetch real stats, digests, and heatmap data from the API
  const stats = {
    conversations: 0,
    memories: 0,
    decisions: 0,
    daysActive: 0,
  };

  const hasDigest = false;

  return (
    <div className="flex-1 overflow-y-auto mem-scrollbar">
      <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-8">
        <header className="mb-6">
          <h1 className="text-[22px] font-medium">Insights</h1>
          <p className="text-[13px] text-[#888] mt-0.5">
            Patterns and summaries from your conversations
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total conversations", value: stats.conversations },
            { label: "Memories saved", value: stats.memories },
            { label: "Decisions logged", value: stats.decisions },
            { label: "Days active", value: stats.daysActive },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-[#E8E8E8] rounded-[10px] p-4">
              <p className="text-[28px] font-medium leading-tight">{s.value}</p>
              <p className="text-[11px] text-[#888] mt-1 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        {!hasDigest && (
          <EmptyState
            icon={BarChart2}
            title="No insights yet."
            subtitle="Start chatting and your weekly digest will appear here."
          />
        )}
      </div>
    </div>
  );
}
