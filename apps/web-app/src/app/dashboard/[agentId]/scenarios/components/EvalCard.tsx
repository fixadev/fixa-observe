import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { type EvalWithoutScenarioId } from "~/lib/agent";
import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { EvalInput } from "~/app/_components/EvalInput";

export function EvalCard({
  evaluation,
  setEval,
  deleteEval,
}: {
  evaluation: EvalWithoutScenarioId;
  setEval: (evaluation: EvalWithoutScenarioId) => void;
  deleteEval: (id: string) => void;
}) {
  const searchParams = useSearchParams();
  const evalId = searchParams.get("evalId");

  // Add effect to scroll to and highlight eval
  useEffect(() => {
    if (evalId) {
      const evalElement = document.getElementById(
        `eval-${evalId}`,
      ) as HTMLTextAreaElement;
      if (evalElement) {
        evalElement.scrollIntoView({ behavior: "smooth", block: "center" });
        evalElement.focus();
        evalElement.setSelectionRange(
          evalElement.value.length,
          evalElement.value.length,
        );
      }
    }
  }, [evalId]);

  return (
    <Card className="relative">
      <div
        className="absolute right-0 top-0 cursor-pointer p-2 text-muted-foreground hover:text-foreground"
        onClick={() => deleteEval(evaluation.id)}
      >
        <XMarkIcon className="size-4" />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <EvalInput evaluation={evaluation} setEvaluation={setEval} />
      </div>
    </Card>
  );
}
