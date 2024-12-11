"use client";
import { CardContent, CardHeader } from "~/components/ui/card";
import { cn, isTempId } from "~/lib/utils";
import { EditableText } from "~/components/EditableText";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { type AlertWithDetails, type Filter } from "@repo/types/src/index";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useEffect, useState } from "react";
import { lookbackPeriods } from "~/components/hooks/useObserveState";

export function AlertCard({
  alert,
  filter,
  onUpdate,
}: {
  alert: AlertWithDetails;
  filter: Filter;
  onUpdate: (alert: AlertWithDetails) => void;
}) {
  type LatencyOption = {
    value: string;
    label: string;
    type: "latency";
  };

  type EvalSetOption = {
    value: string;
    label: string;
    type: "evalSet";
    evalSetId: string;
  };

  type AlertOption = LatencyOption | EvalSetOption;

  const [alertOptionIndex, setAlertOptionIndex] = useState(0);
  const alertOptions: AlertOption[] = [
    { value: "p50", label: "latency P50", type: "latency" },
    { value: "p90", label: "latency P90", type: "latency" },
    { value: "p95", label: "latency P95", type: "latency" },
    ...(filter.evalSets?.map((evalSet) => ({
      value: evalSet.id,
      label: evalSet.name,
      type: "evalSet" as const,
      evalSetId: evalSet.id,
    })) ?? []),
  ];

  useEffect(() => {
    setAlertOptionIndex(
      alertOptions.findIndex((opt) =>
        alert.type === "latency"
          ? opt.value === alert.details?.percentile
          : opt.value === alert.details?.evalSetId,
      ),
    );
  }, [alert]);

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
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-4 rounded-md bg-gray-100 p-2">
              <div className="flex w-40 flex-row">
                <Select
                  value={alertOptions[alertOptionIndex]?.value}
                  onValueChange={(value) => {
                    const selectedOption = alertOptions.find(
                      (opt) => opt.value === value,
                    );
                    if (!selectedOption) return;

                    const newAlert = {
                      ...alert,
                      type: selectedOption.type,
                      details:
                        selectedOption.type === "latency"
                          ? {
                              percentile: selectedOption.value as
                                | "p50"
                                | "p90"
                                | "p95",
                              threshold: 1000,
                              slackNames: alert.details?.slackNames ?? [""],
                              lookbackPeriod: lookbackPeriods[0]!,
                            }
                          : {
                              evalSetId: selectedOption.evalSetId,
                              trigger: true,
                              slackNames: alert.details?.slackNames ?? [""],
                            },
                    } as AlertWithDetails;

                    setAlertOptionIndex(
                      alertOptions.findIndex((opt) => opt.value === value),
                    );
                    onUpdate(newAlert);
                  }}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="w-40">
                    {alertOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {alert.type === "latency" ? (
                <>
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
                  <div>for the last</div>
                  <Select
                    value={alert.details?.lookbackPeriod.value.toString()}
                    onValueChange={(value) => {
                      onUpdate({
                        ...alert,
                        details: {
                          ...alert.details,
                          lookbackPeriod: lookbackPeriods.find(
                            (p) => p.value === parseInt(value),
                          )!,
                        },
                      });
                    }}
                  >
                    <SelectTrigger className="w-fit bg-white">
                      <SelectValue placeholder="1000ms" />
                    </SelectTrigger>
                    <SelectContent>
                      {lookbackPeriods.map((period) => (
                        <SelectItem
                          key={period.value}
                          value={period.value.toString()}
                        >
                          {period.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              ) : (
                <>
                  <Select
                    value={alert.details?.trigger.toString()}
                    onValueChange={(value) => {
                      onUpdate({
                        ...alert,
                        details: {
                          ...alert.details,
                          trigger: value === "true",
                        },
                      });
                    }}
                  >
                    <SelectTrigger className="w-fit bg-white">
                      <SelectValue placeholder="succeeds" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">succeeds</SelectItem>
                      <SelectItem value="false">fails</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
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
                  value={alert.details?.slackNames[0] ?? ""}
                  onChange={(e) => {
                    const updatedAlert = {
                      ...alert,
                      details: {
                        ...alert.details,
                        slackNames: [e.target.value],
                      },
                    } as AlertWithDetails;
                    onUpdate(updatedAlert);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
}
