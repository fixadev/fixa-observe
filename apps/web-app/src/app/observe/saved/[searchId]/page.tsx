"use client";

import React, {
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
} from "react";
import CallDetails from "~/components/dashboard/CallDetails";
import { useObserveState } from "~/components/hooks/useObserveState";
import CallTable from "~/components/observe/CallTable";
import Filters from "~/components/observe/Filters";
import Spinner from "~/components/Spinner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";
import ChartCard from "~/components/observe/ChartCard";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import {
  Alert,
  AlertWithDetails,
  EvalSetWithIncludes,
  Filter,
} from "@repo/types/src";
import { PlusIcon } from "@heroicons/react/24/solid";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "~/components/ui/button";
import EvalSetCard from "./components/EvalSetCard";
import { instantiateEvalSet } from "~/lib/instantiate";

// TODO: refactor this to be cleaner

export default function SavedSearchPage({
  params,
}: {
  params: { searchId: string };
}) {
  const { selectedCallId, setSelectedCallId, filter, setFilter, orderBy } =
    useObserveState();

  const { data: savedSearchQueryResult } = api.search.getById.useQuery({
    id: params.searchId,
  });

  useEffect(() => {
    if (savedSearchQueryResult) {
      setFilter(savedSearchQueryResult);
    }
  }, [savedSearchQueryResult]);

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

  const [modalOpen, setModalOpen] = useState(false);

  const playPauseAudio = useCallback(() => {
    console.log("play pause!!");
  }, []);

  return (
    <div
      className="relative h-full bg-muted/30 pt-16 focus:outline-none"
      autoFocus
      tabIndex={0}
      // onKeyDown={(e) => {
      //   if (e.key === " " && !modalOpen) {
      //     e.preventDefault();
      //     playPauseAudio();
      //   }
      // }}
    >
      <Filters
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        filter={filter}
        setFilter={setFilter}
        refetch={refetch}
      />
      <div className="flex flex-col gap-4 p-4">
        <div className="flex w-full gap-4">
          <ChartCard
            title="latency"
            data={percentiles?.latency}
            isLoading={isLoadingPercentiles || isRefetchingPercentiles}
          />
          <EvalSetsAndAlertsCard
            filter={filter}
            setFilter={setFilter}
            searchId={params.searchId ?? ""}
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

function EvalSetsAndAlertsCard({
  filter,
  setFilter,
  searchId,
}: {
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  searchId: string;
}) {
  const [mode, setMode] = useState<"evaluations" | "alerts">("evaluations");
  const [evalsModalOpen, setEvalsModalOpen] = useState(false);
  const [alertsModalOpen, setAlertsModalOpen] = useState(false);
  const [selectedEvalSet, setSelectedEvalSet] =
    useState<EvalSetWithIncludes | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<AlertWithDetails | null>(
    null,
  );
  return (
    <Card className="flex-1">
      <div className="flex flex-row items-center gap-4 p-6 font-medium">
        <p
          onClick={() => setMode("evaluations")}
          className={cn(
            "cursor-pointer",
            mode === "evaluations" ? "text-primary" : "text-muted-foreground",
          )}
        >
          evaluations
        </p>
        <p
          onClick={() => setMode("alerts")}
          className={cn(
            "cursor-pointer",
            mode === "alerts" ? "text-primary" : "text-muted-foreground",
          )}
        >
          alerts
        </p>
      </div>
      <CardContent>
        {mode === "evaluations" ? (
          <div className="flex flex-col gap-4">
            {filter.evalSets?.map((evalSet) => (
              <Card
                onClick={() => {
                  setSelectedEvalSet(evalSet);
                  setEvalsModalOpen(true);
                }}
                key={evalSet.id}
                className="flex flex-col gap-4 p-4"
              >
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    {evalSet.name}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
            <div
              className="flex flex-row items-center gap-2 rounded-md bg-muted/70 p-4 text-muted-foreground hover:cursor-pointer hover:bg-muted"
              onClick={() => {
                setSelectedEvalSet(null);
                setEvalsModalOpen(true);
              }}
            >
              <PlusIcon className="size-5" />
              <span className="text-sm">add evaluation</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filter.alerts?.map((alert) => (
              <Card
                onClick={() => {
                  setSelectedAlert(alert);
                  setAlertsModalOpen(true);
                }}
                key={alert.id}
                className="flex flex-col gap-4 rounded-md border border-muted/20 bg-background p-4 shadow-sm"
              >
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    {alert.name}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
            <div
              className="flex flex-row items-center gap-2 rounded-md bg-muted/70 p-4 text-muted-foreground hover:cursor-pointer hover:bg-muted"
              // onClick={}
            >
              <PlusIcon className="size-5" />
              <span className="text-sm">add alert</span>
            </div>
          </div>
        )}
        <CreateEditEvaluationDialog
          open={evalsModalOpen}
          setOpen={setEvalsModalOpen}
          savedSearchId={searchId}
          selectedEvalSet={selectedEvalSet}
          voidSelectedEvalSet={() => setSelectedEvalSet(null)}
          filter={filter}
          setFilter={setFilter}
        />
      </CardContent>
    </Card>
  );
}

function CreateEditEvaluationDialog({
  open,
  setOpen,
  savedSearchId,
  selectedEvalSet,
  voidSelectedEvalSet,
  filter,
  setFilter,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  savedSearchId: string;
  selectedEvalSet: EvalSetWithIncludes | null;
  voidSelectedEvalSet: () => void;
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
}) {
  const [evalSet, setEvalSet] = useState<EvalSetWithIncludes>(
    selectedEvalSet ?? instantiateEvalSet({ savedSearchId }),
  );

  useEffect(() => {
    if (selectedEvalSet) {
      setEvalSet(selectedEvalSet);
    }
  }, [selectedEvalSet]);

  const { mutate: createEvalSet, isPending: isCreating } =
    api.eval.createSet.useMutation({
      onSuccess: (data) => {
        setFilter({
          ...filter,
          evalSets: filter.evalSets ? [...filter.evalSets, data] : [data],
        });
        voidSelectedEvalSet();
        setOpen(false);
      },
    });

  const { mutate: updateEvalSet, isPending: isUpdating } =
    api.eval.updateSet.useMutation({
      onSuccess: (data) => {
        setFilter({
          ...filter,
          evalSets: filter.evalSets?.map((es) =>
            es.id === data.id ? data : es,
          ),
        });
        voidSelectedEvalSet();
        setOpen(false);
      },
    });

  const handleSubmit = () => {
    if (selectedEvalSet) {
      updateEvalSet(evalSet);
    } else {
      console.log("creating new evaluation");
      console.log(evalSet);
      createEvalSet(evalSet);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex min-h-[400px] min-w-[600px] flex-col">
        {/* <DialogHeader>
          <DialogTitle className="text-lg font-medium leading-none tracking-tight">
            {selectedEvalSet ? "edit evaluation" : "create evaluation"}
          </DialogTitle>
        </DialogHeader> */}

        <div className="flex flex-col gap-4">
          <EvalSetCard evalSet={evalSet} onUpdate={setEvalSet} />
        </div>
        <DialogFooter className="mt-auto">
          <Button
            className="mt-4"
            onClick={handleSubmit}
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating ? <Spinner /> : "save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
