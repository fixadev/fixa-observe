"use client";

import { createContext, useContext, useState } from "react";
import { type LookbackPeriod, type Filter, type OrderBy } from "~/lib/types";
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
  orderBy: OrderBy | undefined;
  setOrderBy: (orderBy: OrderBy | undefined) => void;
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
  });
  const [orderBy, setOrderBy] = useState<OrderBy | undefined>();

  return (
    <ObserveStateContext.Provider
      value={{
        selectedCallId,
        setSelectedCallId,
        filter,
        setFilter,
        orderBy,
        setOrderBy,
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
