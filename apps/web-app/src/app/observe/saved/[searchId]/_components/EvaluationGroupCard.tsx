"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { api } from "~/trpc/react";
import type { EvaluationGroupWithIncludes } from "@repo/types/src/index";
import { useObserveState } from "~/components/hooks/useObserveState";

interface EvaluationGroupCardProps {
  evaluationGroup: EvaluationGroupWithIncludes;
  setSelectedEvaluationGroup: React.Dispatch<
    React.SetStateAction<EvaluationGroupWithIncludes | null>
  >;
  setEvalsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function EvaluationGroupCard({
  evaluationGroup,
  setSelectedEvaluationGroup,
  setEvalsModalOpen,
}: EvaluationGroupCardProps) {
  const { setSavedSearch, setFilter } = useObserveState();
  const { mutate: updateGroup } = api.evaluation.updateGroup.useMutation({
    onSuccess: (data) => {
      setSavedSearch((prev) =>
        prev
          ? {
              ...prev,
              evaluationGroups: prev.evaluationGroups?.map((e) =>
                e.id === evaluationGroup.id ? data : e,
              ),
            }
          : prev,
      );
    },
  });

  const toggleEvalSetEnabled = (checked: boolean) => {
    updateGroup({
      ...evaluationGroup,
      enabled: checked,
    });
  };

  return (
    <Card key={evaluationGroup.id} className="flex flex-col gap-2 p-4">
      <CardHeader className="flex flex-row justify-between p-0">
        <div className="flex flex-row items-center gap-4">
          <Switch
            checked={evaluationGroup.enabled}
            onCheckedChange={toggleEvalSetEnabled}
          />
          <CardTitle className="p-0 text-sm font-medium">
            {evaluationGroup.name}
          </CardTitle>
        </div>
        <Button
          onClick={() => {
            setSelectedEvaluationGroup(evaluationGroup);
            setEvalsModalOpen(true);
          }}
          variant="outline"
        >
          edit
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-between gap-2 p-0">
        <div className="flex w-full flex-row items-center justify-between gap-2">
          <ToggleGroup
            type="single"
            onValueChange={(value: string) => {
              setFilter((prev) =>
                prev
                  ? {
                      ...prev,
                      evaluationGroupResult: value
                        ? {
                            id: evaluationGroup.id,
                            result: value === "all" ? null : value === "passed",
                          }
                        : undefined,
                    }
                  : prev,
              );
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
