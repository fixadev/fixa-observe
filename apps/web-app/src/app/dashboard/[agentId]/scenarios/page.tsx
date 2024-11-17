"use client";

import Link from "next/link";
import { useState, useEffect, useMemo, useCallback } from "react";
import { ScenarioCard } from "~/app/_components/ScenarioCard";
import { useAgent } from "~/app/contexts/UseAgent";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import {
  type UpdateScenarioSchema,
  type CreateScenarioSchema,
  type ScenarioWithEvals,
  type EvalWithoutScenarioId,
} from "~/lib/agent";
import { api } from "~/trpc/react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { EvalResultType, EvalType } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card } from "~/components/ui/card";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTrigger,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

export default function AgentScenariosPage({
  params,
}: {
  params: { agentId: string };
}) {
  const [scenarios, setScenarios] = useState<ScenarioWithEvals[]>([]);
  const { agent, setAgent, refetch } = useAgent(params.agentId);
  const { toast } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] =
    useState<ScenarioWithEvals | null>(null);

  useEffect(() => {
    if (agent) {
      setScenarios(agent.scenarios);
    }
  }, [agent]);

  const { mutate: createScenario } = api.agent.createScenario.useMutation({
    onSuccess: (data) => {
      setScenarios([...scenarios.slice(0, -1), data]);
      if (agent && data) {
        setAgent({
          ...agent,
          scenarios: [...agent.scenarios, data],
        });
      }
      toast({
        title: "Scenario created",
        description: "Scenario created successfully",
        duration: 1000,
      });
    },
  });

  const { mutate: updateScenario } = api.agent.updateScenario.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Scenario updated",
        description: "Scenario updated successfully",
        duration: 1000,
      });
    },
  });

  const handleSaveScenario = (
    scenario: CreateScenarioSchema | ScenarioWithEvals,
  ) => {
    if ("id" in scenario && scenario.id !== "new") {
      setScenarios(scenarios.map((s) => (s.id === scenario.id ? scenario : s)));
      updateScenario({ scenario });
    } else {
      const newScenario = {
        ...scenario,
        id: "new",
        agentId: agent?.id ?? "",
        evals: scenario.evals.map((e) => ({
          ...e,
          createdAt: new Date(),
          scenarioId: undefined,
        })),
      };
      setScenarios([...scenarios, newScenario]);
      createScenario({ agentId: agent?.id ?? "", scenario: newScenario });
    }
    setIsDrawerOpen(false);
  };

  const { mutate: deleteScenario } = api.agent.deleteScenario.useMutation({
    onSuccess: () => {
      void refetch();
      toast({
        title: "Scenario deleted",
        description: "Scenario deleted successfully",
        duration: 1000,
      });
    },
  });

  const handleDeleteScenario = (id: string) => {
    setScenarios(scenarios.filter((s) => s.id !== id));
    if (!scenarios.find((s) => s.id === id)?.isNew) {
      deleteScenario({ id });
    }
    setIsDrawerOpen(false);
  };

  if (!agent) return null;

  const addScenario = () => {
    setSelectedScenario(null);
    setIsDrawerOpen(true);
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
        <div className="flex flex-row justify-end">
          <Button variant="outline" onClick={addScenario}>
            add scenario
          </Button>
        </div>
      </div>

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

function ScenarioSheet({
  selectedScenario,
  isDrawerOpen,
  setIsDrawerOpen,
  saveScenario,
  deleteScenario,
}: {
  selectedScenario: ScenarioWithEvals | null;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  saveScenario: (scenario: UpdateScenarioSchema) => void;
  deleteScenario: (id: string) => void;
}) {
  const emptyEval = useMemo<EvalWithoutScenarioId>(() => {
    return {
      id: "",
      name: "",
      description: "",
      type: EvalType.scenario,
      resultType: EvalResultType.boolean,
      createdAt: new Date(),
      agentId: null,
      scenarioId: null,
      ownerId: null,
    };
  }, []);

  const [name, setName] = useState(selectedScenario?.name ?? "");
  const [instructions, setInstructions] = useState(
    selectedScenario?.instructions ?? "",
  );

  const [evals, setEvals] = useState(
    selectedScenario?.evals && selectedScenario.evals.length > 0
      ? selectedScenario.evals
      : [emptyEval],
  );

  const addEval = useCallback(() => {
    setEvals((prev) => [...prev, { ...emptyEval, id: crypto.randomUUID() }]);
  }, [emptyEval]);

  const handleUpdateEval = useCallback(
    (evaluation: EvalWithoutScenarioId) => {
      setEvals(evals.map((e) => (e.id === evaluation.id ? evaluation : e)));
    },
    [evals],
  );

  useEffect(() => {
    setName(selectedScenario?.name ?? "");
    setInstructions(selectedScenario?.instructions ?? "");
    setEvals(
      selectedScenario?.evals && selectedScenario.evals.length > 0
        ? selectedScenario.evals
        : [emptyEval],
    );
  }, [selectedScenario, emptyEval]);

  const handleDeleteEval = useCallback((id: string) => {
    setEvals((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <SheetContent className="flex flex-col sm:max-w-[500px]">
        <SheetHeader>
          <SheetTitle>
            {selectedScenario ? "edit scenario" : "new scenario"}
          </SheetTitle>
        </SheetHeader>
        <div className="-mx-6 flex-1 overflow-y-auto px-6">
          <div className="mt-6 flex flex-col gap-8 pb-8">
            <div>
              <Label className="text-base">scenario name</Label>
              <Input
                placeholder="place an order"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-base">test agent instructions</Label>
              <div className="mb-2 text-sm text-muted-foreground">
                what our test agent will do when it calls your agent
              </div>
              <Textarea
                placeholder="order a dozen donuts with sprinkles and a coffee"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label className="text-base">evaluation criteria</Label>
              <div className="mb-2 text-sm text-muted-foreground">
                the criteria on which we evaluate your agent
              </div>
              <div className="flex flex-col gap-2">
                {evals.map((evaluation) => (
                  <EvalCard
                    key={evaluation.id}
                    evaluation={evaluation}
                    onUpdate={handleUpdateEval}
                    onDelete={handleDeleteEval}
                  />
                ))}
                <div
                  className="flex cursor-pointer justify-center rounded-md bg-muted/70 p-4 text-sm font-medium text-muted-foreground hover:bg-muted"
                  onClick={addEval}
                >
                  + add criteria
                </div>
              </div>
            </div>
          </div>
        </div>
        <SheetFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <TrashIcon className="size-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this scenario.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteScenario(selectedScenario?.id ?? "")}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div className="flex-1" />
          <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
            cancel
          </Button>
          <Button
            onClick={() =>
              selectedScenario
                ? saveScenario({
                    ...selectedScenario,
                    name,
                    instructions,
                    evals,
                  })
                : saveScenario({
                    id: "new",
                    name,
                    instructions,
                    evals,
                    agentId: "",
                    successCriteria: "",
                    isNew: false,
                  })
            }
          >
            save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function EvalCard({
  evaluation,
  onUpdate,
  onDelete,
}: {
  evaluation: EvalWithoutScenarioId;
  onUpdate: (evaluation: EvalWithoutScenarioId) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Card className="relative">
      <div
        className="absolute right-0 top-0 cursor-pointer p-2 text-muted-foreground hover:text-foreground"
        onClick={() => onDelete(evaluation.id)}
      >
        <XMarkIcon className="size-4" />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label>name</Label>
            <Input
              value={evaluation.name}
              className="w-full"
              placeholder="agent got the order correct"
              onChange={(e) =>
                onUpdate({ ...evaluation, name: e.target.value })
              }
            />
          </div>
          <div>
            <Label>type</Label>
            <Select defaultValue="boolean" disabled>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="boolean">boolean</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>description</Label>
          <Textarea
            value={evaluation.description}
            placeholder="whether the agent correctly ordered a dozen donuts with sprinkles and a coffee"
            className="min-h-[100px]"
            onChange={(e) =>
              onUpdate({ ...evaluation, description: e.target.value })
            }
          />
        </div>
      </div>
    </Card>
  );
}
