"use client";

import { useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import MessageBubble, { type ChatMessage } from "./MessageBubble";
import { useApp } from "./workspace-context";
import { useSearchParams } from "next/navigation";

export default function Chat({ id }: { id: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q");
  const initRef = useRef(false);

  const { addMemory, memories: explicitMemories } = useApp();

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (initialQuery && !initRef.current) {
      initRef.current = true;
      // timeout ensures it runs after initial render completes
      setTimeout(() => send(initialQuery), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const send = (text: string) => {
    const next: ChatMessage = { id: String(Date.now()), role: "user", text };
    setMessages((m) => [...m, next]);
    setTyping(true);

    // Call real API
    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [...messages, next], memories: explicitMemories }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTyping(false);
        if (data.error) {
          console.error(data.error);
          setMessages((m) => [
            ...m,
            {
              id: String(Date.now() + 1),
              role: "assistant",
              model: "error",
              text: `Error: ${data.error}`,
            },
          ]);
          return;
        }

        if (data.extractedMemory) {
          addMemory(data.extractedMemory);
        }

        setMessages((m) => [
          ...m,
          {
            id: String(Date.now() + 1),
            role: "assistant",
            model: data.model || "groq",
            text: data.text || "",
          },
        ]);
      })
      .catch((err) => {
        setTyping(false);
        console.error("Chat error:", err);
        setMessages((m) => [
          ...m,
          {
            id: String(Date.now() + 1),
            role: "assistant",
            model: "error",
            text: "Failed to connect to the chat API. Please check your network or API keys.",
          },
        ]);
      });
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
