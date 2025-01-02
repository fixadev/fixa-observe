"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  type EvalSetAlert,
  type AlertWithDetails,
  type EvaluationGroupWithIncludes,
} from "@repo/types/src/index";
import { cn } from "~/lib/utils";
import {
  instantiateAlert,
  instantiateEvaluationGroup,
} from "~/lib/instantiate";
import { PlusIcon } from "@heroicons/react/24/solid";
import { EvalGroupDialog } from "./EvalGroupDialog";
import { CreateEditAlertDialog } from "./AlertDialog";
import { useObserveState } from "~/components/hooks/useObserveState";
import { AlertCard } from "./AlertCard";
import { EvalGroupCard } from "./EvalGroupCard";

export function EvalGroupsAndAlertsCard({ searchId }: { searchId: string }) {
  const { filter, setFilter } = useObserveState();
  const [mode, setMode] = useState<"evaluations" | "alerts">("evaluations");
  const [evalsModalOpen, setEvalsModalOpen] = useState(false);
  const [alertsModalOpen, setAlertsModalOpen] = useState(false);
  const [selectedEvalGroup, setSelectedEvalGroup] =
    useState<EvaluationGroupWithIncludes | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<AlertWithDetails | null>(
    null,
  );

  function getEvaluationSetName(alert: AlertWithDetails) {
    const evaluationSet = filter.evaluationGroups?.find(
      (evalGroup) => evalGroup.id === (alert.details as EvalSetAlert).evalSetId,
    );
    return evaluationSet?.name;
  }

  return (
    <Card className="flex h-[450px] w-1/2 flex-col">
      <div className="flex flex-row items-center gap-4 p-6 font-medium">
        <p
          onClick={() => setMode("evaluations")}
          className={cn(
            "cursor-pointer",
            mode === "evaluations" ? "text-primary" : "text-muted-foreground",
          )}
        >
          evaluations
        </p>
        <p
          onClick={() => setMode("alerts")}
          className={cn(
            "cursor-pointer",
            mode === "alerts" ? "text-primary" : "text-muted-foreground",
          )}
        >
          alerts
        </p>
      </div>
      <CardContent className="flex-1 overflow-y-auto">
        {mode === "evaluations" ? (
          <div className="flex flex-col gap-2">
            {filter.evaluationGroups?.map((evalGroup) => (
              <EvalGroupCard
                evalGroup={evalGroup}
                filter={filter}
                setFilter={setFilter}
                setSelectedEvalGroup={setSelectedEvalGroup}
                setEvalsModalOpen={setEvalsModalOpen}
                key={evalGroup.id}
              />
            ))}
            <div
              className="flex flex-row items-center gap-2 rounded-lg bg-muted/70 p-4 text-muted-foreground hover:cursor-pointer hover:bg-muted"
              onClick={() => {
                setSelectedEvalGroup(
                  instantiateEvaluationGroup({ savedSearchId: searchId }),
                );
                setEvalsModalOpen(true);
              }}
            >
              <PlusIcon className="size-4" />
              <span className="text-sm">add evaluation</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filter.alerts?.map((alert) => (
              <AlertCard
                alert={alert}
                filter={filter}
                setFilter={setFilter}
                getEvaluationSetName={getEvaluationSetName}
                setSelectedAlert={setSelectedAlert}
                setAlertsModalOpen={setAlertsModalOpen}
                key={alert.id}
              />
            ))}
            <div
              className="flex flex-row items-center gap-2 rounded-md bg-muted/70 p-4 text-muted-foreground hover:cursor-pointer hover:bg-muted"
              onClick={() => {
                setSelectedAlert(instantiateAlert({ savedSearchId: searchId }));
                setAlertsModalOpen(true);
              }}
            >
              <PlusIcon className="size-4" />
              <span className="text-sm">add alert</span>
            </div>
          </div>
        )}
        <EvalGroupDialog
          open={evalsModalOpen}
          setOpen={setEvalsModalOpen}
          savedSearchId={searchId}
          selectedEvalGroup={selectedEvalGroup}
          voidSelectedEvalGroup={() => setSelectedEvalGroup(null)}
          filter={filter}
          setFilter={setFilter}
        />
        <CreateEditAlertDialog
          open={alertsModalOpen}
          setOpen={setAlertsModalOpen}
          selectedAlert={selectedAlert}
          savedSearchId={searchId}
          voidSelectedAlert={() => setSelectedAlert(null)}
          filter={filter}
          setFilter={setFilter}
        />
      </CardContent>
    </Card>
  );
}
