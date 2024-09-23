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
      console.log("refreshed");
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

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Button
          variant="outline"
          onClick={refresh}
          disabled={refreshing || isLoadingConversations}
        >
          <ArrowPathIcon
            className={cn(
              "mr-2 h-4 w-4",
              (refreshing || isLoadingConversations) && "animate-spin",
            )}
          />{" "}
          {refreshing || isLoadingConversations ? "Refreshing..." : "Refresh"}
        </Button>
        {!(refreshing || isLoadingConversations) && (
          <span className="text-sm text-muted-foreground">
            last refreshed at {lastRefreshedAt.toLocaleString()}
          </span>
        )}
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
