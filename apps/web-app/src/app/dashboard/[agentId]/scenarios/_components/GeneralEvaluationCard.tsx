import { type EvaluationWithIncludes } from "@repo/types/src";
import { Card } from "~/components/ui/card";

interface GeneralEvaluationCardProps {
  evaluation: EvaluationWithIncludes;
  onClick: (id: string) => void;
}

export function GeneralEvaluationCard({
  evaluation,
  onClick,
}: GeneralEvaluationCardProps) {
  return (
    <Card
      className="group relative cursor-pointer p-3 transition-colors hover:bg-muted/50"
      onClick={() => onClick(evaluation.id)}
    >
      <div className="flex items-center justify-between">
        <div className="font-medium">{evaluation.evaluationTemplate.name}</div>
      </div>
    </Card>
  );
}
