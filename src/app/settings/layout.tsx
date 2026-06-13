import type { ReactNode } from "react";
import WorkspaceLayoutRoute from "@/workspace/WorkspaceLayoutRoute";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return <WorkspaceLayoutRoute>{children}</WorkspaceLayoutRoute>;
}
