"use client";

import { type ScenarioWithEvals, type CreateScenarioSchema } from "~/lib/agent";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useState } from "react";
import { Card } from "~/components/ui/card";
import { CopyText } from "~/components/dashboard/CopyText";
import { cn } from "~/lib/utils";

interface ScenarioCardProps {
  scenario: CreateScenarioSchema | ScenarioWithEvals;
  index: number;
  // deleteScenario: (index: number) => void;
  // handleSaveScenario: (
  //   scenario: CreateScenarioSchema | ScenarioWithEvals,
  //   index: number,
  // ) => void;
}

export function ScenarioCard({ scenario }: ScenarioCardProps) {
  return (
    <Card>
      {/* {editMode ? (
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
      ) : ( */}
      <div className="flex w-full cursor-pointer flex-col items-center gap-2 p-6 hover:bg-muted/40">
        <div className="flex w-full flex-row justify-between gap-2">
          <div className="flex flex-row items-baseline gap-4">
            <Label
              className={cn("shrink-0 text-lg", {
                "text-muted-foreground": scenario.name.length === 0,
              })}
            >
              {scenario.name.length > 0 ? scenario.name : "untitled "}
            </Label>
            {"id" in scenario && (
              <div onClick={(e) => e.stopPropagation()}>
                <CopyText className="hover:bg-background" text={scenario.id} />
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full flex-row gap-2">
          <Label className="whitespace-nowrap text-sm">
            test agent instructions
          </Label>
          <p className="truncate text-sm">{scenario.instructions}</p>
        </div>
        <div className="flex w-full flex-row items-center gap-2">
          <Label className="whitespace-nowrap text-sm">
            evaluation criteria
          </Label>
          {scenario.evals.map((evaluation) => (
            <div
              key={evaluation.id}
              className="flex flex-row rounded-sm border border-input p-2 text-muted-foreground shadow-sm"
            >
              <p key={evaluation.id} className="truncate text-sm">
                {evaluation.name}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* )} */}
    </Card>
  );
}
