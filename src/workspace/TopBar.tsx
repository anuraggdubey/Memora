"use client";

import { Menu, ChevronLeft, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useApp } from "./workspace-context";
import { USER } from "./workspace-data";
import Avatar from "./Avatar";

export default function TopBar({ title, isChat }: { title: string; isChat: boolean }) {
  const { setDrawerOpen } = useApp();
  const router = useRouter();
  return (
    <header className="h-11 px-3 flex items-center justify-between bg-[#FAFAFA] border-b border-[#E8E8E8]">
      <div className="w-10 flex justify-start">
        {isChat ? (
          <button
            onClick={() => router.back()}
            className="w-8 h-8 inline-flex items-center justify-center rounded-md hover:bg-white transition-all duration-200"
            aria-label="Back"
          >
            <ChevronLeft size={18} />
          </button>
        ) : (
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-8 h-8 inline-flex items-center justify-center rounded-md hover:bg-white transition-all duration-200"
            aria-label="Menu"
          >
            <Menu size={18} />
          </button>
        )}
      </div>
      <p className="text-[14px] font-medium truncate">{title}</p>
      <div className="w-10 flex justify-end">
        {isChat ? (
          <button
            className="w-8 h-8 inline-flex items-center justify-center rounded-md hover:bg-white transition-all duration-200"
            aria-label="More"
          >
            <MoreHorizontal size={18} />
          </button>
        ) : (
          <Avatar initials={USER.initials} size={28} />
        )}
      </div>
    </header>
  );
}
