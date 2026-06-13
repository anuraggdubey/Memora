import type { ReactNode } from "react";
import WorkspaceLayoutRoute from "@/workspace/WorkspaceLayoutRoute";

export default function DecisionsLayout({ children }: { children: ReactNode }) {
  return <WorkspaceLayoutRoute>{children}</WorkspaceLayoutRoute>;
}
