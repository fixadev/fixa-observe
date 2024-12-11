"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ReferenceArea } from "recharts";
import { XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";
import { useObserveState } from "~/components/hooks/useObserveState";

const chartConfig = {
  success: {
    label: "Success Rate",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function SuccessRateChart() {
  const { filter, setFilter } = useObserveState();

  // Generate dummy data for now
  const formattedData = useMemo(() => {
    const nowRounded =
      Math.floor(Date.now() / filter.chartPeriod) * filter.chartPeriod;
    const data = [];

    for (
      let i = nowRounded - filter.lookbackPeriod.value;
      i <= nowRounded;
      i += filter.chartPeriod
    ) {
      data.push({
        timestamp: i,
        success: 0.5 + Math.random() * 0.4, // Random success rate between 50% and 90%
      });
    }

    return data.sort((a, b) => a.timestamp - b.timestamp);
  }, [filter.lookbackPeriod.value, filter.chartPeriod]);

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
    <ChartContainer config={chartConfig} className="h-32 w-full select-none">
      <AreaChart
        accessibilityLayer
        data={formattedData}
        margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
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
          fontSize={10}
        />
        <YAxis
          allowDataOverflow
          domain={[0, 1]}
          tickFormatter={(value: number) => `${Math.round(value * 100)}%`}
          fontSize={10}
          width={25}
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
                `${Math.round(parseFloat(value) * 100)}%`
              }
            />
          }
        />
        <Area
          dataKey="success"
          type="natural"
          fill="var(--color-p50)"
          fillOpacity={0.4}
          stroke="var(--color-p50)"
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
