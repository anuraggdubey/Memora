import type { ReactNode } from "react";
import AppLayout from "../layout/AppLayout";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
