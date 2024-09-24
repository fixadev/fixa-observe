"use client";

import { useEffect, useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { type Conversation } from "@prisma/client";

const chartConfig = {
  views: {
    label: "failed conversations",
  },
  failures: {
    label: "failures",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export type FailureChartPeriod = "1h" | "24h" | "7d" | "30d";

export default function FailureChart({
  conversations = [],
  chartPeriod,
  chartMinDate,
  chartMaxDate,
}: {
  conversations?: Conversation[];
  chartPeriod: FailureChartPeriod;
  chartMinDate: Date;
  chartMaxDate: Date;
}) {
  const activeChart = useMemo(() => "failures", []);

  const chartData = useMemo(() => {
    const bucketSizeMinutes = 1;
    const buckets = new Map<number, number>();

    // Create initial and final buckets
    const initialBucketIndex = Math.floor(
      chartMinDate.getTime() / (bucketSizeMinutes * 60 * 1000),
    );
    const finalBucketIndex = Math.floor(
      chartMaxDate.getTime() / (bucketSizeMinutes * 60 * 1000),
    );

    // Initialize buckets with 0 for the entire range
    for (let i = initialBucketIndex; i <= finalBucketIndex; i++) {
      buckets.set(i, 0);
    }

    conversations.forEach((conversation) => {
      const createdAt = conversation.createdAt;
      const bucketIndex = Math.floor(
        createdAt.getTime() / (bucketSizeMinutes * 60 * 1000),
      );
      const currentCount = buckets.get(bucketIndex) ?? 0;
      buckets.set(
        bucketIndex,
        currentCount + (conversation.probSuccess < 70 ? 1 : 0),
      );
    });

    return Array.from(buckets.entries()).map(([timestamp, count]) => ({
      timestamp: new Date(
        timestamp * bucketSizeMinutes * 60 * 1000,
      ).toISOString(),
      failures: count,
    }));
  }, [conversations, chartMinDate, chartMaxDate]);

  // const total = useMemo(
  //   () => ({
  //     failures: chartData.reduce((acc, curr) => acc + curr.failures, 0),
  //   }),
  //   [],
  // );

  return (
    <Card className="rounded-md shadow-none">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>failed conversations</CardTitle>
          <CardDescription>
            showing failed conversations for the last hour
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart accessibilityLayer data={chartData} margin={{}}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value as string);
                return date.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                });
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value as string).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    });
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
