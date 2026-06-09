"use client";

import { useEffect, useRef, useState } from "react";
import MessageInput from "../components/MessageInput";
import MessageBubble, { type ChatMessage } from "../components/MessageBubble";

export default function Chat({ id }: { id: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    const next: ChatMessage = { id: String(Date.now()), role: "user", text };
    setMessages((m) => [...m, next]);
    setTyping(true);

    // TODO: Replace with actual API call to /api/chat
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        {
          id: String(Date.now() + 1),
          role: "assistant",
          model: "groq",
          text: "This is a placeholder response. Connect the Grok and Gemini APIs to get real AI responses.",
        },
      ]);
    }, 900);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div
        ref={scrollerRef}
        className="flex-1 min-h-0 overflow-y-auto mem-scrollbar px-4 md:px-6 py-6"
      >
        <div className="max-w-[760px] mx-auto flex flex-col gap-5">
          {messages.length === 0 && (
            <p className="text-center text-[13px] text-[#888] py-20">
              New conversation. Start by asking anything.
            </p>
          )}
          {messages.map((m) => (
            <MessageBubble key={m.id} msg={m} />
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-[#F0F0F0] rounded-[4px_20px_20px_20px] px-4 py-3 flex items-center gap-1.5">
                <span className="mem-dot w-1.5 h-1.5 rounded-full bg-[#888]" />
                <span className="mem-dot w-1.5 h-1.5 rounded-full bg-[#888]" />
                <span className="mem-dot w-1.5 h-1.5 rounded-full bg-[#888]" />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-[#E8E8E8] bg-[#FAFAFA] px-4 md:px-6 py-3">
        <div className="max-w-[760px] mx-auto">
          <MessageInput onSend={send} />
        </div>
      </div>
    </div>
  );
}
