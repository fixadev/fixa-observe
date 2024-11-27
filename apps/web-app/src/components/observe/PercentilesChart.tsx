"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ReferenceArea, YAxis } from "recharts";
import { XAxis } from "recharts";
import {
  ChartContainer,
  ChartLegendContent,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";
import { chartPeriods, useObserveState } from "../hooks/useObserveState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";

const chartConfig = {
  p50: {
    label: "p50",
    color: "hsl(var(--chart-3))",
  },
  p90: {
    label: "p90",
    color: "hsl(var(--chart-2))",
  },
  p95: {
    label: "p95",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function PercentilesChart({
  data,
}: {
  data: { timestamp: number; p50: number; p90: number; p95: number }[];
}) {
  const { filter, setFilter } = useObserveState();

  // Fill in missing timestamps, based on the chart period
  const formattedData = useMemo(() => {
    const ret = [...data];

    const periodSet = new Set<number>();
    for (const item of data) {
      periodSet.add(item.timestamp);
    }

    const nowRounded =
      Math.floor(Date.now() / filter.chartPeriod) * filter.chartPeriod;

    for (
      let i = nowRounded - filter.lookbackPeriod.value;
      i <= nowRounded;
      i += filter.chartPeriod
    ) {
      if (!periodSet.has(i)) {
        ret.push({ timestamp: i, p50: 0, p90: 0, p95: 0 });
      }
    }

    ret.sort((a, b) => a.timestamp - b.timestamp);

    return ret;
  }, [data, filter.lookbackPeriod.value, filter.chartPeriod]);

  const [refAreaLeft, setRefAreaLeft] = useState<string>("");
  const [refAreaRight, setRefAreaRight] = useState<string>("");
  const [left, setLeft] = useState<string | number>("dataMin");
  const [right, setRight] = useState<string | number>("dataMax");

  useEffect(() => {
    if (filter.timeRange) {
      setLeft(filter.timeRange.start);
      setRight(filter.timeRange.end);
    } else {
      setLeft("dataMin");
      setRight("dataMax");
    }
  }, [filter.timeRange]);

  const zoom = useCallback(() => {
    if (
      refAreaLeft === refAreaRight ||
      refAreaLeft === "" ||
      refAreaRight === ""
    ) {
      setRefAreaLeft("");
      setRefAreaRight("");
      return;
    }

    let _left, _right;
    if (refAreaLeft > refAreaRight) {
      _left = refAreaRight;
      _right = refAreaLeft;
    } else {
      _left = refAreaLeft;
      _right = refAreaRight;
    }

    setFilter((prev) => ({
      ...prev,
      timeRange: {
        start: parseInt(_left),
        end: parseInt(_right),
      },
    }));

    setRefAreaLeft("");
    setRefAreaRight("");
  }, [refAreaLeft, refAreaRight, setFilter]);

  return (
    <ChartContainer
      config={chartConfig}
      className="h-[300px] w-full select-none"
    >
      <AreaChart
        accessibilityLayer
        data={formattedData}
        onMouseDown={(e) => {
          setRefAreaLeft(e.activeLabel ?? "");
        }}
        onMouseMove={(e) => {
          if (!refAreaLeft) return;
          setRefAreaRight(e.activeLabel ?? "");
        }}
        onMouseUp={zoom}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          allowDataOverflow
          domain={[left, right]}
          dataKey="timestamp"
          tickFormatter={(value: number) => {
            const date = new Date(value);
            return date.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });
          }}
          type="number"
        />
        <YAxis
          allowDataOverflow
          tickFormatter={(value: string) =>
            `${Math.round(parseFloat(value) * 1000)}ms`
          }
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelKey="timestamp"
              labelFormatter={(time: number) => {
                const date = new Date(time);
                return date.toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
              }}
              valueFormatter={(value: string) =>
                `${Math.round(parseFloat(value) * 1000)}ms`
              }
            />
          }
        />
        <ChartLegend
          content={(props) => (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label>period</Label>
                <Select
                  value={filter.chartPeriod.toString()}
                  onValueChange={(value) => {
                    setFilter((prev) => ({
                      ...prev,
                      chartPeriod: parseInt(value),
                    }));
                  }}
                >
                  <SelectTrigger className="w-fit">
                    <SelectValue placeholder="Select a fruit" />
                  </SelectTrigger>
                  <SelectContent>
                    {chartPeriods.map((item) => (
                      <SelectItem
                        key={item.value}
                        value={item.value.toString()}
                      >
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <ChartLegendContent className="p-0" payload={props.payload} />
            </div>
          )}
        />
        <Area
          dataKey="p50"
          type="natural"
          fill="var(--color-p50)"
          fillOpacity={0.4}
          stroke="var(--color-p50)"
          animationDuration={300}
        />
        <Area
          dataKey="p90"
          type="natural"
          fill="var(--color-p90)"
          fillOpacity={0.4}
          stroke="var(--color-p90)"
          animationDuration={300}
        />
        <Area
          dataKey="p95"
          type="natural"
          fill="var(--color-p95)"
          fillOpacity={0.4}
          stroke="var(--color-p95)"
          animationDuration={300}
        />

        {refAreaLeft && refAreaRight && (
          <ReferenceArea
            x1={refAreaLeft}
            x2={refAreaRight}
            strokeOpacity={0.3}
          />
        )}
      </AreaChart>
    </ChartContainer>
  );
}
