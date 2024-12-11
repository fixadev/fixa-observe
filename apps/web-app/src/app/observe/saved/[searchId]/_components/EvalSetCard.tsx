import { CardContent, CardHeader } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { Button } from "~/components/ui/button";
import { cn, isTempId } from "~/lib/utils";
import { Fragment, useCallback } from "react";
import { CriteriaBlock } from "./CriteriaBlock";
import { instantiateEval } from "~/lib/instantiate";
import { EditableText } from "~/components/EditableText";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { EvalSetWithIncludes } from "@repo/types/src/index";
import { Input } from "~/components/ui/input";

export default function EvalSetCard({
  evalSet,
  onUpdate,
}: {
  evalSet: EvalSetWithIncludes;
  onUpdate: (evaluation: EvalSetWithIncludes) => void;
}) {
  const addCriteria = useCallback(() => {
    onUpdate({
      ...evalSet,
      evals: [...evalSet.evals, instantiateEval({ evalSetId: evalSet.id })],
    });
  }, [evalSet, onUpdate]);

  return (
    <div
      className={cn(
        "p-0 text-sm transition-opacity",
        !evalSet.enabled && "opacity-60",
      )}
    >
      <CardHeader className="flex flex-col gap-2 px-0 py-2">
        <div className="flex items-center gap-1">
          <EditableText
            value={evalSet.name}
            onValueChange={(value) => onUpdate({ ...evalSet, name: value })}
            initialEditing={isTempId(evalSet.id)}
            className="text-base font-medium"
            inputClassName="text-base"
            placeholder="enter evaluation name..."
            inputPlaceholder={`enter evaluation name... (i.e. "appointment booking")`}
          />
          <Button variant="ghost" size="icon" className="size-7">
            <EllipsisHorizontalIcon className="size-5" />
          </Button>
        </div>
        {/* <Switch
          checked={evalSet.enabled}
          onCheckedChange={(checked) =>
            onUpdate({ ...evalSet, enabled: checked })
          }
        /> */}
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-0">
        <div className="text-xs font-medium text-muted-foreground">IF</div>
        <Input
          className="text-muted-foreground"
          value={evalSet.condition}
          onChange={(e) => onUpdate({ ...evalSet, condition: e.target.value })}
          placeholder="enter condition..."
        />
        <div className="text-xs font-medium text-muted-foreground">THEN</div>
        <div className="flex flex-col gap-2">
          {evalSet.evals.map((criteria) => (
            <CriteriaBlock
              key={criteria.id}
              criteria={criteria}
              onUpdate={(updated) => {
                onUpdate({
                  ...evalSet,
                  evals: evalSet.evals.map((e) =>
                    e.id === updated.id ? updated : e,
                  ),
                });
              }}
              onDelete={() => {
                onUpdate({
                  ...evalSet,
                  evals: evalSet.evals.filter((e) => e.id !== criteria.id),
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
    </div>
  );
}
