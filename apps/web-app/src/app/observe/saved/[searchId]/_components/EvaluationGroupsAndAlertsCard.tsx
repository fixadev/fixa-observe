"use client";

import { useCallback, useState } from "react";
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
} from "@repo/utils/src/instantiate";
import { PlusIcon } from "@heroicons/react/24/solid";
import { EvaluationGroupDialog } from "./EvaluationGroupDialog";
import { CreateEditAlertDialog } from "./AlertDialog";
import { useObserveState } from "~/components/hooks/useObserveState";
import { AlertCard } from "./AlertCard";
import { EvaluationGroupCard } from "./EvaluationGroupCard";
import { Button } from "~/components/ui/button";
import { GenerateEvalGroupsDialog } from "./GenerateEvalGroupsDialog";

export function EvaluationGroupsAndAlertsCard({
  searchId,
}: {
  searchId: string;
}) {
  const { savedSearch } = useObserveState();

  const [mode, setMode] = useState<"evaluations" | "alerts">("evaluations");
  const [evalsModalOpen, setEvalsModalOpen] = useState(false);
  const [alertsModalOpen, setAlertsModalOpen] = useState(false);
  const [selectedEvaluationGroup, setSelectedEvaluationGroup] =
    useState<EvaluationGroupWithIncludes | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<AlertWithDetails | null>(
    null,
  );

  const getEvaluationSetName = useCallback(
    (alert: AlertWithDetails) => {
      const evaluationSet = savedSearch?.evaluationGroups?.find(
        (evaluationGroup) =>
          evaluationGroup.id === (alert.details as EvalSetAlert).evalSetId,
      );
      return evaluationSet?.name;
    },
    [savedSearch],
  );

  const handleAddEvaluationGroup = useCallback(() => {
    setSelectedEvaluationGroup(
      instantiateEvaluationGroup({ savedSearchId: searchId }),
    );
    setEvalsModalOpen(true);
  }, [searchId]);

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
          <div className="flex min-h-full w-full flex-1 flex-col">
            {savedSearch?.evaluationGroups?.length === 0 ? (
              <div className="flex flex-1 flex-col items-center gap-2">
                <div className="mt-[100px] flex flex-col justify-center">
                  <h3 className="text-lg font-medium">no evaluations yet.</h3>
                  <p className="text-sm text-muted-foreground">
                    create your first evaluation
                  </p>
                  <div className="flex flex-row items-center gap-2 pt-3">
                    <Button
                      variant="outline"
                      onClick={handleAddEvaluationGroup}
                    >
                      add manually
                    </Button>
                    <GenerateEvalGroupsDialog searchId={searchId} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex w-full flex-col gap-2">
                {savedSearch?.evaluationGroups?.map((evaluationGroup) => (
                  <EvaluationGroupCard
                    evaluationGroup={evaluationGroup}
                    setSelectedEvaluationGroup={setSelectedEvaluationGroup}
                    setEvalsModalOpen={setEvalsModalOpen}
                    key={evaluationGroup.id}
                  />
                ))}
                <div
                  className="flex flex-row items-center gap-2 rounded-lg bg-muted/70 p-4 text-muted-foreground hover:cursor-pointer hover:bg-muted"
                  onClick={handleAddEvaluationGroup}
                >
                  <PlusIcon className="size-4" />
                  <span className="text-sm">add evaluation</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {savedSearch?.alerts?.map((alert) => (
              <AlertCard
                alert={alert}
                getEvaluationSetName={getEvaluationSetName}
                setSelectedAlert={setSelectedAlert}
                setAlertsModalOpen={setAlertsModalOpen}
                key={alert.id}
              />
            ))}
            <div
              className="flex cursor-pointer flex-row items-center gap-2 rounded-md bg-muted/70 p-4 text-muted-foreground hover:bg-muted"
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
        <EvaluationGroupDialog
          open={evalsModalOpen}
          setOpen={setEvalsModalOpen}
          savedSearchId={searchId}
          selectedEvaluationGroup={selectedEvaluationGroup}
          voidSelectedEvaluationGroup={() => setSelectedEvaluationGroup(null)}
        />
        <CreateEditAlertDialog
          open={alertsModalOpen}
          setOpen={setAlertsModalOpen}
          selectedAlert={selectedAlert}
          savedSearchId={searchId}
          voidSelectedAlert={() => setSelectedAlert(null)}
        />
      </CardContent>
    </Card>
  );
}
