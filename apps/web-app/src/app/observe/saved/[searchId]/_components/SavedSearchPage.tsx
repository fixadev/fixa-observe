"use client";

import { useCallback, useMemo, useRef, useEffect } from "react";
import CallDetails from "~/components/dashboard/CallDetails";
import { useObserveState } from "~/components/hooks/useObserveState";
import CallTable from "~/components/observe/CallTable";
import Filters from "~/components/observe/filters/Filters";
import Spinner from "~/components/Spinner";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { api } from "~/trpc/react";
import ChartCard from "~/components/observe/ChartCard";
import { EvaluationGroupsAndAlertsCard } from "./EvaluationGroupsAndAlertsCard";
import { FilterSchema, type SavedSearchWithIncludes } from "@repo/types/src";
import NoCallsCard from "~/components/observe/NoCallsCard";
import FreeCallsLeft from "~/components/observe/FreeCallsLeft";

export default function SavedSearchPage({
  params,
  savedSearch,
  includeTestCalls = false,
}: {
  params: { searchId: string };
  savedSearch: SavedSearchWithIncludes;
  includeTestCalls?: boolean;
}) {
  const {
    selectedCallId,
    setSelectedCallId,
    setIncludeTestCalls,
    filter,
    setFilter,
    orderBy,
    setSavedSearch,
  } = useObserveState();

  useEffect(() => {
    setSavedSearch(savedSearch);
    setIncludeTestCalls(includeTestCalls);

    const parsedFilter = FilterSchema.safeParse(savedSearch);
    if (parsedFilter.success) {
      setFilter(parsedFilter.data);
    } else {
      console.error("Invalid filter", parsedFilter.error);
    }
  }, [
    savedSearch,
    setFilter,
    setSavedSearch,
    setIncludeTestCalls,
    includeTestCalls,
  ]);

  const containerRef = useRef<HTMLDivElement>(null);

  const { data: callsExist, isLoading: isLoadingCallsExist } =
    api._call.checkIfACallExists.useQuery();

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

  if (!callsExist && !isLoadingCallsExist) {
    return <NoCallsCard />;
  }

  return (
    <div
      className="relative h-full bg-muted/30 focus:outline-none"
      autoFocus
      tabIndex={0}
    >
      <Filters
        refetch={refetch}
        originalFilter={savedSearch}
        savedSearch={savedSearch}
      />
      <div className="flex flex-col gap-4 p-4">
        <div className="flex w-full gap-4">
          <ChartCard
            title="latency"
            data={percentiles?.latency}
            isLoading={isLoadingPercentiles || isRefetchingPercentiles}
          />
          <EvaluationGroupsAndAlertsCard searchId={params.searchId ?? ""} />
        </div>
        <CallTable isLoading={isLoading || isRefetching} calls={calls} />
        {/* Invisible marker for infinite scroll */}
        <div ref={loadMoreRef} className="h-1" />
        {(isFetchingNextPage || isLoading) && (
          <div className="flex justify-center">
            <Spinner />
          </div>
        )}
        <FreeCallsLeft />
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
                  botName="agent"
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
