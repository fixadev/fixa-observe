"use client";

import { type ScenarioWithEvals, type CreateScenarioSchema } from "~/lib/agent";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useState } from "react";
import { Card } from "~/components/ui/card";

interface ScenarioCardProps {
  scenario: CreateScenarioSchema | ScenarioWithEvals;
  index: number;
  deleteScenario: (index: number) => void;
  handleSaveScenario: (
    scenario: CreateScenarioSchema | ScenarioWithEvals,
    index: number,
  ) => void;
}

export function ScenarioCard({
  scenario,
  index,
  handleSaveScenario,
  deleteScenario,
}: ScenarioCardProps) {
  const [editMode, setEditMode] = useState(scenario.isNew);
  const [localScenario, setLocalScenario] = useState<
    CreateScenarioSchema | ScenarioWithEvals
  >(scenario);

  // useEffect(() => {
  //   if (scenario.isNew) {
  //     setLocalScenario({ ...scenario, isNew: false });
  //   }
  // }, [scenario.isNew, index, setLocalScenario, scenario]);

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
              onClick={() => deleteScenario(index)}
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
                  handleSaveScenario({ ...localScenario, isNew: false }, index);
                }}
              >
                save
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="group flex w-full cursor-pointer flex-col items-center gap-2 p-6 hover:bg-muted"
          onClick={() => setEditMode(true)}
        >
          <div className="flex w-full flex-row justify-between gap-2">
            <div className="flex flex-row items-baseline gap-4">
              <Label
                className={`text-lg ${scenario.name.length > 0 ? "" : "text-muted-foreground"}`}
              >
                {scenario.name.length > 0 ? scenario.name : "untitled "}
              </Label>
              {"id" in scenario && (
                <div className="text-sm text-muted-foreground">
                  {scenario.id}
                </div>
              )}
            </div>

            <PencilIcon className="invisible mt-[-8px] size-5 group-hover:visible group-hover:text-muted-foreground" />
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
