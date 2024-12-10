"use client";
import { CardContent, CardHeader } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { Button } from "~/components/ui/button";
import { cn, isTempId } from "~/lib/utils";
import { EditableText } from "~/components/EditableText";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { AlertWithDetails } from "@repo/types/src";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useState } from "react";

export function AlertCard({
  alert,
  onUpdate,
}: {
  alert: AlertWithDetails;
  onUpdate: (alert: AlertWithDetails) => void;
}) {
  const [taggedNames, setTaggedNames] = useState<string[]>([]);
  return (
    <div className={cn("p-0 text-sm transition-opacity")}>
      {/* <CardHeader className="flex flex-col gap-2 px-0 py-2">
        <div className="flex items-center gap-1">
          <EditableText
            value={alert.name}
            onValueChange={(value) => onUpdate({ ...alert, name: value })}
            initialEditing={isTempId(alert.id)}
            className="text-base font-medium"
            inputClassName="text-base"
            placeholder="enter alert name..."
            inputPlaceholder={`enter alert name... (i.e. "")`}
          />
          <Button variant="ghost" size="icon" className="size-7">
            <EllipsisHorizontalIcon className="size-5" />
          </Button>
        </div>
        <Switch
          checked={evalSet.enabled}
          onCheckedChange={(checked) =>
            onUpdate({ ...alert, enabled: checked })
          }
        />
      </CardHeader> */}
      <CardContent className="flex flex-col gap-4 p-0">
        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium text-muted-foreground">IF</div>
          {alert.type === "latency" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center gap-4 rounded-md bg-gray-100 p-2">
                <Select
                  value={alert.details?.percentile}
                  onValueChange={(value) => {
                    onUpdate({
                      ...alert,
                      details: {
                        ...alert.details,
                        percentile: value as "p50" | "p90" | "p95",
                      },
                    });
                  }}
                >
                  <SelectTrigger className="w-fit bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="p50">latency p50</SelectItem>
                    <SelectItem value="p90">latency p90</SelectItem>
                    <SelectItem value="p95">latency p95</SelectItem>
                  </SelectContent>
                </Select>
                <div>{">="}</div>
                <Select
                  value={alert.details?.threshold.toString()}
                  onValueChange={(value) => {
                    onUpdate({
                      ...alert,
                      details: { ...alert.details, threshold: Number(value) },
                    });
                  }}
                >
                  <SelectTrigger className="w-fit bg-white">
                    <SelectValue placeholder="1000ms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1000">1000ms</SelectItem>
                    <SelectItem value="1500">1500ms</SelectItem>
                    <SelectItem value="2000">2000ms</SelectItem>
                    <SelectItem value="2500">2500ms</SelectItem>
                    <SelectItem value="3000">3000ms</SelectItem>
                    <SelectItem value="3500">3500ms</SelectItem>
                    <SelectItem value="4000">4000ms</SelectItem>
                    <SelectItem value="4500">4500ms</SelectItem>
                    <SelectItem value="5000">5000ms</SelectItem>
                    <SelectItem value="5500">5500ms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground">
                  THEN
                </div>
                <div className="flex flex-row items-center gap-4">
                  <div>send a slack alert and tag</div>
                  <Input
                    className="w-40"
                    placeholder="enter name..."
                    value={alert.details?.slackNames[0] || ""}
                    onChange={(e) => {
                      onUpdate({
                        ...alert,
                        details: {
                          ...alert.details,
                          slackNames: [e.target.value],
                        },
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </div>
  );
}
