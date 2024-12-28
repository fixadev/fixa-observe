import { CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { cn, isTempId } from "~/lib/utils";
import { useCallback } from "react";
import { CriteriaBlock } from "./CriteriaBlock";
import { EditableText } from "~/components/EditableText";
import { type EvaluationGroupWithIncludes } from "@repo/types/src/index";
import { Input } from "~/components/ui/input";

export default function EvaluationGroupCard({
  evaluationGroup,
  onUpdate,
}: {
  evaluationGroup: EvaluationGroupWithIncludes;
  onUpdate: (evaluation: EvaluationGroupWithIncludes) => void;
}) {
  // TODO: Need to fix this to instantiate evaluation template as an evaluation
  const addCriteria = useCallback(() => {
    onUpdate({
      ...evaluationGroup,
      evaluations: [
        ...evaluationGroup.evaluations,
        instantiateEvaluation({ evaluationGroupId: evaluationGroup.id }),
      ],
    });
  }, [evaluationGroup, onUpdate]);

  return (
    <div
      className={cn(
        "p-0 text-sm transition-opacity",
        !evaluationGroup.enabled && "opacity-60",
      )}
    >
      <CardHeader className="flex flex-col gap-2 px-0 py-2">
        <div className="flex items-center gap-1">
          <EditableText
            value={evaluationGroup.name}
            onValueChange={(value) =>
              onUpdate({ ...evaluationGroup, name: value })
            }
            initialEditing={isTempId(evaluationGroup.id)}
            className="text-base font-medium"
            inputClassName="text-base"
            placeholder="enter evaluation name..."
            inputPlaceholder={`appointment booking`}
          />
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
          value={evaluationGroup.condition}
          onChange={(e) =>
            onUpdate({ ...evaluationGroup, condition: e.target.value })
          }
          placeholder="user asks to book appointment"
        />
        <div className="text-xs font-medium text-muted-foreground">THEN</div>
        <div className="flex flex-col gap-2">
          {evaluationGroup.evals.map((criteria) => (
            <CriteriaBlock
              key={criteria.id}
              criteria={criteria}
              onUpdate={(updated) => {
                onUpdate({
                  ...evaluationGroup,
                  evals: evaluationGroup.evals.map((e) =>
                    e.id === updated.id ? updated : e,
                  ),
                });
              }}
              onDelete={() => {
                onUpdate({
                  ...evaluationGroup,
                  evals: evaluationGroup.evals.filter(
                    (e) => e.id !== criteria.id,
                  ),
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
