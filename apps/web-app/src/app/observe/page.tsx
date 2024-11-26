"use client";

import { useCallback, useMemo, useRef, useEffect } from "react";
import CallDetails from "~/components/dashboard/CallDetails";
import { useObserveState } from "~/components/hooks/useObserveState";
import CallTable from "~/components/observe/CallTable";
import Filters from "~/components/observe/Filters";
import Spinner from "~/components/Spinner";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import ChartCard from "~/components/observe/ChartCard";

export default function ObservePage() {
  const { selectedCallId, setSelectedCallId, filter, setFilter } =
    useObserveState();

  const containerRef = useRef<HTMLDivElement>(null);

  const { data: percentiles } =
    api._call.getLatencyInterruptionPercentiles.useQuery({
      filter: { ...filter, timeRange: undefined }, // don't refetch when timerange changes
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
        limit: 100,
        filter,
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

  return (
    <div
      className="relative h-full bg-muted/30 pt-16"
      autoFocus
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === " ") {
          e.preventDefault();
          playPauseAudio();
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
              <ChartCard title="latency" byHour={percentiles.latency.byHour} />
              <ChartCard
                title="interruptions"
                byHour={percentiles.interruptions.byHour}
              />
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
