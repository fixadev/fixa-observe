"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, YAxis } from "recharts";
import { XAxis } from "recharts";
import {
  ChartContainer,
  ChartLegendContent,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";

const chartData = [
  {
    name: "2024-11-18",
    p50: 600,
    p90: 1200,
    p95: 1500,
  },
  {
    name: "2024-11-19",
    p50: 700,
    p90: 1300,
    p95: 1600,
  },
  {
    name: "2024-11-20",
    p50: 650,
    p90: 1250,
    p95: 1550,
  },
  {
    name: "2024-11-21",
    p50: 800,
    p90: 1400,
    p95: 1700,
  },
  {
    name: "2024-11-22",
    p50: 750,
    p90: 1350,
    p95: 1650,
  },
  {
    name: "2024-11-23",
    p50: 550,
    p90: 1150,
    p95: 1450,
  },
  {
    name: "2024-11-24",
    p50: 500,
    p90: 1100,
    p95: 1400,
  },
];

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
  // const formattedData = useMemo(() => {
  //   // Generate array of hours from now to lookback period
  //   const now = new Date();
  //   const hours = Array.from(
  //     { length: Math.ceil(lookbackPeriod / (60 * 60 * 1000)) },
  //     (_, i) => {
  //       const date = new Date(now);
  //       date.setHours(date.getHours() - i);
  //       return date.toISOString().slice(0, 13);
  //     },
  //   );

  //   // Create a map of existing data points
  //   const dataMap = new Map(
  //     data.map((item) => [new Date(item.hour).getTime(), item]),
  //   );

  //   // Merge existing data with empty hours
  //   return hours
  //     .map((hour) => {
  //       const timestamp = new Date(hour + ":00:00Z").getTime();
  //       return (
  //         dataMap.get(timestamp) ?? {
  //           hour,
  //           p50: 0,
  //           p90: 0,
  //           p95: 0,
  //         }
  //       );
  //     })
  //     .map((item) => ({
  //       ...item,
  //     }));
  // }, [data, lookbackPeriod]);

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

    ret.sort((a, b) => a.hour.localeCompare(b.hour));

    return ret;
  }, [data, lookbackPeriod]);

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart accessibilityLayer data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="hour"
          tickFormatter={(value: string) => {
            const date = new Date(value + ":00:00Z");
            return date.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });
          }}
        />
        <YAxis
          tickFormatter={(value: string) =>
            `${Math.round(parseFloat(value) * 1000)}ms`
          }
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(label: string) =>
                `${label.substring(0, 10)} ${label.substring(11)}:00`
              }
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
      </AreaChart>
    </ChartContainer>
  );
}
