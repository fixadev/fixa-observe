"use client";

import Link from "next/link";
import { useState, useEffect, useMemo, useCallback } from "react";
import { ScenarioCard } from "~/app/_components/ScenarioCard";
import { useAgent } from "~/app/contexts/UseAgent";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/hooks/use-toast";
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
import { EvalContentType, EvalResultType, EvalType } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card, CardTitle, CardHeader } from "~/components/ui/card";
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
import { GenerateScenariosModal } from "./GenerateScenariosModal";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { Switch } from "~/components/ui/switch";
import { useTimezoneSelect } from "react-timezone-select";
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

  const { mutate: createScenario } = api.agent.createScenario.useMutation({
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

  const { mutate: updateScenario } = api.agent.updateScenario.useMutation({
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

  const { mutate: deleteScenario } = api.agent.deleteScenario.useMutation({
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
                }
              : s,
          ),
        });
        updateScenario({ scenario });
      } else {
        const newScenario = {
          ...scenario,
          id: "new",
          agentId: agent?.id ?? "",
          createdAt: new Date(),
          evals: scenario.evals.map((e) => ({
            ...e,
            createdAt: new Date(),
            scenarioId: undefined,
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
      id: crypto.randomUUID(),
      name: "",
      description: "",
      type: EvalType.scenario,
      resultType: EvalResultType.boolean,
      createdAt: new Date(),
      agentId: null,
      scenarioId: null,
      ownerId: null,
      contentType: EvalContentType.content,
    };
  }, []);

  const { toast } = useToast();

  const [name, setName] = useState(selectedScenario?.name ?? "");
  const [instructions, setInstructions] = useState(
    selectedScenario?.instructions ?? "",
  );

  const [evals, setEvals] = useState(
    selectedScenario?.evals && selectedScenario.evals.length > 0
      ? selectedScenario.evals
      : [emptyEval],
  );

  // Include date/time stuff
  const { options, parseTimezone } = useTimezoneSelect({});
  const [timezone, setTimezone] = useState(
    parseTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone),
  );
  const [includeDateTime, setIncludeDateTime] = useState(false);

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
    console.log("selectedScenario", selectedScenario);
    setName(selectedScenario?.name ?? "");
    setInstructions(selectedScenario?.instructions ?? "");
    setEvals(
      selectedScenario?.evals && selectedScenario.evals.length > 0
        ? selectedScenario.evals
        : [emptyEval],
    );
    setIncludeDateTime(selectedScenario?.includeDateTime ?? false);
    setTimezone(
      parseTimezone(
        selectedScenario?.timezone ??
          Intl.DateTimeFormat().resolvedOptions().timeZone,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedScenario, emptyEval]);

  const handleDeleteEval = useCallback((id: string) => {
    setEvals((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const handleSave = useCallback(() => {
    if (name.length === 0 || instructions.length === 0) {
      toast({
        title: "please enter a name and instructions",
        description: "name and instructions are required",
        variant: "destructive",
        duration: 1500,
      });
      return;
    }
    if (evals.some((e) => e.name.length === 0 || e.description.length === 0)) {
      toast({
        title:
          "please enter a name and description for each evaluation criteria",
        description: "name and description are required",
        variant: "destructive",
        duration: 1500,
      });
      return;
    }

    selectedScenario
      ? saveScenario({
          ...selectedScenario,
          name,
          instructions,
          evals,
          includeDateTime,
          timezone: includeDateTime ? timezone.value : null,
        })
      : saveScenario({
          id: "new",
          createdAt: new Date(),
          name,
          instructions,
          evals,
          agentId: "",
          successCriteria: "",
          isNew: false,
          includeDateTime,
          timezone: includeDateTime ? timezone.value : null,
        });
    setInstructions("");
    setName("");
    setEvals([emptyEval]);
  }, [
    name,
    instructions,
    evals,
    selectedScenario,
    saveScenario,
    includeDateTime,
    timezone.value,
    emptyEval,
    toast,
  ]);

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <SheetContent className="flex flex-col sm:max-w-[700px]">
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
              <Label className="text-base">test persona instructions</Label>
              <div className="mb-2 text-sm text-muted-foreground">
                what our test persona will do when it calls your agent
              </div>
              <Textarea
                placeholder="order a dozen donuts with sprinkles and a coffee"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label className="text-base">context</Label>
              <div className="mb-2 text-sm text-muted-foreground">
                additional context that will be provided to the evaluator
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="current-date-time"
                  checked={includeDateTime}
                  onCheckedChange={setIncludeDateTime}
                />
                <Label htmlFor="current-date-time">current date / time</Label>
                <div className="flex-1" />
                <Select
                  value={timezone.value}
                  onValueChange={(val) => setTimezone(parseTimezone(val))}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select a timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
          <Button onClick={handleSave}>save</Button>
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
  const searchParams = useSearchParams();
  const evalId = searchParams.get("evalId");

  // Add effect to scroll to and highlight eval
  useEffect(() => {
    if (evalId) {
      const evalElement = document.getElementById(
        `eval-${evalId}`,
      ) as HTMLTextAreaElement;
      if (evalElement) {
        evalElement.scrollIntoView({ behavior: "smooth", block: "center" });
        evalElement.focus();
        evalElement.setSelectionRange(
          evalElement.value.length,
          evalElement.value.length,
        );
      }
    }
  }, [evalId]);

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
              placeholder="place correct order"
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
            id={`eval-${evaluation.id}`}
            value={evaluation.description}
            placeholder="the agent correctly ordered a dozen donuts with sprinkles and a coffee"
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
