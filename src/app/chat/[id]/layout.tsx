import type { ReactNode } from "react";
import WorkspaceLayoutRoute from "@/workspace/WorkspaceLayoutRoute";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return <WorkspaceLayoutRoute>{children}</WorkspaceLayoutRoute>;
}
