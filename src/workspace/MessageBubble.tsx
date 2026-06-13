"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Copy, RefreshCw, Check } from "lucide-react";
import ModelBadge from "./ModelBadge";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  model?: "groq" | "gemini";
};

export default function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[72%]`}>
        <div
          className={`px-4 py-2.5 text-[14px] leading-[1.7] ${
            isUser
              ? "bg-[#1A1A1A] text-white rounded-[20px_4px_20px_20px]"
              : "bg-[#F0F0F0] text-[#1A1A1A] rounded-[4px_20px_20px_20px]"
          }`}
        >
          <Markdown text={msg.text} dark={isUser} />
        </div>
        {!isUser && (
          <div className="mt-1.5 flex items-center gap-2 text-[#BBBBBB] pl-1">
            <Reaction icon={ThumbsUp} label="Good" />
            <Reaction icon={ThumbsDown} label="Bad" />
            <CopyButton text={msg.text} />
            <Reaction icon={RefreshCw} label="Regenerate" />
            {msg.model && <ModelBadge model={msg.model} />}
          </div>
        )}
      </div>
    </div>
  );
}

function Reaction({ icon: Icon, label }: { icon: typeof ThumbsUp; label: string }) {
  return (
    <button aria-label={label} className="hover:text-[#1A1A1A] transition-all duration-200">
      <Icon size={14} />
    </button>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      className="hover:text-[#1A1A1A] transition-all duration-200"
      aria-label="Copy"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

function Markdown({ text, dark }: { text: string; dark: boolean }) {
  // Lightweight markdown: code blocks, inline code, bold, lists.
  const blocks = text.split(/(```[\s\S]*?```)/g);
  return (
    <div className="space-y-2">
      {blocks.map((b, i) => {
        if (b.startsWith("```") && b.endsWith("```")) {
          const code = b.replace(/^```\w*\n?|```$/g, "");
          return <CodeBlock key={i} code={code} />;
        }
        return <BlockText key={i} text={b} dark={dark} />;
      })}
    </div>
  );
}

function BlockText({ text, dark }: { text: string; dark: boolean }) {
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  let listBuf: string[] = [];
  let listKind: "ul" | "ol" | null = null;

  const flushList = (key: number) => {
    if (!listKind) return;
    const items = listBuf.map((l, i) => (
      <li key={i} className="ml-5 list-outside">
        <Inline text={l} dark={dark} />
      </li>
    ));
    out.push(
      listKind === "ul" ? (
        <ul key={`l${key}`} className="list-disc space-y-1">
          {items}
        </ul>
      ) : (
        <ol key={`l${key}`} className="list-decimal space-y-1">
          {items}
        </ol>
      ),
    );
    listBuf = [];
    listKind = null;
  };

  lines.forEach((line, idx) => {
    const ul = line.match(/^\s*[-*]\s+(.*)$/);
    const ol = line.match(/^\s*\d+\.\s+(.*)$/);
    if (ul) {
      if (listKind !== "ul") flushList(idx);
      listKind = "ul";
      listBuf.push(ul[1]);
    } else if (ol) {
      if (listKind !== "ol") flushList(idx);
      listKind = "ol";
      listBuf.push(ol[1]);
    } else {
      flushList(idx);
      if (line.trim() !== "") {
        out.push(
          <p key={idx}>
            <Inline text={line} dark={dark} />
          </p>,
        );
      }
    }
  });
  flushList(9999);
  return <>{out}</>;
}

function Inline({ text, dark }: { text: string; dark: boolean }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("`") && p.endsWith("`")) {
          return (
            <code
              key={i}
              className={`px-1.5 py-0.5 rounded text-[12.5px] font-mono ${
                dark ? "bg-white/15 text-white" : "bg-[#E8E8E8] text-[#1A1A1A]"
              }`}
            >
              {p.slice(1, -1)}
            </code>
          );
        }
        if (p.startsWith("**") && p.endsWith("**")) {
          return <strong key={i}>{p.slice(2, -2)}</strong>;
        }
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative">
      <pre className="bg-[#1A1A1A] text-white text-[12.5px] font-mono p-3 pr-10 rounded-[10px] overflow-x-auto leading-[1.55]">
        <code>{code}</code>
      </pre>
      <button
        onClick={() => {
          navigator.clipboard?.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
        className="absolute top-2 right-2 text-[#BBBBBB] hover:text-white transition-all duration-200"
        aria-label="Copy code"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
}
