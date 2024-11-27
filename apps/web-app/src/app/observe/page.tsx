"use client";

import { useCallback, useMemo, useRef, useEffect } from "react";
import CallDetails from "~/components/dashboard/CallDetails";
import { useObserveState } from "~/components/hooks/useObserveState";
import CallTable from "~/components/observe/CallTable";
import Filters from "~/components/observe/Filters";
import Spinner from "~/components/Spinner";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { api } from "~/trpc/react";
import ChartCard from "~/components/observe/ChartCard";

export default function ObservePage() {
  const { selectedCallId, setSelectedCallId, filter, setFilter, orderBy } =
    useObserveState();

  const containerRef = useRef<HTMLDivElement>(null);

  const {
    data: percentiles,
    refetch: refetchPercentiles,
    isLoading: isLoadingPercentiles,
    isRefetching: isRefetchingPercentiles,
  } = api._call.getLatencyInterruptionPercentiles.useQuery({
    filter: {
      ...filter,
      timeRange: undefined,
      customerCallId: undefined,
    },
  });

  const {
    data: _calls,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch: refetchCalls,
  } = api._call.getCalls.useInfiniteQuery(
    {
      ownerId: "11x",
      limit: 10,
      filter: { ...filter, chartPeriod: undefined },
      orderBy,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const refetch = useCallback(() => {
    void refetchCalls();
    void refetchPercentiles();
  }, [refetchCalls, refetchPercentiles]);

  // Combine all pages
  const calls = useMemo(
    () => _calls?.pages.flatMap((page) => page.calls) ?? [],
    [_calls],
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
      <Filters filter={filter} setFilter={setFilter} refetch={refetch} />
      <div className="flex flex-col gap-4 p-4">
        <div className="flex w-full gap-4">
          <ChartCard
            title="latency"
            data={percentiles?.latency}
            isLoading={isLoadingPercentiles || isRefetchingPercentiles}
          />
          <ChartCard
            title="interruptions"
            data={percentiles?.interruptions}
            isLoading={isLoadingPercentiles || isRefetchingPercentiles}
          />
        </div>
        <CallTable isLoading={isLoading || isRefetching} calls={calls} />
        {/* Invisible marker for infinite scroll */}
        <div ref={loadMoreRef} className="h-1" />
        {(isFetchingNextPage || isLoading) && (
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
