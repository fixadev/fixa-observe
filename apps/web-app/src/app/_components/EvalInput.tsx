import { Label } from "~/components/ui/label";
import { InputWithLabel } from "./InputWithLabel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Switch } from "~/components/ui/switch";
import { TextAreaWithLabel } from "./TextAreaWithLabel";
import { type EvalSchema } from "~/lib/eval";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

export function EvalInput({
  evaluation,
  setEvaluation,
}: {
  evaluation: EvalSchema;
  setEvaluation: (evaluation: EvalSchema) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full flex-row justify-between gap-4">
        <InputWithLabel
          className="w-full"
          label="name"
          value={evaluation.name}
          onChange={(e) => setEvaluation({ ...evaluation, name: e })}
        />
        <div className="flex flex-col gap-2">
          <Label>type</Label>
          <div className="w-[100px]">
            <Select
              value={evaluation.contentType}
              onValueChange={(value) =>
                setEvaluation({
                  ...evaluation,
                  contentType: value as "tool" | "content",
                })
              }
            >
              <SelectTrigger>
                <SelectValue defaultValue="content" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem id="content" value="content">
                  content
                </SelectItem>
                <SelectItem id="tool" value="tool">
                  tool
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label>result type</Label>
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="boolean" />
            </SelectTrigger>
          </Select>
        </div>
      </div>
      {evaluation.contentType === "tool" ? (
        <div className="flex flex-col gap-4">
          <TextAreaWithLabel
            label="when should this tool be called?"
            value={evaluation.description}
            onChange={(e) => setEvaluation({ ...evaluation, description: e })}
          />
          <TextAreaWithLabel
            label="expected result?"
            value={evaluation.toolCallExpectedResult}
            onChange={(e) =>
              setEvaluation({ ...evaluation, toolCallExpectedResult: e })
            }
          />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <TextAreaWithLabel
            label="success description"
            value={evaluation.description}
            onChange={(e) => setEvaluation({ ...evaluation, description: e })}
          />
        </div>
      )}
      <div className="flex flex-row items-center gap-2">
        <Switch
          id="is-critical"
          checked={evaluation.isCritical}
          onCheckedChange={(e) =>
            setEvaluation({ ...evaluation, isCritical: e })
          }
        />
        <Label htmlFor="is-critical">is critical?</Label>
        <Tooltip>
          <TooltipTrigger>
            <InformationCircleIcon className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            if this evaluation fails, the call will be marked as failed
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
