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

export function EvalCard({
  evaluation,
  onUpdate,
  onDelete,
}: {
  evaluation: EvalWithoutScenarioId;
  onUpdate: (evaluation: EvalWithoutScenarioId) => void;
  onDelete: (id: string) => void;
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
        onClick={() => onDelete(evaluation.id)}
      >
        <XMarkIcon className="size-4" />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label>name</Label>
            <Input
              value={evaluation.name}
              className="w-full"
              placeholder="place correct order"
              onChange={(e) =>
                onUpdate({ ...evaluation, name: e.target.value })
              }
            />
          </div>
          <div>
            <Label>type</Label>
            <Select defaultValue="boolean" disabled>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="boolean">boolean</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>description</Label>
          <Textarea
            id={`eval-${evaluation.id}`}
            value={evaluation.description}
            placeholder="the agent correctly ordered a dozen donuts with sprinkles and a coffee"
            className="min-h-[100px]"
            onChange={(e) =>
              onUpdate({ ...evaluation, description: e.target.value })
            }
          />
        </div>
      </div>
    </Card>
  );
}
