"use client";

import {
  useEffect,
  createContext,
  useContext,
  useCallback,
  useState,
  type ReactNode,
} from "react";
import { api } from "~/trpc/react";
import { type AgentWithIncludes } from "~/lib/types";

interface AgentContextType {
  agent: AgentWithIncludes | null;
  setAgent: (agent: AgentWithIncludes) => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: ReactNode }) {
  const [agent, setAgentState] = useState<AgentWithIncludes | null>(null);

  const setAgent = useCallback((newAgent: AgentWithIncludes) => {
    setAgentState(newAgent);
  }, []);

  return (
    <AgentContext.Provider value={{ agent, setAgent }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent(agentId?: string) {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error("useAgent must be used within an AgentProvider");
  }

  const { data: fetchedAgent, refetch: refetchAgent } = api.agent.get.useQuery(
    { id: agentId ?? "" },
    {
      enabled: !!agentId,
    },
  );

  useEffect(() => {
    if (fetchedAgent) {
      context.setAgent(fetchedAgent);
    }
  }, [fetchedAgent, context]);

  const refetch = useCallback(async () => {
    await refetchAgent();
  }, [refetchAgent]);

  return {
    agent: context.agent ?? fetchedAgent,
    refetch,
    setAgent: context.setAgent,
  };
}
