"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type EvalSetAlert,
  type AlertWithDetails,
  type EvalSetWithIncludes,
  type Filter,
} from "@repo/types/src/index";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { instantiateAlert, instantiateEvalSet } from "~/lib/instantiate";
import { PlusIcon } from "@heroicons/react/24/solid";
import { CreateEditEvaluationDialog } from "./EvalSetDialog";
import { CreateEditAlertDialog } from "./AlertDialog";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { useObserveState } from "~/components/hooks/useObserveState";

export function EvalSetsAndAlertsCard({ searchId }: { searchId: string }) {
  const { filter, setFilter } = useObserveState();
  const [mode, setMode] = useState<"evaluations" | "alerts">("evaluations");
  const [evalsModalOpen, setEvalsModalOpen] = useState(false);
  const [alertsModalOpen, setAlertsModalOpen] = useState(false);
  const [selectedEvalSet, setSelectedEvalSet] =
    useState<EvalSetWithIncludes | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<AlertWithDetails | null>(
    null,
  );

  function getEvaluationSetName(alert: AlertWithDetails) {
    const evaluationSet = filter.evalSets?.find(
      (evalSet) => evalSet.id === (alert.details as EvalSetAlert).evalSetId,
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
            {filter.evalSets?.map((evalSet) => (
              <EvalSetCard
                evalSet={evalSet}
                filter={filter}
                setFilter={setFilter}
                setSelectedEvalSet={setSelectedEvalSet}
                setEvalsModalOpen={setEvalsModalOpen}
                key={evalSet.id}
              />
            ))}
            <div
              className="flex flex-row items-center gap-2 rounded-lg bg-muted/70 p-4 text-muted-foreground hover:cursor-pointer hover:bg-muted"
              onClick={() => {
                setSelectedEvalSet(
                  instantiateEvalSet({ savedSearchId: searchId }),
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
              <Card
                onClick={() => {
                  setSelectedAlert(alert);
                  setAlertsModalOpen(true);
                }}
                key={alert.id}
                className="flex flex-col gap-4 p-4 hover:cursor-pointer hover:bg-muted/40"
              >
                <CardHeader className="p-0">
                  <CardTitle className="p-0 text-sm font-medium">
                    {alert.type === "latency"
                      ? `latency ${alert.details.percentile} >= ${alert.details.threshold}ms`
                      : `${getEvaluationSetName(alert)} ${
                          alert.details.trigger === null
                            ? "is triggered"
                            : alert.details.trigger
                              ? "succeeds"
                              : "fails"
                        }`}
                  </CardTitle>
                  <CardContent></CardContent>
                </CardHeader>
              </Card>
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
        <CreateEditEvaluationDialog
          open={evalsModalOpen}
          setOpen={setEvalsModalOpen}
          savedSearchId={searchId}
          selectedEvalSet={selectedEvalSet}
          voidSelectedEvalSet={() => setSelectedEvalSet(null)}
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

function EvalSetCard({
  evalSet,
  filter,
  setFilter,
  setSelectedEvalSet,
  setEvalsModalOpen,
}: {
  evalSet: EvalSetWithIncludes;
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  setSelectedEvalSet: React.Dispatch<
    React.SetStateAction<EvalSetWithIncludes | null>
  >;
  setEvalsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Card key={evalSet.id} className="flex flex-col gap-2 p-4">
      <CardHeader className="flex flex-row justify-between p-0">
        <CardTitle className="p-0 text-sm font-medium">
          {evalSet.name}
        </CardTitle>
        <Button
          onClick={() => {
            setSelectedEvalSet(evalSet);
            setEvalsModalOpen(true);
          }}
          variant="outline"
        >
          edit
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-between gap-2 p-0">
        {/* <SuccessRateChart /> */}
        <div className="flex w-full flex-row items-center justify-between gap-2">
          <ToggleGroup
            type="single"
            onValueChange={(value: string) => {
              setFilter({
                ...filter,
                evalSetToSuccess: value
                  ? {
                      id: evalSet.id,
                      result: value === "all" ? null : value === "passed",
                    }
                  : undefined,
              });
            }}
            className="text-xs"
          >
            <ToggleGroupItem
              value="all"
              className="text-xs data-[state=off]:text-muted-foreground"
            >
              all
            </ToggleGroupItem>
            <ToggleGroupItem
              value="passed"
              className="text-xs data-[state=off]:text-muted-foreground"
            >
              passed
            </ToggleGroupItem>
            <ToggleGroupItem
              value="failed"
              className="text-xs data-[state=off]:text-muted-foreground"
            >
              failed
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardContent>
    </Card>
  );
}
