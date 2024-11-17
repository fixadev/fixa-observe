import { type Eval } from "prisma/generated/zod";

export function EvalChip({ evaluation }: { evaluation: Eval }) {
  return (
    <div className="rounded-full bg-muted py-1 px-2 text-xs">{evaluation.name}</div>
  );
}
