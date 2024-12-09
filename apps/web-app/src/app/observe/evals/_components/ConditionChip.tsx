"use client";

import MonoTextBlock from "~/components/MonoTextBlock";
import { useMemo, useState } from "react";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "~/components/ui/select";
import { QuestionMarkCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { cn, isTempId } from "~/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ibmPlexMono, ibmPlexSans } from "~/app/fonts";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";
import { type EvalGroupCondition } from "@repo/types/generated";

export default function ConditionChipWithPopover({
  condition,
  onUpdate,
  onDelete,
}: {
  condition: EvalGroupCondition;
  onUpdate: (condition: EvalGroupCondition) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(isTempId(condition.id));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div onClick={() => setOpen(true)}>
          <ConditionChip condition={condition} onDelete={onDelete} />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-2" align="start">
        <ConditionChipEditor condition={condition} onUpdate={onUpdate} />
      </PopoverContent>
    </Popover>
  );
}

export function ConditionChip({
  condition,
  onDelete,
}: {
  condition: EvalGroupCondition;
  onDelete: () => void;
}) {
  const prefix = useMemo(() => {
    if (condition.type === "text") return "condition:";
    else if (condition.type === "filter") return "filter:";
    return "";
  }, [condition.type]);

  const body = useMemo(() => {
    if (condition.type === "text") return condition.text;
    else if (condition.type === "filter")
      return `${condition.property} == ${condition.value}`;
    return "";
  }, [condition]);

  return (
    <MonoTextBlock className="cursor-pointer hover:bg-muted/60">
      <div className="flex items-center gap-1">
        <div className="flex items-baseline gap-1">
          {prefix && (
            <div className="text-xs text-muted-foreground">{prefix}</div>
          )}
          {body}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-5 p-0 hover:bg-gray-200"
          onClick={onDelete}
        >
          <XMarkIcon className="size-4 text-muted-foreground" />
        </Button>
      </div>
    </MonoTextBlock>
  );
}

export function ConditionChipEditor({
  condition,
  onUpdate,
}: {
  condition: EvalGroupCondition;
  onUpdate: (condition: EvalGroupCondition) => void;
}) {
  const helpText = useMemo(() => {
    if (condition.type === "text")
      return `specify when this evaluation should be run.\ne.g. "when the agent says X" or "true" to run on every call`;
    else if (condition.type === "filter")
      return "specify when this evaluation should be run based on a property of the call";
    return "";
  }, [condition.type]);

  return (
    <div className="flex items-center gap-1">
      <Select
        value={condition.type}
        onValueChange={(value) => {
          if (value === "text") {
            onUpdate({ ...condition, type: "text", text: "" });
          } else {
            onUpdate({
              ...condition,
              type: "filter",
              property: "agentId",
              value: "",
            });
          }
        }}
      >
        <SelectTrigger
          className={cn(
            "w-fit text-xs text-muted-foreground",
            ibmPlexMono.className,
          )}
        >
          <SelectValue placeholder="Select a condition" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="text">condition</SelectItem>
          <SelectItem value="filter">filter</SelectItem>
        </SelectContent>
      </Select>
      {condition.type === "text" ? (
        <Input
          value={condition.text}
          onChange={(e) => {
            onUpdate({ ...condition, text: e.target.value });
          }}
          autoFocus
          className={cn("w-[400px] text-sm", ibmPlexMono.className)}
          placeholder="when the agent says..."
        />
      ) : (
        <>
          <Select
            value={condition.property}
            onValueChange={(value) => {
              onUpdate({ ...condition, property: value });
            }}
          >
            <SelectTrigger className={cn("w-fit", ibmPlexMono.className)}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="agentId">agentId</SelectItem>
              <SelectItem value="customerId">customerId</SelectItem>
            </SelectContent>
          </Select>
          <div className={cn("mx-2 text-sm", ibmPlexMono.className)}>==</div>
          <Input
            value={condition.value}
            onChange={(e) => {
              onUpdate({ ...condition, value: e.target.value });
            }}
            autoFocus
            className={cn("w-[200px] text-sm", ibmPlexMono.className)}
            placeholder="enter a value"
          />
        </>
      )}
      <Tooltip>
        <TooltipTrigger>
          <QuestionMarkCircleIcon className="size-4 shrink-0 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent>
          <pre className={cn("text-xs", ibmPlexSans.className)}>{helpText}</pre>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
