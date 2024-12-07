import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { type EvalGroup } from "../page";
import { Button } from "~/components/ui/button";
import { cn, generateTempId } from "~/lib/utils";
import { Fragment, useCallback } from "react";
import ConditionChip from "./ConditionChip";
import CriteriaBlock from "./CriteriaBlock";

export default function EvalGroupCard({
  group,
  onUpdate,
}: {
  group: EvalGroup;
  onUpdate: (group: EvalGroup) => void;
}) {
  const addCondition = useCallback(() => {
    onUpdate({
      ...group,
      conditions: [
        ...group.conditions,
        { id: generateTempId(), type: "text", text: "" },
      ],
    });
  }, [group, onUpdate]);

  const addCriteria = useCallback(() => {
    onUpdate({
      ...group,
      evals: [
        ...group.evals,
        {
          id: generateTempId(),
          name: "",
          description: "",
        },
      ],
    });
  }, [group, onUpdate]);

  return (
    <Card
      className={cn(
        "text-sm transition-opacity",
        !group.enabled && "opacity-60",
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle>{group.name}</CardTitle>
        <Switch
          checked={group.enabled}
          onCheckedChange={(checked) =>
            onUpdate({ ...group, enabled: checked })
          }
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="text-xs font-medium text-muted-foreground">IF</div>
        <div className="group flex items-center gap-2">
          {group.conditions.map((condition, i) => (
            <Fragment key={condition.id}>
              {i !== 0 && (
                <div className="text-xs font-medium text-muted-foreground">
                  AND
                </div>
              )}
              <ConditionChip
                condition={condition}
                onUpdate={(updated) => {
                  onUpdate({
                    ...group,
                    conditions: group.conditions.map((c) =>
                      c.id === updated.id ? updated : c,
                    ),
                  });
                }}
                onDelete={() => {
                  onUpdate({
                    ...group,
                    conditions: group.conditions.filter(
                      (c) => c.id !== condition.id,
                    ),
                  });
                }}
              />
            </Fragment>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="w-fit text-muted-foreground opacity-50 transition-opacity hover:text-muted-foreground hover:opacity-100"
            onClick={addCondition}
          >
            + add condition
          </Button>
        </div>
        <div className="text-xs font-medium text-muted-foreground">THEN</div>
        <div className="flex flex-col gap-2">
          {group.evals.map((criteria) => (
            <CriteriaBlock
              key={criteria.id}
              criteria={criteria}
              onUpdate={(updated) => {
                onUpdate({
                  ...group,
                  evals: group.evals.map((e) =>
                    e.id === updated.id ? updated : e,
                  ),
                });
              }}
              onDelete={() => {
                onUpdate({
                  ...group,
                  evals: group.evals.filter((e) => e.id !== criteria.id),
                });
              }}
            />
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="w-fit text-muted-foreground opacity-50 transition-opacity hover:text-muted-foreground hover:opacity-100"
            onClick={addCriteria}
          >
            + add criteria
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
