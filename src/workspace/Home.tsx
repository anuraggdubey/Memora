"use client";

import { useRouter } from "next/navigation";
import MessageInput from "./MessageInput";

const CHIPS = [
  "Summarize my week",
  "Help me think through a decision",
  "What did I work on yesterday?",
  "Continue my last project",
];

export default function Home() {
  const router = useRouter();
  const start = (_text: string) => {
    if (_text.trim()) {
      router.push(`/chat/new?q=${encodeURIComponent(_text.trim())}`);
    } else {
      router.push("/chat/new");
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4 md:pb-10">
      <div className="w-full max-w-[680px] flex flex-col items-center">
        <h1 className="text-[28px] font-medium text-[#1A1A1A] text-center leading-tight">
          What can I help with?
        </h1>

        <div className="hidden md:grid mt-8 w-full grid-cols-2 lg:grid-cols-4 gap-2.5">
          {CHIPS.map((c) => (
            <button
              key={c}
              onClick={() => start(c)}
              className="px-4 py-2.5 text-[13px] bg-white border border-[#E8E8E8] rounded-[10px] hover:bg-[#F5F5F5] transition-all duration-200 text-left"
            >
              {c}
            </button>
          ))}
        </div>

        <div className="md:hidden mt-6 w-full flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
          {CHIPS.slice(0, 2).map((c) => (
            <button
              key={c}
              onClick={() => start(c)}
              className="shrink-0 px-4 py-2.5 text-[13px] bg-white border border-[#E8E8E8] rounded-[10px] hover:bg-[#F5F5F5] transition-all duration-200"
            >
              {c}
            </button>
          ))}
        </div>

        <div className="w-full mt-6">
          <MessageInput onSend={start} />
        </div>
      </div>
    </div>
  );
}
