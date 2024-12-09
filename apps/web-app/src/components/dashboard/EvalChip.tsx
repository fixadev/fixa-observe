import { type Eval } from "@repo/types/src/generated";

export function EvalChip({ evaluation }: { evaluation: Eval }) {
  return (
    <div className="rounded-full bg-muted px-2 py-1 text-xs">
      {evaluation.name}
    </div>
  );
}
