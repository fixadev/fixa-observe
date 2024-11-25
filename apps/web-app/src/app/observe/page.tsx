"use client";

import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import CallDetails from "~/components/dashboard/CallDetails";
import { useAudio } from "~/components/hooks/useAudio";
import { useObserveState } from "~/components/hooks/useObserveState";
import CallTable from "~/components/observe/CallTable";
import Filters, {
  type Filter,
  lookbackPeriods,
} from "~/components/observe/Filters";
import LatencyChart from "~/components/observe/LatencyChart";
import Spinner from "~/components/Spinner";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { Skeleton } from "~/components/ui/skeleton";
import { cn, getColors, getLatencyColor } from "~/lib/utils";
import { api } from "~/trpc/react";

export default function ObservePage() {
  const [filter, setFilter] = useState<Filter>({
    lookbackPeriod: lookbackPeriods[2]!,
    agentId: "all agents",
    regionId: "all regions",
    latencyThreshold: {
      enabled: true,
      value: 1000,
    },
    interruptionThreshold: {
      enabled: true,
      value: 1000,
    },
  });

  const { selectedCallId, setSelectedCallId } = useObserveState();

  const containerRef = useRef<HTMLDivElement>(null);

  const { play, pause, isPlaying } = useAudio();

  const { data: percentiles } =
    api._call.getLatencyInterruptionPercentiles.useQuery({
      lookbackPeriod: filter.lookbackPeriod.value,
    });
  // const latencyPercentiles = useMemo(() => {
  //   return [];
  // }, []);
  // const calls = useMemo(() => {
  //   return TEST_OBSERVE_CALLS.slice(0, 2);
  //   // return TEST_OBSERVE_CALLS;
  // }, []);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    api._call.getCalls.useInfiniteQuery(
      {
        ownerId: "11x",
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  // Combine all pages
  const calls = useMemo(
    () =>
      data?.pages
        .flatMap((page) => page.calls)
        .filter(
          (call) =>
            (filter.agentId === "all agents" ||
              call.agentId === filter.agentId) &&
            (filter.regionId === "all regions" ||
              call.regionId === filter.regionId),
        ) ?? [],
    [data, filter.agentId, filter.regionId],
  );

  // Optional: Add intersection observer for infinite scroll
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage) {
          void fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  const selectedCall = useMemo(
    () => calls?.find((call) => call.id === selectedCallId),
    [calls, selectedCallId],
  );

  const playPauseAudio = useCallback(() => {
    console.log("play pause!!");
  }, []);

  const colors = useMemo(() => getColors(), []);

  return (
    <div
      className="relative h-full bg-muted/30 pt-16"
      autoFocus
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === " ") {
          e.preventDefault();
          playPauseAudio();
          // if (isPlaying) {
          //   pause();
          // } else {
          //   play();
          // }
        }
      }}
    >
      <Filters filter={filter} setFilter={setFilter} />
      <div className="flex flex-col gap-4 p-4">
        <div className="flex w-full gap-4">
          {!percentiles ? (
            <>
              <Skeleton className="h-[500px] flex-1" />
              <Skeleton className="h-[500px] flex-1" />
            </>
          ) : (
            <>
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="mb-2">latency</CardTitle>
                  <div className="flex gap-4 border-l-2 border-primary pl-4">
                    <div className="flex flex-col gap-1">
                      <div className="text-xs font-medium">average</div>
                      <div className="text-sm">
                        last {filter.lookbackPeriod.label}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div
                        className={cn(
                          "text-xs font-medium",
                          `text-${colors[0]}`,
                        )}
                      >
                        50%
                      </div>
                      <div
                        className={cn(
                          "text-sm",
                          getLatencyColor(
                            percentiles.latency.average.p50 * 1000,
                          ),
                        )}
                      >
                        {Math.round(percentiles.latency.average.p50 * 1000)}
                        ms
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div
                        className={cn(
                          "text-xs font-medium",
                          `text-${colors[1]}`,
                        )}
                      >
                        90%
                      </div>
                      <div
                        className={cn(
                          "text-sm",
                          getLatencyColor(
                            percentiles.latency.average.p90 * 1000,
                          ),
                        )}
                      >
                        {Math.round(percentiles.latency.average.p90 * 1000)}
                        ms
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div
                        className={cn(
                          "text-xs font-medium",
                          `text-${colors[2]}`,
                        )}
                      >
                        95%
                      </div>
                      <div
                        className={cn(
                          "text-sm",
                          getLatencyColor(
                            percentiles.latency.average.p95 * 1000,
                          ),
                        )}
                      >
                        {Math.round(percentiles.latency.average.p95 * 1000)}
                        ms
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <LatencyChart
                    lookbackPeriod={filter.lookbackPeriod.value}
                    data={percentiles.latency.byHour}
                  />
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="mb-2">interruptions</CardTitle>
                  <div className="flex gap-4 border-l-2 border-primary pl-4">
                    <div className="flex flex-col gap-1">
                      <div className="text-xs font-medium text-muted-foreground">
                        average
                      </div>
                      <div className="text-sm">
                        last {filter.lookbackPeriod.label}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-xs font-medium text-muted-foreground">
                        50%
                      </div>
                      <div
                        className={cn(
                          "text-sm",
                          getLatencyColor(
                            percentiles.interruptions.average.p50 * 1000,
                          ),
                        )}
                      >
                        {Math.round(
                          percentiles.interruptions.average.p50 * 1000,
                        )}
                        ms
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-xs font-medium text-muted-foreground">
                        90%
                      </div>
                      <div
                        className={cn(
                          "text-sm",
                          getLatencyColor(
                            percentiles.interruptions.average.p90 * 1000,
                          ),
                        )}
                      >
                        {Math.round(
                          percentiles.interruptions.average.p90 * 1000,
                        )}
                        ms
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-xs font-medium text-muted-foreground">
                        95%
                      </div>
                      <div
                        className={cn(
                          "text-sm",
                          getLatencyColor(
                            percentiles.interruptions.average.p95 * 1000,
                          ),
                        )}
                      >
                        {Math.round(
                          percentiles.interruptions.average.p95 * 1000,
                        )}
                        ms
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <LatencyChart
                    lookbackPeriod={filter.lookbackPeriod.value}
                    data={percentiles.interruptions.byHour}
                  />
                </CardContent>
              </Card>
            </>
          )}
        </div>
        <CallTable calls={calls} />
        {/* Invisible marker for infinite scroll */}
        <div ref={loadMoreRef} className="h-1" />
        {isFetchingNextPage && (
          <div className="flex justify-center">
            <Spinner />
          </div>
        )}
        {selectedCall && (
          <Dialog
            open={!!selectedCallId}
            onOpenChange={(open) => {
              if (!open) {
                setSelectedCallId(null);
              }
            }}
          >
            <DialogContent className="max-h-[90vh] max-w-[90vw] p-0">
              {/* <DialogHeader>
            <DialogTitle>Call Details</DialogTitle>
          </DialogHeader> */}
              <div
                className="h-[90vh] w-[90vw] overflow-hidden overflow-y-auto rounded-md focus:outline-none"
                ref={containerRef}
              >
                <CallDetails
                  call={selectedCall}
                  botName="jordan"
                  userName="caller"
                  headerHeight={44}
                  includeHeaderTop={false}
                  avatarUrl="/images/agent-avatars/jordan.png"
                  type="latency"
                  containerRef={containerRef}
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
