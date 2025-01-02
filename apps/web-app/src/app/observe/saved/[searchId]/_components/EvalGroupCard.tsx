"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { api } from "~/trpc/react";
import type {
  EvaluationGroupWithIncludes,
  Filter,
} from "@repo/types/src/index";

interface EvalGroupCardProps {
  evalGroup: EvaluationGroupWithIncludes;
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  setSelectedEvalGroup: React.Dispatch<
    React.SetStateAction<EvaluationGroupWithIncludes | null>
  >;
  setEvalsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function EvalGroupCard({
  evalGroup,
  filter,
  setFilter,
  setSelectedEvalGroup: setSelectedEvalSet,
  setEvalsModalOpen,
}: EvalGroupCardProps) {
  const { mutate: updateGroup } = api.eval.updateGroup.useMutation({
    onSuccess: (data) => {
      setFilter({
        ...filter,
        evaluationGroups: filter.evaluationGroups?.map((e) =>
          e.id === evalGroup.id ? data : e,
        ),
      });
    },
  });

  const toggleEvalSetEnabled = (checked: boolean) => {
    updateGroup({
      ...evalGroup,
      enabled: checked,
    });
  };

  return (
    <Card key={evalGroup.id} className="flex flex-col gap-2 p-4">
      <CardHeader className="flex flex-row justify-between p-0">
        <div className="flex flex-row items-center gap-4">
          <Switch
            checked={evalGroup.enabled}
            onCheckedChange={toggleEvalSetEnabled}
          />
          <CardTitle className="p-0 text-sm font-medium">
            {evalGroup.name}
          </CardTitle>
        </div>
        <Button
          onClick={() => {
            setSelectedEvalSet(evalGroup);
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
              setFilter({
                ...filter,
                evaluationGroupResult: value
                  ? {
                      id: evalGroup.id,
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
