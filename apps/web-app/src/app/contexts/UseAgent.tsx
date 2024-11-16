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
  setAgent: React.Dispatch<React.SetStateAction<AgentWithIncludes | null>>;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: ReactNode }) {
  const [agent, setAgentState] = useState<AgentWithIncludes | null>(null);

  const setAgent = useCallback(
    (newAgent: React.SetStateAction<AgentWithIncludes | null>) => {
      setAgentState(newAgent);
    },
    [],
  );

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

  const utils = api.useUtils();
  const { data: fetchedAgent, refetch: refetchAgent } = api.agent.get.useQuery(
    { id: agentId ?? "" },
    {
      enabled: !!agentId,
    },
  );

  useEffect(() => {
    if (agentId !== context.agent?.id && fetchedAgent) {
      // console.log("invalidating agent", context.agent?.id);
      // void utils.agent.get.invalidate({ id: context.agent?.id ?? "" });
      void utils.agent.get.reset();
      console.log("setting agent", fetchedAgent);
      context.setAgent(fetchedAgent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedAgent]);

  const refetch = useCallback(async () => {
    await refetchAgent();
  }, [refetchAgent]);

  return {
    agent: context.agent ?? fetchedAgent,
    refetch,
    setAgent: context.setAgent,
  };
}
