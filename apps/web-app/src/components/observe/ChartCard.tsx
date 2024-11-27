import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import LatencyChart from "./LatencyChart";
import { cn, getLatencyColor } from "~/lib/utils";
import { useObserveState } from "~/components/hooks/useObserveState";
import { useCallback, useMemo } from "react";
import { Button } from "../ui/button";

interface ChartCardProps {
  title: string;
  data: {
    timestamp: number;
    p50: number;
    p90: number;
    p95: number;
  }[];
}

export default function ChartCard({ title, data }: ChartCardProps) {
  const { filter, setFilter } = useObserveState();

  const resetZoom = useCallback(() => {
    setFilter({
      ...filter,
      timeRange: undefined,
    });
  }, [filter, setFilter]);

  const average = useMemo(() => {
    let byHourFiltered = data;
    if (filter.timeRange) {
      byHourFiltered = data.filter(
        (h) =>
          h.timestamp >= filter.timeRange!.start &&
          h.timestamp <= filter.timeRange!.end,
      );
    }
    return {
      p50:
        byHourFiltered.reduce((acc, h) => acc + h.p50, 0) /
        byHourFiltered.length,
      p90:
        byHourFiltered.reduce((acc, h) => acc + h.p90, 0) /
        byHourFiltered.length,
      p95:
        byHourFiltered.reduce((acc, h) => acc + h.p95, 0) /
        byHourFiltered.length,
    };
  }, [data, filter.timeRange]);

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="mb-2">{title}</CardTitle>
        <div className="flex gap-4 border-l-2 border-primary pl-4">
          <div className="flex flex-col gap-1">
            <div className={cn("text-xs font-medium text-muted-foreground")}>
              average
            </div>
            {filter.timeRange ? (
              <div className="text-sm">custom</div>
            ) : (
              <div className="text-sm">last {filter.lookbackPeriod.label}</div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className={cn("text-xs font-medium text-muted-foreground")}>
              50%
            </div>
            <div className={cn("text-sm", getLatencyColor(average.p50 * 1000))}>
              {Math.round(average.p50 * 1000)}ms
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className={cn("text-xs font-medium text-muted-foreground")}>
              90%
            </div>
            <div className={cn("text-sm", getLatencyColor(average.p90 * 1000))}>
              {Math.round(average.p90 * 1000)}ms
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className={cn("text-xs font-medium text-muted-foreground")}>
              95%
            </div>
            <div className={cn("text-sm", getLatencyColor(average.p95 * 1000))}>
              {Math.round(average.p95 * 1000)}ms
            </div>
          </div>
          <div className="flex-1" />
          {filter.timeRange && (
            <Button variant="outline" onClick={resetZoom}>
              reset zoom
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <LatencyChart data={data} />
      </CardContent>
    </Card>
  );
}
