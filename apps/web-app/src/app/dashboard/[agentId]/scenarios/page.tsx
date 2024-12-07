"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { useState, useEffect, useCallback } from "react";
import { ScenarioCard } from "~/app/_components/ScenarioCard";
import { useAgent } from "~/app/contexts/UseAgent";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/hooks/use-toast";
import {
  type CreateScenarioSchema,
  type ScenarioWithEvals,
} from "~/lib/scenario";

import { EvalContentType } from "@prisma/client";
import { Card, CardTitle, CardHeader } from "~/components/ui/card";
import { GenerateScenariosModal } from "./GenerateScenariosModal";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { ScenarioSheet } from "./components/ScenarioSheet";
import { useSearchParams } from "next/navigation";

export default function AgentScenariosPage({
  params,
}: {
  params: { agentId: string };
}) {
  const { agent, setAgent } = useAgent(params.agentId);
  const { toast } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] =
    useState<ScenarioWithEvals | null>(null);

  const searchParams = useSearchParams();
  const scenarioId = searchParams.get("scenarioId");

  const { mutate: createScenario } = api.scenario.create.useMutation({
    onSuccess: (data) => {
      if (agent && data) {
        setAgent({
          ...agent,
          scenarios: [...agent.scenarios.slice(0, -1), data],
        });
      }
      toast({
        title: "Scenario created",
        description: "Scenario created successfully",
        duration: 1000,
      });
    },
  });

  const { mutate: updateScenario } = api.scenario.update.useMutation({
    onSuccess: (data) => {
      if (agent && data) {
        setAgent({
          ...agent,
          scenarios: agent.scenarios.map((s) => (s.id === data.id ? data : s)),
        });
      }
      toast({
        title: "Scenario updated",
        description: "Scenario updated successfully",
        duration: 1000,
      });
    },
  });

  const { mutate: deleteScenario } = api.scenario.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Scenario deleted",
        description: "Scenario deleted successfully",
        duration: 1000,
      });
    },
  });

  const handleSaveScenario = useCallback(
    (scenario: CreateScenarioSchema | ScenarioWithEvals) => {
      if (!agent) return;
      if ("id" in scenario && scenario.id !== "new") {
        setAgent({
          ...agent,
          scenarios: agent.scenarios.map((s) =>
            s.id === scenario.id
              ? {
                  ...scenario,
                  evals: scenario.evals.map((e) => ({
                    ...e,
                    scenarioId: scenario.id,
                  })),
                  generalEvalOverrides: scenario.generalEvalOverrides.map(
                    (e) => ({
                      ...e,
                      scenarioId: scenario.id,
                    }),
                  ),
                }
              : s,
          ),
        });
        updateScenario({ scenario });
      } else {
        const newScenario: ScenarioWithEvals = {
          ...scenario,
          id: "new",
          agentId: agent?.id ?? "",
          createdAt: new Date(),
          evals: scenario.evals.map((e) => ({
            ...e,
            createdAt: new Date(),
            scenarioId: null,
            deleted: false,
            evalGroupId: null,
          })),
          generalEvalOverrides: scenario.generalEvalOverrides.map((e) => ({
            ...e,
            id: "creating...",
            createdAt: new Date(),
            deleted: false,
          })),
        };
        setAgent({
          ...agent,
          scenarios: [
            ...agent.scenarios,
            {
              ...newScenario,
              evals: newScenario.evals.map((e) => ({
                ...e,
                scenarioId: newScenario.id,
                contentType: e.contentType ?? EvalContentType.content,
              })),
              generalEvalOverrides: newScenario.generalEvalOverrides.map(
                (e) => ({
                  ...e,
                  scenarioId: newScenario.id,
                  agentId: agent?.id ?? "",
                }),
              ),
            },
          ],
        });
        createScenario({ agentId: agent?.id ?? "", scenario: newScenario });
      }
      setIsDrawerOpen(false);
    },
    [agent, createScenario, setAgent, setIsDrawerOpen, updateScenario],
  );

  const handleDeleteScenario = useCallback(
    (id: string) => {
      const scenario = agent?.scenarios.find((s) => s.id === id);
      if (!scenario?.isNew) {
        deleteScenario({ id });
      }
      if (agent && scenario) {
        setAgent({
          ...agent,
          scenarios: agent.scenarios.filter((s) => s.id !== id),
        });
      }
      setIsDrawerOpen(false);
    },
    [agent, deleteScenario, setAgent, setIsDrawerOpen],
  );

  const addScenario = useCallback(() => {
    setSelectedScenario(null);
    setIsDrawerOpen(true);
  }, [setSelectedScenario, setIsDrawerOpen]);

  // Add effect to handle initial scenario opening
  useEffect(() => {
    if (scenarioId && agent) {
      const scenario = agent.scenarios.find((s) => s.id === scenarioId);
      if (scenario) {
        setSelectedScenario(scenario);
        setIsDrawerOpen(true);
      }
    }
  }, [scenarioId, agent]);

  if (!agent) return null;

  return (
    <div className="h-full max-w-full">
      <div className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-input bg-sidebar px-4 lg:h-[60px]">
        <div className="flex flex-1 items-center gap-2">
          <SidebarTrigger />
          <Link href={`/dashboard/${params.agentId}/scenarios`}>
            <div className="font-medium">scenarios</div>
          </Link>
        </div>
      </div>
      <div className="container flex h-full flex-col gap-4 p-4">
        <div>
          <div className="text-lg font-medium">scenarios</div>
          <div className="text-sm text-muted-foreground">
            the scenarios to test this agent.
          </div>
        </div>
        {agent.scenarios.map((scenario, index) => (
          <div
            key={scenario.id}
            onClick={() => {
              setSelectedScenario(scenario);
              setIsDrawerOpen(true);
            }}
          >
            <ScenarioCard index={index} scenario={scenario} />
          </div>
        ))}
        {agent.scenarios.length > 0 ? (
          <div className="flex flex-row justify-end gap-4">
            <GenerateScenariosModal agent={agent} setAgent={setAgent}>
              <Button variant="outline">generate from prompt</Button>
            </GenerateScenariosModal>

            <Button variant="outline" onClick={addScenario}>
              add manually
            </Button>
          </div>
        ) : (
          <>
            <div className="flex h-full items-center justify-center p-4">
              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-lg font-medium">no scenarios yet.</div>
                  <div className="text-sm text-muted-foreground">
                    create scenarios to test your agent
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <GenerateScenariosModal agent={agent} setAgent={setAgent}>
                    <Button>generate from prompt</Button>
                  </GenerateScenariosModal>
                  <Button variant="outline" onClick={addScenario}>
                    add manually
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {agent.scenarios.length > 0 && agent.tests.length === 0 && (
        <Card className="fixed bottom-4 right-4 animate-slide-up">
          <CardHeader className="flex flex-col gap-2">
            <CardTitle>ready to run your first test?</CardTitle>
            <Button className="w-full" asChild>
              <Link href={`/dashboard/${params.agentId}`}>
                go to tests page
              </Link>
            </Button>
          </CardHeader>
        </Card>
      )}

      <ScenarioSheet
        selectedScenario={selectedScenario}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        saveScenario={handleSaveScenario}
        deleteScenario={handleDeleteScenario}
      />
    </div>
  );
}
