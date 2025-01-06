import {
  CheckCircleIcon,
  PencilIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import {
  type EvaluationResultWithIncludes,
  type AggregateEvaluationResult,
} from "@repo/types/src/index";
import Link from "next/link";
import { type HTMLAttributes, useMemo } from "react";
import { cn } from "~/lib/utils";

export default function EvalResultChip({
  aggregateEvalResult,
  evalResult,
  isActive = false,
  editHref,
  ...props
}: {
  aggregateEvalResult?: AggregateEvaluationResult;
  evalResult?: EvaluationResultWithIncludes;
  isActive?: boolean;
  editHref?: string;
} & HTMLAttributes<HTMLDivElement>) {
  const _evalResult: AggregateEvaluationResult = useMemo(() => {
    if (aggregateEvalResult) {
      return aggregateEvalResult;
    }
    if (evalResult) {
      return {
        ...evalResult,
        numSucceeded: evalResult.success ? 1 : 0,
        total: 1,
      };
    } else {
      throw new Error("No eval result provided");
    }
  }, [aggregateEvalResult, evalResult]);

  return (
    <div
      key={_evalResult.id}
      className={cn(
        "group flex cursor-pointer items-start gap-1 border-l-2 p-1 pl-1 text-xs",
        _evalResult.numSucceeded === _evalResult.total
          ? "border-green-500 bg-green-100 text-green-500 hover:bg-green-200"
          : "border-red-500 bg-red-100 text-red-500 hover:bg-red-200",
        isActive &&
          (_evalResult.numSucceeded === _evalResult.total
            ? "bg-green-200"
            : "bg-red-200"),
      )}
      {...props}
    >
      {_evalResult.numSucceeded === _evalResult.total ? (
        <CheckCircleIcon className="size-4 shrink-0 text-green-500" />
      ) : (
        <XCircleIcon className="size-4 shrink-0 text-red-500" />
      )}
      {_evalResult.evaluation.evaluationTemplate.name}
      {_evalResult.total > 1 && (
        <div className="text-xs">
          {_evalResult.numSucceeded}/{_evalResult.total}
        </div>
      )}
      {editHref && (
        <Link href={editHref}>
          <PencilIcon
            onClick={(e) => {
              e.stopPropagation();
            }}
            onMouseEnter={(e) => {
              e.stopPropagation();
            }}
            onMouseLeave={(e) => {
              e.stopPropagation();
            }}
            className="size-4 shrink-0 cursor-pointer text-muted-foreground/70 opacity-0 transition-opacity hover:text-muted-foreground group-hover:opacity-100"
          />
        </Link>
      )}
    </div>
  );
}
