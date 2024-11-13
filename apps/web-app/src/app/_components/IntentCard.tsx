"use client";

import { type IntentWithoutId, type AgentWithoutId } from "~/lib/agent";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Cog6ToothIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useEffect, useState } from "react";
import { type AgentWithIncludes } from "~/lib/types";

interface IntentCardProps {
  intent: IntentWithoutId;
  index: number;
  agent: AgentWithoutId | AgentWithIncludes;
  setAgent: (agent: AgentWithoutId | AgentWithIncludes) => void;
  modalOpen: boolean;
}

export function IntentCard({
  intent,
  index,
  agent,
  setAgent,
  modalOpen,
}: IntentCardProps) {
  const removeIntent = (index: number) => {
    setAgent({
      ...agent,
      intents: agent.intents.filter((_, iIndex) => iIndex !== index),
    });
  };
  return (
    <div className="flex flex-row items-center gap-2">
      <Input
        value={intent.name}
        onChange={(e) =>
          setAgent({
            ...agent,
            intents: agent.intents.map((i, iIndex) =>
              iIndex === index ? { ...i, name: e.target.value } : i,
            ),
          })
        }
      />
      <SettingsPopover
        intent={intent}
        index={index}
        agent={agent}
        setAgent={setAgent}
        modalOpen={modalOpen}
      />
      <Button
        variant="ghost"
        className="px-1 py-3"
        onClick={() => removeIntent(index)}
      >
        <TrashIcon className="size-5 text-red-600" />
      </Button>
    </div>
  );
}

interface SettingsPopoverProps {
  intent: IntentWithoutId;
  index: number;
  agent: AgentWithoutId;
  setAgent: (agent: AgentWithoutId) => void;
  modalOpen: boolean;
}
function SettingsPopover({
  intent,
  index,
  agent,
  setAgent,
  modalOpen,
}: SettingsPopoverProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    if (!modalOpen) {
      console.log("closing popover");
      setPopoverOpen(false);
    }
  }, [modalOpen]);

  useEffect(() => {
    console.log("popoverOpen", popoverOpen);
  }, [popoverOpen]);

  return (
    <Popover modal open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger>
        <Button variant="ghost" className="px-1 py-3">
          <Cog6ToothIcon className="size-6 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="flex min-h-[400px] w-[500px] flex-col gap-4"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => {
          e.stopPropagation();
          setPopoverOpen(false);
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Label className="text-md font-medium">settings</Label>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <Label>specific instructions</Label>
            <Label className="text-sm font-light text-muted-foreground">
              (optional)
            </Label>
          </div>
          <Textarea
            className="h-[125px] overflow-y-auto"
            value={intent.instructions}
            onChange={(e) =>
              setAgent({
                ...agent,
                intents: agent.intents.map((i, iIndex) =>
                  iIndex === index ? { ...i, instructions: e.target.value } : i,
                ),
              })
            }
          />
          <div className="flex flex-row items-center gap-2">
            <Label>success criteria</Label>
            <Label className="text-sm font-light text-muted-foreground">
              (optional)
            </Label>
          </div>
          <Textarea
            className="h-[125px] overflow-y-auto"
            value={intent.successCriteria}
            onChange={(e) =>
              setAgent({
                ...agent,
                intents: agent.intents.map((i, iIndex) =>
                  iIndex === index
                    ? { ...i, successCriteria: e.target.value }
                    : i,
                ),
              })
            }
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
