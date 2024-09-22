"use client";

import { DataTable } from "~/components/DataTable";
import { columns } from "./ConversationTableColumns";
import { api } from "~/trpc/react";
import { useCallback, useMemo, useState } from "react";
import { type SortingState } from "@tanstack/react-table";

export default function ConversationTable() {
  const initialSorting = useMemo(() => [{ id: "createdAt", desc: true }], []);
  const [sorting, setSorting] = useState<SortingState>(initialSorting);

  const { data: project } = api.project.getProject.useQuery({
    projectId: "66efa899a85842502e89634c",
  });
  const outcomes = useMemo(() => {
    const obj: Record<string, string> = {};
    for (const outcome of project?.possibleOutcomes ?? []) {
      obj[outcome.id] = outcome.name;
    }
    return obj;
  }, [project]);

  const { data: rawConversations, refetch: refetchConversations } =
    api.conversations.getConversations.useQuery({
      // projectId: "66efa899a85842502e89634c",
      projectId: project?.id,
      limit: 10,
      sorting: sorting,
    });
  const conversations = useMemo(() => {
    return rawConversations?.map((conversation) => ({
      ...conversation,
      desiredOutcome: outcomes[conversation.desiredOutcomeId ?? ""],
      actualOutcome: outcomes[conversation.actualOutcomeId ?? ""],
    }));
  }, [outcomes, rawConversations]);

  const refetch = useCallback(
    (sorting: SortingState) => {
      setSorting(sorting);
      void refetchConversations();
    },
    [refetchConversations],
  );

  return (
    <DataTable
      data={conversations ?? []}
      columns={columns}
      initialSorting={initialSorting}
      refetch={refetch}
    />
  );
}
