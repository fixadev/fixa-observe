import { type EvaluationWithIncludes } from "@repo/types/src";

export function EvalChip({
  evaluation,
}: {
  evaluation: EvaluationWithIncludes;
}) {
  return (
    <div className="rounded-full bg-muted px-2 py-1 text-xs">
      {evaluation.evaluationTemplate.name}
    </div>
  );
}
