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

export default function ConversationTable() {
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

  const {
    data: conversationsData,
    refetch: refetchConversations,
    isLoading: isLoadingConversations,
  } = api.conversations.getConversations.useQuery({
    projectId: project?.id,
    sorting: sorting,
    pageSize: pagination.pageSize,
    pageIndex: pagination.pageIndex,
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
  const [lastRefreshedAt, setLastRefreshedAt] = useState(new Date());
  useEffect(() => {
    if (conversationsData) {
      setLastRefreshedAt(new Date());
    }
  }, [conversationsData]);

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

  const [failureTolerance, setFailureTolerance] = useState(70);

  return (
    <div>
      <FailureToleranceSlider
        defaultValue={failureTolerance}
        onCommit={setFailureTolerance}
      />
      <RefreshButton
        onRefresh={refresh}
        refreshing={refreshing}
        isLoading={isLoadingConversations}
        lastRefreshedAt={lastRefreshedAt}
      />

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

export function RefreshButton({
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
    <div className="mb-2 flex items-center gap-2">
      <Button
        variant="outline"
        onClick={onRefresh}
        disabled={refreshing || isLoading}
      >
        <ArrowPathIcon
          className={cn(
            "mr-2 h-4 w-4",
            (refreshing || isLoading) && "animate-spin",
          )}
        />{" "}
        {refreshing || isLoading ? "refreshing..." : "refresh"}
      </Button>
      {!(refreshing || isLoading) && (
        <span className="text-sm text-muted-foreground">
          last refreshed at {lastRefreshedAt.toLocaleString()}
        </span>
      )}
    </div>
  );
}

function FailureToleranceSlider({
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
        <Label className="text-md" htmlFor="failure-tolerance">
          failure tolerance
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
            id="failure-tolerance"
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
