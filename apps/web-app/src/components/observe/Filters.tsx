"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Switch } from "../ui/switch";
import { cn } from "~/lib/utils";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { CalendarIcon, UserIcon } from "@heroicons/react/24/solid";

export type Filter = {
  lookbackPeriod: LookbackPeriod;
  agentId: string;
  latencyThreshold: {
    enabled: boolean;
    value: number;
  };
  interruptionThreshold: {
    enabled: boolean;
    value: number;
  };
};

export type LookbackPeriod = {
  label: string;
  value: number;
};

export const lookbackPeriods: LookbackPeriod[] = [
  { label: "24 hours", value: 24 * 60 * 60 * 1000 },
  { label: "2 days", value: 2 * 24 * 60 * 60 * 1000 },
  { label: "7 days", value: 7 * 24 * 60 * 60 * 1000 },
  { label: "30 days", value: 30 * 24 * 60 * 60 * 1000 },
];

export default function Filters({
  filter,
  setFilter,
}: {
  filter: Filter;
  setFilter: (filter: Filter) => void;
}) {
  // TODO: replace with api call
  const agents = useMemo(() => {
    return [
      {
        id: "agent1",
        name: "agent 1",
      },
      {
        id: "agent2",
        name: "agent 2",
      },
    ];
  }, []);

  useEffect(() => {
    console.log(filter);
  }, [filter]);

  return (
    <div className="sticky top-0 flex justify-between gap-2 border-b bg-background p-4">
      <div className="flex gap-2">
        <Select
          value={filter.lookbackPeriod.value.toString()}
          onValueChange={(value) => {
            setFilter({
              ...filter,
              lookbackPeriod: lookbackPeriods.find(
                (p) => p.value === parseInt(value),
              )!,
            });
          }}
        >
          <SelectTrigger className="gap-2 bg-background">
            <CalendarIcon className="size-4 shrink-0" />
            <SelectValue placeholder="time range" />
          </SelectTrigger>
          <SelectContent>
            {lookbackPeriods.map((period) => (
              <SelectItem key={period.value} value={period.value.toString()}>
                {period.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="gap-2 bg-background">
            <UserIcon className="size-4 shrink-0" />
            <SelectValue placeholder="agent" />
          </SelectTrigger>
          <SelectContent>
            {agents.map((agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <SwitchWithValue
          prefix="latency &gt;= "
          suffix="ms"
          value={filter.latencyThreshold.value}
          setValue={(value) => {
            setFilter({
              ...filter,
              latencyThreshold: { ...filter.latencyThreshold, value },
            });
          }}
          checked={filter.latencyThreshold.enabled}
          onCheckedChange={(checked) => {
            setFilter({
              ...filter,
              latencyThreshold: {
                ...filter.latencyThreshold,
                enabled: checked,
              },
            });
          }}
        />
        <SwitchWithValue
          prefix="interruptions &gt;= "
          suffix="ms"
          value={filter.interruptionThreshold.value}
          setValue={(value) => {
            setFilter({
              ...filter,
              interruptionThreshold: { ...filter.interruptionThreshold, value },
            });
          }}
          checked={filter.interruptionThreshold.enabled}
          onCheckedChange={(checked) => {
            setFilter({
              ...filter,
              interruptionThreshold: {
                ...filter.interruptionThreshold,
                enabled: checked,
              },
            });
          }}
        />
      </div>
      <Button variant="outline">refresh</Button>
    </div>
  );
}

function SwitchWithValue({
  prefix,
  suffix,
  value,
  setValue,
  checked,
  onCheckedChange,
}: {
  prefix: string;
  suffix: string;
  value: number;
  setValue: (value: number) => void;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  const [_value, _setValue] = useState(value);

  useEffect(() => {
    _setValue(value);
  }, [value]);

  return (
    <Popover onOpenChange={() => setValue(_value)}>
      <PopoverTrigger asChild>
        <Button variant="outline" asChild>
          <div
            className={cn(
              "flex cursor-pointer items-center gap-2",
              !checked && "opacity-50",
            )}
          >
            <Switch
              onClick={(e) => e.stopPropagation()}
              checked={checked}
              onCheckedChange={onCheckedChange}
            />
            {prefix}
            {isNaN(_value) ? 0 : _value}
            {suffix}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="shrink-0">{prefix}</div>
          <Input
            type="number"
            value={_value}
            onChange={(e) => {
              _setValue(parseInt(e.target.value));
            }}
          />
          <div>{suffix}</div>
        </div>
        <Slider
          max={3000}
          step={10}
          value={[_value]}
          onValueChange={([value]) => {
            if (value !== undefined) {
              _setValue(value);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
