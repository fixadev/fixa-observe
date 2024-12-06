import MonoTextBlock from "~/components/MonoTextBlock";
import { type EvalCondition } from "../page";
import { useMemo } from "react";

export default function ConditionChip({
  condition,
}: {
  condition: EvalCondition;
}) {
  const prefix = useMemo(() => {
    if (condition.type === "text") return "condition:";
    else if (condition.type === "filter") return "filter:";
    return "";
  }, [condition.type]);

  const body = useMemo(() => {
    if (condition.type === "text") return condition.text;
    else if (condition.type === "filter")
      return `${condition.property} == ${condition.value}`;
    return "";
  }, [condition]);

  return (
    <MonoTextBlock>
      <div className="flex items-baseline gap-1">
        {prefix && (
          <div className="text-xs text-muted-foreground">{prefix}</div>
        )}
        {body}
      </div>
    </MonoTextBlock>
  );
}
