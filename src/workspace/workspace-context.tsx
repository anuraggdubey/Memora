"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { DECISIONS, MEMORIES, WORKSPACES } from "./workspace-data";
import type { Decision, Memory, Workspace } from "./workspace-types";

type Ctx = {
  workspaces: Workspace[];
  memories: Memory[];
  decisions: Decision[];
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
  updateDecision: (id: string, status: Decision["status"]) => void;
  togglePin: (id: string) => void;
  deleteMemory: (id: string) => void;
};

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [workspaces] = useState(WORKSPACES);
  const [memories, setMemories] = useState(MEMORIES);
  const [decisions, setDecisions] = useState(DECISIONS);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <AppContext.Provider
      value={{
        workspaces,
        memories,
        decisions,
        drawerOpen,
        setDrawerOpen,
        updateDecision: (id, status) =>
          setDecisions((d) => d.map((x) => (x.id === id ? { ...x, status } : x))),
        togglePin: (id) =>
          setMemories((m) => m.map((x) => (x.id === id ? { ...x, pinned: !x.pinned } : x))),
        deleteMemory: (id) => setMemories((m) => m.filter((x) => x.id !== id)),
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp outside provider");
  return ctx;
}
