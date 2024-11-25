"use client";

import { createContext, useContext, useState } from "react";

export type Filter = {
  lookbackPeriod: LookbackPeriod;
  timeRange?: {
    start: number;
    end: number;
  };
  agentId: string;
  regionId: string;
  latencyThreshold: {
    enabled: boolean;
    value: number;
  };
  interruptionThreshold: {
    enabled: boolean;
    value: number;
  };
};

export type LookbackPeriod = {
  label: string;
  value: number;
};

export const lookbackPeriods: LookbackPeriod[] = [
  { label: "24 hours", value: 24 * 60 * 60 * 1000 },
  { label: "2 days", value: 2 * 24 * 60 * 60 * 1000 },
  { label: "7 days", value: 7 * 24 * 60 * 60 * 1000 },
  { label: "30 days", value: 30 * 24 * 60 * 60 * 1000 },
];

interface ObserveStateContextType {
  selectedCallId: string | null;
  setSelectedCallId: (callId: string | null) => void;
  filter: Filter;
  setFilter: (filter: Filter) => void;
}

const ObserveStateContext = createContext<ObserveStateContextType | undefined>(
  undefined,
);

export function ObserveStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>({
    lookbackPeriod: lookbackPeriods[2]!,
    agentId: "all agents",
    regionId: "all regions",
    latencyThreshold: {
      enabled: true,
      value: 1000,
    },
    interruptionThreshold: {
      enabled: true,
      value: 1000,
    },
  });

  return (
    <ObserveStateContext.Provider
      value={{
        selectedCallId,
        setSelectedCallId,
        filter,
        setFilter,
      }}
    >
      {children}
    </ObserveStateContext.Provider>
  );
}

export function useObserveState() {
  const context = useContext(ObserveStateContext);
  if (context === undefined) {
    throw new Error(
      "useObserveState must be used within an ObserveStateProvider",
    );
  }
  return context;
}
