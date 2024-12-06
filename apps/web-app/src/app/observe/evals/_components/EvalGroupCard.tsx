import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { type EvalGroup } from "../page";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { Fragment } from "react";
import ConditionChip from "./ConditionChip";
import CriteriaBlock from "./CriteriaBlock";

export default function EvalGroupCard({
  group,
  onUpdate,
}: {
  group: EvalGroup;
  onUpdate: (group: EvalGroup) => void;
}) {
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
          {group.conditions.map((c, i) => (
            <Fragment key={c.id}>
              {i !== 0 && (
                <div className="text-xs font-medium text-muted-foreground">
                  AND
                </div>
              )}
              <ConditionChip
                condition={c}
                onUpdate={(updated) => {
                  onUpdate({
                    ...group,
                    conditions: group.conditions.map((c) =>
                      c.id === updated.id ? updated : c,
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
          >
            + add condition
          </Button>
        </div>
        <div className="text-xs font-medium text-muted-foreground">THEN</div>
        <div className="flex flex-col gap-2">
          {group.evals.map((c) => (
            <CriteriaBlock key={c.id} criteria={c} />
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="w-fit text-muted-foreground opacity-50 transition-opacity hover:text-muted-foreground hover:opacity-100"
          >
            + add criteria
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
