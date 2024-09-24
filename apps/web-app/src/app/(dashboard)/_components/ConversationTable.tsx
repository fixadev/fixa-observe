"use client";

import { DataTable } from "~/components/DataTable";
import { columns } from "./ConversationTableColumns";
import { api } from "~/trpc/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { type PaginationState, type SortingState } from "@tanstack/react-table";
import { useProject } from "~/app/contexts/projectContext";
import { skipToken } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { cn } from "~/lib/utils";
import { Slider } from "~/components/ui/slider";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
// import { Conversation } from "@prisma/client";
import FailureChart, { type FailureChartPeriod } from "./FailureChart";

export default function ConversationTable() {
  // Define variables
  const initialSorting = useMemo(() => [{ id: "createdAt", desc: true }], []);
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const initialPagination = useMemo(
    () => ({
      pageIndex: 0,
      pageSize: 50,
    }),
    [],
  );
  const [pagination, setPagination] =
    useState<PaginationState>(initialPagination);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(new Date());
  const { selectedProject } = useProject();
  const { data: project } = api.project.getProject.useQuery(
    selectedProject?.id
      ? {
          projectId: selectedProject.id,
        }
      : skipToken,
  );
  const outcomes = useMemo(() => {
    const obj: Record<string, string> = {};
    for (const outcome of project?.possibleOutcomes ?? []) {
      obj[outcome.id] = outcome.name;
    }
    return obj;
  }, [project]);
  const [failureThreshold, setFailureThreshold] = useState(70);

  // Chart data
  const [chartPeriod, setChartPeriod] = useState<FailureChartPeriod>("1h");
  const chartMinDate = useMemo(() => {
    const now = lastRefreshedAt;
    const periods: Record<FailureChartPeriod, number> = {
      "1h": 1,
      "24h": 24,
      "7d": 7 * 24,
      "30d": 30 * 24,
    };
    const minDate = new Date(
      now.getTime() - periods[chartPeriod] * 60 * 60 * 1000,
    );
    return minDate;
  }, [chartPeriod, lastRefreshedAt]);
  const chartMaxDate = useMemo(() => {
    return lastRefreshedAt;
  }, [lastRefreshedAt]);
  const { data: chartConversations } =
    api.conversations.getConversations.useQuery({
      projectId: project?.id,
      sorting: [{ id: "createdAt", desc: false }],
      failureThreshold: failureThreshold,
      minDate: chartMinDate.toISOString(),
      maxDate: chartMaxDate.toISOString(),
    });

  // Table data
  const {
    data: conversationsData,
    refetch: refetchConversations,
    isLoading: isLoadingConversations,
  } = api.conversations.getConversations.useQuery({
    projectId: project?.id,
    sorting: sorting,
    pageSize: pagination.pageSize,
    pageIndex: pagination.pageIndex,
    failureThreshold: failureThreshold,
  });
  const conversations = useMemo(() => {
    return (
      conversationsData?.conversations?.map((conversation) => ({
        ...conversation,
        desiredOutcome: outcomes[conversation.desiredOutcomeId ?? ""],
        actualOutcome: outcomes[conversation.actualOutcomeId ?? ""],
      })) ?? []
    );
  }, [outcomes, conversationsData]);

  // Refresh stuff
  const [refreshing, setRefreshing] = useState(false);
  const refresh = useCallback(() => {
    setRefreshing(true);
    void refetchConversations().finally(() => {
      setRefreshing(false);
    });
  }, [refetchConversations]);
  useEffect(() => {
    const interval = setInterval(() => {
      if (!refreshing) {
        refresh();
      }
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [refresh, refreshing]);
  useEffect(() => {
    if (conversationsData) {
      setLastRefreshedAt(new Date());
    }
  }, [conversationsData]);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-2">
        <FailureThresholdSlider
          defaultValue={failureThreshold}
          onCommit={setFailureThreshold}
        />
        <RefreshButton
          onRefresh={refresh}
          refreshing={refreshing}
          isLoading={isLoadingConversations}
          lastRefreshedAt={lastRefreshedAt}
        />
      </div>
      {/* <FailureGraph conversations={conversations} /> */}
      <div className="mb-8">
        <FailureChart
          conversations={chartConversations?.conversations}
          chartPeriod={chartPeriod}
          chartMinDate={chartMinDate}
          chartMaxDate={chartMaxDate}
        />
      </div>
      <DataTable
        data={conversations}
        columns={columns}
        initialSorting={initialSorting}
        initialPagination={initialPagination}
        rowCount={conversationsData?.count}
        onSortingChange={setSorting}
        onPaginationChange={setPagination}
      />
    </div>
  );
}

// function FailureGraph({
//   conversations,
// }: {
//   conversations: Conversation[];
// }) {

//   return <div>FailureGraph</div>;
// }

function RefreshButton({
  onRefresh,
  refreshing,
  isLoading,
  lastRefreshedAt,
}: {
  onRefresh: () => void;
  refreshing: boolean;
  isLoading: boolean;
  lastRefreshedAt: Date;
}) {
  return (
    <div className="mb-2 flex flex-col items-end gap-1">
      <Button
        variant="outline"
        onClick={onRefresh}
        disabled={refreshing || isLoading}
        className="w-fit"
      >
        <ArrowPathIcon
          className={cn(
            "mr-2 h-4 w-4",
            (refreshing || isLoading) && "animate-spin",
          )}
        />{" "}
        {refreshing || isLoading ? "refreshing..." : "refresh"}
      </Button>
      <div className="h-5">
        {!(refreshing || isLoading) && (
          <span className="text-sm text-muted-foreground">
            last refreshed at {lastRefreshedAt.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}

function FailureThresholdSlider({
  defaultValue = 70,
  onCommit,
}: {
  defaultValue?: number;
  onCommit?: (value: number) => void;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        <Label className="text-md" htmlFor="failure-threshold">
          failure threshold
        </Label>
        <div className="text-sm text-muted-foreground">
          success probability below this amount will be flagged as a failure
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Slider
          value={[value]}
          onValueChange={(value) => {
            setValue(value[0] ?? 0);
          }}
          onValueCommit={(value) => {
            onCommit?.(value[0] ?? 0);
          }}
          min={0}
          max={100}
          step={1}
          className="max-w-96"
        />
        <div className="flex items-center gap-2">
          <Input
            id="failure-threshold"
            className="w-20"
            type="number"
            value={value}
            min={0}
            max={100}
            step={1}
            onChange={(e) => {
              setValue(parseInt(e.target.value, 10));
            }}
            onBlur={() => {
              onCommit?.(value);
            }}
          />
          <span>%</span>
        </div>
      </div>
    </div>
  );
}
