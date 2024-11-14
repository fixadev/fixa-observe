"use client";

import { type IntentWithoutId, type AgentWithoutId } from "~/lib/agent";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useEffect, useState } from "react";
import { type AgentWithIncludes } from "~/lib/types";

interface IntentCardProps {
  intent: IntentWithoutId;
  index: number;
  agent: AgentWithoutId | AgentWithIncludes;
  setAgent: (agent: AgentWithoutId | AgentWithIncludes) => void;
}

export function IntentCard({
  intent,
  index,
  agent,
  setAgent,
}: IntentCardProps) {
  const [editMode, setEditMode] = useState(intent.isNew);

  const removeIntent = (index: number) => {
    setAgent({
      ...agent,
      intents: agent.intents.filter((_, iIndex) => iIndex !== index),
    });
  };

  useEffect(() => {
    if (intent.isNew) {
      setAgent({
        ...agent,
        intents: agent.intents.map((i, iIndex) =>
          iIndex === index ? { ...i, isNew: false } : i,
        ),
      });
    }
  }, [intent.isNew, agent, index, setAgent]);

  return (
    <div className="flex w-full flex-col items-center gap-2 rounded-md border-2 border-gray-300 p-2">
      {editMode ? (
        <div className="flex w-full flex-col gap-2">
          <Label>name</Label>
          <Input
            value={intent.name}
            placeholder="donut ordering flow"
            onChange={(e) =>
              setAgent({
                ...agent,
                intents: agent.intents.map((i, iIndex) =>
                  iIndex === index ? { ...i, name: e.target.value } : i,
                ),
              })
            }
          />
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-2">
              <Label>prompt</Label>
            </div>
            <Textarea
              className="h-[125px] overflow-y-auto"
              value={intent.instructions}
              placeholder="order a dozen donuts with sprinkles, ask for a receipt as well as a coffee"
              onChange={(e) =>
                setAgent({
                  ...agent,
                  intents: agent.intents.map((i, iIndex) =>
                    iIndex === index
                      ? { ...i, instructions: e.target.value }
                      : i,
                  ),
                })
              }
            />
            <div className="flex flex-row items-center gap-2">
              <Label>success criteria</Label>
            </div>
            <Textarea
              className="h-[125px] overflow-y-auto"
              value={intent.successCriteria}
              placeholder="the agent successfully orders a dozen donuts with sprinkles and a coffee"
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
          <div className="flex w-full flex-row items-center justify-between gap-2">
            <Button variant="ghost" onClick={() => removeIntent(index)}>
              <TrashIcon className="size-5 text-red-600" />
            </Button>
            <div className="flex flex-row items-center gap-2">
              <Button variant="outline" onClick={() => setEditMode(false)}>
                cancel
              </Button>
              <Button
                onClick={() => {
                  setEditMode(false);
                }}
              >
                save
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center gap-2 p-2">
          <div className="flex w-full flex-row justify-between gap-2">
            <Label
              className={`text-lg ${intent.name.length > 0 ? "" : "text-muted-foreground"}`}
            >
              {intent.name.length > 0 ? intent.name : "untitled "}
            </Label>
            <Button variant="ghost" onClick={() => setEditMode(true)}>
              <PencilIcon className="size-5 text-muted-foreground" />
            </Button>
          </div>
          <div className="flex w-full flex-row gap-2">
            <Label className="whitespace-nowrap text-sm">prompt</Label>
            <p className="truncate text-sm">{intent.instructions}</p>
          </div>
          <div className="flex w-full flex-row gap-2">
            <Label className="whitespace-nowrap text-sm">
              success criteria
            </Label>
            <p className="truncate text-sm">{intent.successCriteria}</p>
          </div>
        </div>
      )}
    </div>
  );
}
