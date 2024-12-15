"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  type SelectItem,
  type Filter,
  type OrderBy,
  type SavedSearchWithIncludes,
} from "@repo/types/src/index";
export const lookbackPeriods: SelectItem[] = [
  { label: "24 hours", value: 24 * 60 * 60 * 1000 },
  { label: "2 days", value: 2 * 24 * 60 * 60 * 1000 },
  { label: "7 days", value: 7 * 24 * 60 * 60 * 1000 },
  { label: "30 days", value: 30 * 24 * 60 * 60 * 1000 },
];
export const chartPeriods: SelectItem[] = [
  { label: "5 min", value: 5 * 60 * 1000 },
  { label: "30 min", value: 30 * 60 * 1000 },
  { label: "1 hour", value: 60 * 60 * 1000 },
  { label: "6 hours", value: 6 * 60 * 60 * 1000 },
  { label: "12 hours", value: 12 * 60 * 60 * 1000 },
  { label: "24 hours", value: 24 * 60 * 60 * 1000 },
];
// Mapping from duration to chart period
export const defaultDurationToChartPeriod: Record<number, number> = {
  [60 * 60 * 1000]: chartPeriods[0]!.value,
  [2 * 24 * 60 * 60 * 1000]: chartPeriods[2]!.value,
  [7 * 24 * 60 * 60 * 1000]: chartPeriods[4]!.value,
  [30 * 24 * 60 * 60 * 1000]: chartPeriods[5]!.value,
};

export const defaultFilter: Filter = {
  agentId: [],
  lookbackPeriod: lookbackPeriods[1]!,
  chartPeriod: chartPeriods[2]!.value,
};

interface ObserveStateContextType {
  selectedCallId: string | null;
  setSelectedCallId: (callId: string | null) => void;

  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  resetFilter: () => void;

  orderBy: OrderBy | undefined;
  setOrderBy: (orderBy: OrderBy | undefined) => void;

  savedSearch: SavedSearchWithIncludes | undefined;
  setSavedSearch: React.Dispatch<
    React.SetStateAction<SavedSearchWithIncludes | undefined>
  >;
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

  const [filter, setFilter] = useState<Filter>(defaultFilter);
  const [orderBy, setOrderBy] = useState<OrderBy | undefined>();
  const [savedSearch, setSavedSearch] = useState<
    SavedSearchWithIncludes | undefined
  >();

  const resetFilter = useCallback(() => {
    setFilter(defaultFilter);
  }, []);

  const prevLookbackPeriod = useRef<number>(filter.lookbackPeriod.value);
  const prevTimeRange = useRef<{ start: number; end: number }>();
  useEffect(() => {
    if (
      prevLookbackPeriod.current !== filter.lookbackPeriod.value ||
      prevTimeRange.current?.start !== filter.timeRange?.start ||
      prevTimeRange.current?.end !== filter.timeRange?.end
    ) {
      prevLookbackPeriod.current = filter.lookbackPeriod.value;
      prevTimeRange.current = filter.timeRange ?? undefined;

      let duration = 0;
      if (filter.timeRange) {
        duration = filter.timeRange.end - filter.timeRange.start;
      } else {
        duration = filter.lookbackPeriod.value;
      }

      for (const item of Object.keys(defaultDurationToChartPeriod)) {
        if (duration <= parseInt(item)) {
          const chartPeriod = defaultDurationToChartPeriod[parseInt(item)]!;
          setFilter((prev) => ({ ...prev, chartPeriod }));
          return;
        }
      }
      setFilter((prev) => ({ ...prev, chartPeriod: chartPeriods[5]!.value }));
    }
  }, [filter.lookbackPeriod.value, filter.timeRange]);

  return (
    <ObserveStateContext.Provider
      value={{
        selectedCallId,
        setSelectedCallId,
        filter,
        setFilter,
        resetFilter,
        orderBy,
        setOrderBy,
        savedSearch,
        setSavedSearch,
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
