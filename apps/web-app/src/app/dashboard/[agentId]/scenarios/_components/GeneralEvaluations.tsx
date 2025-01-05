"use client";

import { useAgent } from "~/app/contexts/UseAgent";
import { Button } from "~/components/ui/button";
import { GeneralEvaluationCard } from "./GeneralEvaluationCard";
import { GeneralEvaluationsDialog } from "./GeneralEvaluationsDialog";
import { useState } from "react";

export function GeneralEvaluations() {
  const { agent } = useAgent();
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-medium">general evaluations</div>
          <div className="text-sm text-muted-foreground">
            general evaluations are used to evaluate your agent&apos;s
            performance across all scenarios.
          </div>
        </div>
        <Button variant="outline" onClick={() => setDialogOpen(true)}>
          edit general evaluations
        </Button>
      </div>
      {agent && agent.generalEvaluations.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agent?.generalEvaluations.map((generalEvaluation) => (
            <GeneralEvaluationCard
              key={generalEvaluation.id}
              evaluation={generalEvaluation.evaluation}
              onClick={() => {
                setDialogOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="py-4 text-center text-sm font-medium text-muted-foreground">
          no general evaluations.
        </div>
      )}
      <GeneralEvaluationsDialog
        open={isDialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
