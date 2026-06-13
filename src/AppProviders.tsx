"use client";

import { type ReactNode } from "react";
import { AppProvider } from "@/workspace/workspace-context";

export default function AppProviders({ children }: { children: ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}
