import {
  createContext,
  type SetStateAction,
  type Dispatch,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { type ScenarioWithIncludes } from "@repo/types/src";

// Contains the currently selected scenario and a function to set/update it
interface ScenarioContextType {
  scenario?: ScenarioWithIncludes;
  setScenario: Dispatch<SetStateAction<ScenarioWithIncludes | undefined>>;
}

const ScenarioContext = createContext<ScenarioContextType | undefined>(
  undefined,
);

export function ScenarioProvider({ children }: { children: ReactNode }) {
  const [scenario, setScenario] = useState<ScenarioWithIncludes>();

  return (
    <ScenarioContext.Provider
      value={{
        scenario,
        setScenario,
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
