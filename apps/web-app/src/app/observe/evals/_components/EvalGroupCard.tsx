import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import MonoTextBlock from "~/components/MonoTextBlock";
import { type EvalGroup } from "../page";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { ibmPlexSans } from "~/app/fonts";
import { Fragment } from "react";
import ConditionChip from "./ConditionChip";

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
            <Fragment key={i}>
              {i !== 0 && (
                <div className="text-xs font-medium text-muted-foreground">
                  AND
                </div>
              )}
              <ConditionChip condition={c} />
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
          {group.criteria.map((c) => (
            <div className="flex flex-col gap-1 rounded border p-2" key={c.id}>
              <MonoTextBlock>{c.name}</MonoTextBlock>
              <pre
                className={cn(
                  "px-2 text-muted-foreground",
                  ibmPlexSans.className,
                )}
              >
                {c.description}
              </pre>
            </div>
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
