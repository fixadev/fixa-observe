"use client";

import { useCallback, useMemo, useState } from "react";
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

export default function LatencyChart({
  data,
  lookbackPeriod,
}: {
  data: { hour: string; p50: number; p90: number; p95: number }[];
  lookbackPeriod: number;
}) {
  const formattedData = useMemo(() => {
    const ret = [...data];

    const hourSet = new Set<string>();
    for (const item of data) {
      hourSet.add(item.hour);
    }

    const now = Date.now();

    for (let i = now - lookbackPeriod; i <= now; i += 60 * 60 * 1000) {
      const hour = new Date(i).toISOString().slice(0, 13);
      if (!hourSet.has(hour)) {
        ret.push({ hour, p50: 0, p90: 0, p95: 0 });
      }
    }

    const ret2 = ret
      .map((d) => ({
        ...d,
        hour: new Date(d.hour + ":00:00Z").getTime(),
      }))
      .sort((a, b) => a.hour - b.hour);

    return ret2;
  }, [data, lookbackPeriod]);

  const [refAreaLeft, setRefAreaLeft] = useState<string>("");
  const [refAreaRight, setRefAreaRight] = useState<string>("");
  const [left, setLeft] = useState<string>("dataMin");
  const [right, setRight] = useState<string>("dataMax");

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

    setLeft(_left);
    setRight(_right);

    setRefAreaLeft("");
    setRefAreaRight("");
  }, [refAreaLeft, refAreaRight]);

  const zoomOut = useCallback(() => {
    setLeft("dataMin");
    setRight("dataMax");
  }, []);

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
          dataKey="hour"
          tickFormatter={(value: number) => {
            // const date = new Date(value + ":00:00Z");
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
              labelKey="hour"
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
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="p50"
          type="natural"
          fill="var(--color-p50)"
          fillOpacity={0.4}
          stroke="var(--color-p50)"
        />
        <Area
          dataKey="p90"
          type="natural"
          fill="var(--color-p90)"
          fillOpacity={0.4}
          stroke="var(--color-p90)"
        />
        <Area
          dataKey="p95"
          type="natural"
          fill="var(--color-p95)"
          fillOpacity={0.4}
          stroke="var(--color-p95)"
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
