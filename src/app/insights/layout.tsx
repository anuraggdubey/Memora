import type { ReactNode } from "react";
import WorkspaceLayoutRoute from "@/workspace/WorkspaceLayoutRoute";

export default function InsightsLayout({ children }: { children: ReactNode }) {
  return <WorkspaceLayoutRoute>{children}</WorkspaceLayoutRoute>;
}
