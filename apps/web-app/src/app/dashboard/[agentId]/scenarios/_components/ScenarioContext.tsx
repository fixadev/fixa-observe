import {
  createContext,
  type SetStateAction,
  type Dispatch,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { Scenario } from "../new-types";

interface ScenarioContextType {
  scenario?: Scenario;
  setScenario: Dispatch<SetStateAction<Scenario | undefined>>;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

const ScenarioContext = createContext<ScenarioContextType | undefined>(
  undefined,
);

export function ScenarioProvider({ children }: { children: ReactNode }) {
  const [scenario, setScenario] = useState<Scenario>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <ScenarioContext.Provider
      value={{
        scenario,
        setScenario,
        isDialogOpen,
        setIsDialogOpen,
      }}
    >
      {children}
    </ScenarioContext.Provider>
  );
}

export function useScenario() {
  const context = useContext(ScenarioContext);
  if (context === undefined) {
    throw new Error("useScenario must be used within a ScenarioProvider");
  }
  return context;
}
