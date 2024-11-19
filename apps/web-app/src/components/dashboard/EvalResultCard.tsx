import { cn } from "~/lib/utils";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import type { EvalResultWithIncludes } from "~/lib/types";
import { usePointer } from "~/components/hooks/usePointer";

interface EvalResultCardProps {
  evalResult?: EvalResultWithIncludes;
}

export function EvalResultCard({ evalResult }: EvalResultCardProps) {
  const { x, y } = usePointer();

  if (!evalResult) return null;

  return (
    <div
      className="pointer-events-none fixed z-50 rounded-md bg-background"
      style={{
        left: `${x + 16}px`,
        top: `${y + 16}px`,
      }}
    >
      {
        <div
          key={evalResult.id}
          className={cn(
            "flex items-start gap-1 rounded-md px-2 py-2 shadow-lg",
            evalResult.success
              ? "border-green-500 bg-green-500/20 text-green-500"
              : "border-red-500 bg-red-500/20 text-red-500",
          )}
        >
          {evalResult.success ? (
            <CheckCircleIcon className="size-5 shrink-0" />
          ) : (
            <XCircleIcon className="size-5 shrink-0" />
          )}
          <div className="flex flex-col gap-0.5 text-sm">
            <div className="font-medium">{evalResult.eval.name}</div>
            <div className="text-xs">{evalResult.details}</div>
          </div>
        </div>
      }
    </div>
  );
}
