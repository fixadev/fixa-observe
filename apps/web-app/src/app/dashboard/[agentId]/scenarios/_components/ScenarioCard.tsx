"use client";

import { Label } from "~/components/ui/label";
import { Card } from "~/components/ui/card";
import { CopyText } from "~/components/CopyText";
import { cn } from "~/lib/utils";
import { type ScenarioWithIncludes } from "@repo/types/src";

interface ScenarioCardProps {
  scenario: ScenarioWithIncludes;
}

export function ScenarioCard({ scenario }: ScenarioCardProps) {
  return (
    <Card className="flex w-full cursor-pointer flex-col items-center gap-4 overflow-hidden p-6 hover:bg-muted/40">
      <div className="flex w-full flex-row items-baseline justify-between gap-4">
        <Label
          className={cn("shrink-0 cursor-pointer text-base", {
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
      <div className="flex w-full flex-row flex-wrap gap-2 overflow-hidden">
        {scenario.evaluations?.map((evaluation) => (
          <div
            key={evaluation.id}
            className="flex flex-row rounded-sm border border-input p-2 text-muted-foreground shadow-sm"
          >
            <p key={evaluation.id} className="truncate text-sm">
              {evaluation.evaluationTemplate?.name}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
