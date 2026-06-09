"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import MobileDrawer from "../components/MobileDrawer";
import BottomTabBar from "../components/BottomTabBar";
import TopBar from "../components/TopBar";

const TITLES: Record<string, string> = {
  "/": "Memora",
  "/memories": "Memories",
  "/insights": "Insights",
  "/decisions": "Decisions",
  "/settings": "Settings",
};

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isChat = pathname.startsWith("/chat/");
  const title = isChat ? "Conversation" : (TITLES[pathname] ?? "Memora");

  return (
    <div className="flex h-screen w-full bg-bg text-ink">
      <div className="hidden md:flex w-[260px] shrink-0 border-r border-border-soft bg-sidebar">
        <Sidebar />
      </div>
      <MobileDrawer />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden">
          <TopBar title={title} isChat={isChat} />
        </div>
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          {children}
        </div>
        <div className="md:hidden">
          <BottomTabBar />
        </div>
      </div>
    </div>
  );
}
