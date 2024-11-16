"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ScenarioCard } from "~/app/_components/ScenarioCard";
import { useAgent } from "~/app/contexts/UseAgent";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { type CreateScenarioSchema, type ScenarioWithEvals } from "~/lib/agent";
import { api } from "~/trpc/react";

export default function AgentScenariosPage({
  params,
}: {
  params: { agentId: string };
}) {
  const [scenarios, setScenarios] = useState<ScenarioWithEvals[]>([]);
  const { agent, refetch } = useAgent(params.agentId);
  const { toast } = useToast();
  useEffect(() => {
    if (agent) {
      setScenarios(agent.scenarios);
    }
  }, [agent]);

  const { mutate: createScenario } = api.agent.createScenario.useMutation({
    onSuccess: (data) => {
      setScenarios([...scenarios.slice(0, -1), data]);
      void refetch();
    },
  });

  const handleCreateScenario = (scenario: CreateScenarioSchema) => {
    createScenario({ agentId: agent?.id ?? "", scenario });
  };

  const { mutate: updateScenario } = api.agent.updateScenario.useMutation({
    onSuccess: (data) => {
      setScenarios(scenarios.map((s) => (s.id === data.id ? data : s)));
    },
  });

  const handleUpdateScenario = (
    scenario: Omit<ScenarioWithEvals, "agentId">,
  ) => {
    updateScenario({ scenario: { ...scenario, agentId: agent?.id ?? "" } });
  };

  const { mutate: deleteScenario } = api.agent.deleteScenario.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const handleDeleteScenario = (index: number) => {
    setScenarios(scenarios.filter((_, i) => i !== index));
    if (scenarios[index]?.id) {
      deleteScenario({ id: scenarios[index].id });
    }
  };

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
        evals: [],
      },
    ]);
  };

  const saveScenarios = (
    scenarios: Array<ScenarioWithEvals | CreateScenarioSchema>,
  ) => {
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
            createScenario={handleCreateScenario}
            updateScenario={handleUpdateScenario}
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
