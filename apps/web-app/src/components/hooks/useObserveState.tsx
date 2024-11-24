"use client";

import { createContext, useContext, useState } from "react";

interface ObserveStateContextType {
  selectedCallId: string | null;
  setSelectedCallId: (callId: string | null) => void;
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

  return (
    <ObserveStateContext.Provider
      value={{
        selectedCallId,
        setSelectedCallId,
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
