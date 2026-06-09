"use client";

import { type ReactNode } from "react";
import { AppProvider } from "./context";

export default function Providers({ children }: { children: ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}
