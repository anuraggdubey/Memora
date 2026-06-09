"use client";

import { useRef, useState, type FormEvent } from "react";
import { Paperclip, Globe, Lightbulb, MoreHorizontal, ArrowUp, Mic } from "lucide-react";

type Props = {
  onSend: (text: string) => void;
  showDisclaimer?: boolean;
  autoFocus?: boolean;
};
export default function MessageInput({ onSend, showDisclaimer = true, autoFocus }: Props) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    const max = 24 * 5 + 20;
    el.style.height = Math.min(el.scrollHeight, max) + "px";
  };

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const t = value.trim();
    if (!t) return;
    onSend(t);
    setValue("");
    if (ref.current) ref.current.style.height = "auto";
  };

  const disabled = value.trim().length === 0;

  return (
    <div className="w-full">
      <form
        onSubmit={submit}
        className="relative bg-white border border-[#E0E0E0] rounded-[14px] focus-within:ring-2 focus-within:ring-gray-200 transition-all duration-200"
      >
        <textarea
          ref={ref}
          rows={1}
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            resize(e.target);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Ask anything"
          className="w-full resize-none bg-transparent outline-none px-4 pt-3 pb-10 text-[14px] placeholder:text-[#BBBBBB] leading-[1.5]"
        />
        <div className="absolute left-2 bottom-2 flex items-center gap-1 text-[#BBBBBB]">
          <IconBtn label="Attach"><Paperclip size={16} /></IconBtn>
          <IconBtn label="Web"><Globe size={16} /></IconBtn>
          <IconBtn label="Suggest"><Lightbulb size={16} /></IconBtn>
          <span className="hidden md:inline">
            <IconBtn label="More"><MoreHorizontal size={16} /></IconBtn>
          </span>
          <span className="md:hidden">
            <IconBtn label="Voice"><Mic size={16} /></IconBtn>
          </span>
        </div>
        <button
          type="submit"
          disabled={disabled}
          aria-label="Send"
          className={`absolute right-2 bottom-2 w-8 h-8 rounded-[10px] inline-flex items-center justify-center transition-all duration-200 ${
            disabled
              ? "bg-[#E8E8E8] text-[#BBBBBB] cursor-not-allowed"
              : "bg-[#1A1A1A] text-white hover:opacity-90"
          }`}
        >
          <ArrowUp size={16} />
        </button>
      </form>
      {showDisclaimer && (
        <p className="text-[11px] text-[#BBBBBB] text-center mt-2">
          AI can make mistakes. Please double-check important responses.
        </p>
      )}
    </div>
  );
}

function IconBtn({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="w-7 h-7 inline-flex items-center justify-center rounded-md hover:bg-[#F5F5F5] hover:text-[#1A1A1A] transition-all duration-200"
    >
      {children}
    </button>
  );
}
