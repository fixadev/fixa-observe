"use client";

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

export default function LatencyChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart accessibilityLayer data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tickFormatter={(value: string) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
          }}
        />
        <YAxis tickFormatter={(value) => `${value}ms`} />
        <ChartTooltip
          content={
            <ChartTooltipContent valueFormatter={(value) => `${value}ms`} />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="p95"
          type="natural"
          fill="var(--color-p95)"
          fillOpacity={0.4}
          stroke="var(--color-p95)"
        />
        <Area
          dataKey="p90"
          type="natural"
          fill="var(--color-p90)"
          fillOpacity={0.4}
          stroke="var(--color-p90)"
        />
        <Area
          dataKey="p50"
          type="natural"
          fill="var(--color-p50)"
          fillOpacity={0.4}
          stroke="var(--color-p50)"
        />
      </AreaChart>
    </ChartContainer>
  );
}
