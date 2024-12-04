import { useEffect, useState, useCallback, useMemo } from "react";
import { useTimezoneSelect } from "react-timezone-select";
import { useToast } from "~/components/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
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
import {
  type EvalOverrideWithoutScenarioId,
  type EvalWithoutScenarioId,
  type UpdateScenarioSchema,
} from "~/lib/agent";
import { type ScenarioWithEvals } from "~/lib/agent";
import { EvalContentType, EvalResultType, EvalType } from "@prisma/client";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { EvalCard } from "./EvalCard";
import { Button } from "~/components/ui/button";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { type EvalOverride } from "prisma/generated/zod";

export function ScenarioSheet({
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
      enabled: true,
      toolCallExpectedResult: "",
      isCritical: true,
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

  const [evalOverrides, setEvalOverrides] = useState<
    EvalOverrideWithoutScenarioId[]
  >(selectedScenario?.generalEvalOverrides ?? []);

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
    setEvalOverrides(selectedScenario?.generalEvalOverrides ?? []);
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
          generalEvalOverrides: [],
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

  const emptyEvalOverride = useMemo<EvalOverrideWithoutScenarioId>(() => {
    return {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      enabled: true,
      evalId: "",
    };
  }, []);

  const addEvalOverride = useCallback(() => {
    setEvalOverrides((prev) => [
      ...prev,
      { ...emptyEvalOverride, id: crypto.randomUUID() },
    ]);
  }, [emptyEvalOverride]);

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
                  onClick={(e) => e.stopPropagation()}
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
            {/* <div className="flex flex-row justify-between">
              <div>
                <Label className="text-base">general evaluation criteria</Label>
                {evalOverrides.length > 0 ? (
                  <div className="text-sm text-muted-foreground">
                    {`${evalOverrides.length} override${
                      evalOverrides.length === 1 ? "" : "s"
                    }`}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    currently using defaults
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                className="gap-2"
                onClick={addEvalOverride}
              >
                <PlusIcon className="size-4" />
                add override
              </Button>
            </div> */}
            <div>
              <Label className="text-base">
                scenario-specific evaluation criteria
              </Label>
              <div className="mb-2 text-sm text-muted-foreground">
                the criteria on which we evaluate your agent
              </div>
              <div className="flex flex-col gap-2">
                {evals.map((evaluation) => (
                  <EvalCard
                    key={evaluation.id}
                    evaluation={evaluation}
                    setEval={handleUpdateEval}
                    deleteEval={handleDeleteEval}
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
