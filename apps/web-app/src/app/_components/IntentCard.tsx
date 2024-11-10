"use client";

import { type AgentWithoutId } from "~/lib/agent";
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

interface IntentCardProps {
  intent: {
    name: string;
    instructions: string;
  };
  index: number;
  agent: AgentWithoutId;
  setAgent: (agent: AgentWithoutId) => void;
}

export function IntentCard({
  intent,
  index,
  agent,
  setAgent,
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
  intent: {
    name: string;
    instructions: string;
  };
  index: number;
  agent: AgentWithoutId;
  setAgent: (agent: AgentWithoutId) => void;
}
function SettingsPopover({
  intent,
  index,
  agent,
  setAgent,
}: SettingsPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="ghost" className="px-1 py-3">
          <Cog6ToothIcon className="size-6 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
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
        </div>
      </PopoverContent>
    </Popover>
  );
}
