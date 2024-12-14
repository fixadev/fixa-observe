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
import { type Eval } from "@repo/types/src/index";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import React from "react";
import { useUser } from "@clerk/nextjs";
import { env } from "~/env";

export function EvalInput({
  evaluation,
  setEvaluation,
}: {
  evaluation: Eval;
  setEvaluation: (evaluation: Eval) => void;
}) {
  const { user } = useUser();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full flex-row justify-between gap-4">
        <InputWithLabel
          placeholder={
            evaluation.contentType === "tool"
              ? "order_updated"
              : "order confirmed"
          }
          className="w-full"
          label="name"
          value={evaluation.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEvaluation({ ...evaluation, name: e.target.value })
          }
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
                <SelectItem
                  id="tool"
                  value="tool"
                  disabled={user?.id !== env.NEXT_PUBLIC_OFONE_USER_ID}
                >
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
            placeholder="when the customer adds an item to the order"
            value={evaluation.description}
            onChange={(e) =>
              setEvaluation({ ...evaluation, description: e.target.value })
            }
          />
          <TextAreaWithLabel
            label="expected result?"
            placeholder="the order is updated with the new item"
            value={evaluation.toolCallExpectedResult}
            onChange={(e) =>
              setEvaluation({
                ...evaluation,
                toolCallExpectedResult: e.target.value,
              })
            }
          />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <TextAreaWithLabel
            label="success description"
            placeholder="the agent confirmed the customer's order of a dozen donuts with sprinkles and a coffee"
            value={evaluation.description}
            onChange={(e) =>
              setEvaluation({ ...evaluation, description: e.target.value })
            }
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
