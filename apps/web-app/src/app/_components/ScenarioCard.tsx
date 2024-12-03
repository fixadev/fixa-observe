"use client";

import { type ScenarioWithEvals, type CreateScenarioSchema } from "~/lib/agent";
import { Label } from "~/components/ui/label";
import { Card } from "~/components/ui/card";
import { CopyText } from "~/components/CopyText";
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
    <Card className="flex w-full cursor-pointer flex-col items-center gap-2 overflow-hidden p-6 hover:bg-muted/40">
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
      <div className="flex w-full flex-col flex-wrap gap-2 overflow-hidden">
        <Label className="truncate whitespace-nowrap text-sm">
          test persona instructions
        </Label>
        <p className="line-clamp-2 min-w-0 overflow-hidden text-sm text-muted-foreground">
          {scenario.instructions}
        </p>
      </div>
      <div className="flex w-full flex-col flex-wrap gap-2 overflow-hidden">
        <Label className="whitespace-nowrap text-sm">evaluation criteria</Label>
        <div className="flex w-full flex-row flex-wrap gap-2 overflow-hidden">
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
    </Card>
  );
}
