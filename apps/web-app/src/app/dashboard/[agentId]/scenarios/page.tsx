"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ScenarioCard } from "~/app/_components/ScenarioCard";
import { useAgent } from "~/app/contexts/UseAgent";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { type ScenarioWithoutId, type Scenario } from "~/lib/agent";
import { api } from "~/trpc/react";

export default function AgentScenariosPage({
  params,
}: {
  params: { agentId: string };
}) {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const { agent, refetch } = useAgent(params.agentId);
  const { toast } = useToast();
  useEffect(() => {
    if (agent) {
      setScenarios(agent.scenarios);
    }
  }, [agent]);

  const { mutate: updateAgentScenarios } =
    api.agent.updateScenarios.useMutation({
      onSuccess: (data) => {
        setScenarios(data.scenarios);
        if (data) {
          void refetch();
          toast({
            title: "Scenarios updated!",
            duration: 2000,
          });
        }
      },
    });

  if (!agent) return null;

  const addScenario = () => {
    setScenarios([
      ...scenarios,
      {
        id: "new",
        name: "",
        instructions: "",
        successCriteria: "",
        agentId: agent.id,
        isNew: true,
      },
    ]);
  };

  const saveScenarios = (scenarios: Array<Scenario | ScenarioWithoutId>) => {
    toast({
      title: "Updating scenarios...",
      duration: 3000,
    });
    setScenarios(
      scenarios.map((scenario) => ({
        ...scenario,
        id: "id" in scenario ? scenario.id : "temp",
        agentId: agent.id,
      })),
    );
    updateAgentScenarios({ id: agent.id, scenarios });
  };

  return (
    <div>
      <div className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-input bg-[#FAFBFC] px-4 lg:h-[60px]">
        <Link href={`/dashboard/${params.agentId}/scenarios`}>
          <div className="font-medium">scenarios</div>
        </Link>
      </div>
      {/* <div className="container flex items-center justify-between py-8">
        <div className="text-2xl font-medium">scenarios</div>
      </div> */}
      <div className="container flex flex-col gap-4 p-4">
        {scenarios.map((scenario, index) => (
          <ScenarioCard
            index={index}
            key={scenario.id}
            scenario={scenario}
            scenarioId={scenario.id}
            scenarios={scenarios}
            setScenarios={saveScenarios}
          />
        ))}
        <div className="flex flex-row justify-end">
          <Button variant="outline" onClick={addScenario}>
            Add Scenario
          </Button>
        </div>
      </div>
    </div>
  );
}
