"use client";

import { type ScenarioWithEvals, type CreateScenarioSchema } from "~/lib/agent";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useEffect, useState } from "react";
import { Card } from "~/components/ui/card";
import { CopyText } from "~/components/dashboard/CopyText";
import { cn } from "~/lib/utils";

interface ScenarioCardProps {
  scenario: CreateScenarioSchema;
  scenarioId?: string;
  index: number;
  scenarios: Array<ScenarioWithEvals | CreateScenarioSchema>;
  setScenarios: (
    scenarios: Array<ScenarioWithEvals | CreateScenarioSchema>,
  ) => void;
}

export function ScenarioCard({
  scenario,
  scenarioId,
  index,
  scenarios,
  setScenarios,
}: ScenarioCardProps) {
  const [editMode, setEditMode] = useState(scenario.isNew);
  const [localScenario, setLocalScenario] = useState(scenario);

  const removeScenario = (index: number) => {
    setScenarios(scenarios.filter((_, iIndex) => iIndex !== index));
  };

  useEffect(() => {
    if (scenario.isNew) {
      setLocalScenario({ ...scenario, isNew: false });
    }
  }, [scenario.isNew, index, setLocalScenario, scenario]);

  return (
    <Card>
      {editMode ? (
        <div className="flex w-full flex-col gap-2 p-6">
          <Label>name</Label>
          <Input
            autoFocus={localScenario.name === ""}
            value={localScenario.name}
            placeholder="donut ordering flow"
            onChange={(e) =>
              setLocalScenario({ ...localScenario, name: e.target.value })
            }
          />
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-2">
              <Label>prompt</Label>
            </div>
            <Textarea
              className="h-[125px] overflow-y-auto"
              value={localScenario.instructions}
              placeholder="order a dozen donuts with sprinkles, ask for a receipt as well as a coffee"
              onChange={(e) =>
                setLocalScenario({
                  ...localScenario,
                  instructions: e.target.value,
                })
              }
            />
            <div className="flex flex-row items-center gap-2">
              <Label>success criteria</Label>
            </div>
            <Textarea
              className="h-[125px] overflow-y-auto"
              value={localScenario.successCriteria}
              placeholder="the agent successfully orders a dozen donuts with sprinkles and a coffee"
              onChange={(e) =>
                setLocalScenario({
                  ...localScenario,
                  successCriteria: e.target.value,
                })
              }
            />
          </div>
          <div className="flex w-full flex-row items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeScenario(index)}
            >
              <TrashIcon className="size-5" />
            </Button>
            <div className="flex flex-row items-center gap-2">
              <Button variant="outline" onClick={() => setEditMode(false)}>
                cancel
              </Button>
              <Button
                onClick={() => {
                  setEditMode(false);
                  setScenarios(
                    scenarios.map((i, iIndex) =>
                      iIndex === index ? localScenario : i,
                    ),
                  );
                }}
              >
                save
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="flex w-full cursor-pointer flex-col items-center gap-2 p-6 hover:bg-muted/40"
          onClick={() => setEditMode(true)}
        >
          <div className="flex w-full flex-row justify-between gap-2">
            <div className="flex flex-row items-baseline gap-4">
              <Label
                className={cn("shrink-0 text-lg", {
                  "text-muted-foreground": scenario.name.length === 0,
                })}
              >
                {scenario.name.length > 0 ? scenario.name : "untitled "}
              </Label>
              {scenarioId && (
                <div onClick={(e) => e.stopPropagation()}>
                  <CopyText className="hover:bg-background" text={scenarioId} />
                </div>
              )}
            </div>
          </div>
          <div className="flex w-full flex-row gap-2">
            <Label className="whitespace-nowrap text-sm">prompt</Label>
            <p className="truncate text-sm">{scenario.instructions}</p>
          </div>
          <div className="flex w-full flex-row gap-2">
            <Label className="whitespace-nowrap text-sm">
              success criteria
            </Label>
            <p className="truncate text-sm">{scenario.successCriteria}</p>
          </div>
        </div>
      )}
    </Card>
  );
}
