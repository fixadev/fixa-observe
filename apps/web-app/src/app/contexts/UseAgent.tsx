"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { type AgentWithIncludes } from "@repo/types/src/index";

interface AgentContextType {
  agent: AgentWithIncludes | null;
  setAgent: React.Dispatch<React.SetStateAction<AgentWithIncludes | null>>;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: ReactNode }) {
  const [agent, setAgent] = useState<AgentWithIncludes | null>(null);

  return (
    <AgentContext.Provider value={{ agent, setAgent }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error("useAgent must be used within an AgentProvider");
  }

  return {
    agent: context.agent,
    setAgent: context.setAgent,
  };
}
