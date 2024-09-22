"use client";

import { DataTable } from "~/components/DataTable";
import { columns } from "./ConversationTableColumns";
import { api } from "~/trpc/react";
import { useCallback, useMemo, useState } from "react";
import { type PaginationState, type SortingState } from "@tanstack/react-table";
import { useProject } from "~/app/contexts/projectContext";
import { skipToken } from "@tanstack/react-query";

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

  const { data: conversationsData } =
    api.conversations.getConversations.useQuery({
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

  const refetch = useCallback(
    (sorting: SortingState, pagination: PaginationState) => {
      setSorting(sorting);
      setPagination(pagination);
    },
    [],
  );

  return (
    <DataTable
      data={conversations}
      columns={columns}
      initialSorting={initialSorting}
      initialPagination={initialPagination}
      rowCount={conversationsData?.count}
      refetch={refetch}
    />
  );
}
