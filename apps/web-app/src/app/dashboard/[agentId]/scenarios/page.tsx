"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ScenarioCard } from "~/app/_components/ScenarioCard";
import { useAgent } from "~/app/contexts/UseAgent";
import { Button } from "~/components/ui/button";
import { type CreateScenarioSchema, type ScenarioWithEvals } from "~/lib/agent";
import { api } from "~/trpc/react";

export default function AgentScenariosPage({
  params,
}: {
  params: { agentId: string };
}) {
  const [scenarios, setScenarios] = useState<ScenarioWithEvals[]>([]);
  const { agent, refetch } = useAgent(params.agentId);
  useEffect(() => {
    if (agent) {
      setScenarios(agent.scenarios);
    }
  }, [agent]);

  const { mutate: createScenario } = api.agent.createScenario.useMutation({
    onSuccess: (data) => {
      setScenarios([...scenarios.slice(0, -1), data]);
      void refetch();
      toast({
        title: "Scenario created",
        description: "Scenario created successfully",
      });
    },
  });

  const { mutate: updateScenario } = api.agent.updateScenario.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Scenario updated",
        description: "Scenario updated successfully",
      });
    },
  });

  const handleSaveScenario = (
    scenario: CreateScenarioSchema | ScenarioWithEvals,
    index: number,
  ) => {
    if ("id" in scenario && scenario.id !== "new") {
      setScenarios(scenarios.map((s) => (s.id === scenario.id ? scenario : s)));
      updateScenario({ scenario });
    } else {
      setScenarios([
        ...scenarios.slice(0, -1),
        { ...scenario, id: "new", agentId: agent?.id ?? "" },
      ]);
      createScenario({ agentId: agent?.id ?? "", scenario });
    }
  };

  const { mutate: deleteScenario } = api.agent.deleteScenario.useMutation({
    onSuccess: () => {
      void refetch();
      toast({
        title: "Scenario deleted",
        description: "Scenario deleted successfully",
      });
    },
  });

  const handleDeleteScenario = (index: number) => {
    setScenarios(scenarios.filter((_, i) => i !== index));
    if (scenarios[index]?.id) {
      deleteScenario({ id: scenarios[index].id });
    }
  };

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
        evals: [],
      },
    ]);
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
            handleSaveScenario={handleSaveScenario}
            deleteScenario={handleDeleteScenario}
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
