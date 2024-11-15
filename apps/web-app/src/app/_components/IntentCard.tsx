"use client";

import { type IntentWithoutId, type Intent } from "~/lib/agent";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useEffect, useState } from "react";

interface IntentCardProps {
  intent: IntentWithoutId;
  intentId?: string;
  index: number;
  intents: Array<Intent | IntentWithoutId>;
  setIntents: (intents: Array<Intent | IntentWithoutId>) => void;
}

export function IntentCard({
  intent,
  intentId,
  index,
  intents,
  setIntents,
}: IntentCardProps) {
  const [editMode, setEditMode] = useState(intent.isNew);
  const [localIntent, setLocalIntent] = useState(intent);

  const removeIntent = (index: number) => {
    setIntents(intents.filter((_, iIndex) => iIndex !== index));
  };

  useEffect(() => {
    if (intent.isNew) {
      setLocalIntent({ ...intent, isNew: false });
    }
  }, [intent.isNew, index, setLocalIntent, intent]);

  return (
    <div className="flex w-full cursor-pointer flex-col items-center gap-2 rounded-md border border-input shadow-sm">
      {editMode ? (
        <div className="flex w-full flex-col gap-2 p-6">
          <Label>name</Label>
          <Input
            value={localIntent.name}
            placeholder="donut ordering flow"
            onChange={(e) =>
              setLocalIntent({ ...localIntent, name: e.target.value })
            }
          />
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-2">
              <Label>prompt</Label>
            </div>
            <Textarea
              className="h-[125px] overflow-y-auto"
              value={localIntent.instructions}
              placeholder="order a dozen donuts with sprinkles, ask for a receipt as well as a coffee"
              onChange={(e) =>
                setLocalIntent({
                  ...localIntent,
                  instructions: e.target.value,
                })
              }
            />
            <div className="flex flex-row items-center gap-2">
              <Label>success criteria</Label>
            </div>
            <Textarea
              className="h-[125px] overflow-y-auto"
              value={localIntent.successCriteria}
              placeholder="the agent successfully orders a dozen donuts with sprinkles and a coffee"
              onChange={(e) =>
                setLocalIntent({
                  ...localIntent,
                  successCriteria: e.target.value,
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
                  setIntents(
                    intents.map((i, iIndex) =>
                      iIndex === index ? localIntent : i,
                    ),
                  );
                }}
              >
                save
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="group flex w-full cursor-pointer flex-col items-center gap-2 p-6 hover:bg-muted"
          onClick={() => setEditMode(true)}
        >
          <div className="flex w-full flex-row justify-between gap-2">
            <div className="flex flex-row items-baseline gap-4">
              <Label
                className={`text-lg ${intent.name.length > 0 ? "" : "text-muted-foreground"}`}
              >
                {intent.name.length > 0 ? intent.name : "untitled "}
              </Label>
              {intentId && (
                <div className="text-sm text-muted-foreground">{intentId}</div>
              )}
            </div>

            <PencilIcon className="invisible mt-[-8px] size-5 group-hover:visible group-hover:text-muted-foreground" />
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
