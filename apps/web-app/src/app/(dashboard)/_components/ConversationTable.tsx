"use client";

import { DataTable } from "~/components/DataTable";
import { columns } from "./ConversationTableColumns";
import { api } from "~/trpc/react";
import { useCallback, useMemo, useState } from "react";
import { type SortingState } from "@tanstack/react-table";

export default function ConversationTable() {
  const initialSorting = useMemo(() => [{ id: "createdAt", desc: true }], []);
  const [sorting, setSorting] = useState<SortingState>(initialSorting);

  const { data: conversations, refetch: refetchConversations } =
    api.conversations.getConversations.useQuery({
      projectId: "66ef87e7f5c7f001b94e1c9d",
      limit: 10,
      sorting: sorting,
    });

  console.log(conversations);

  const refetch = useCallback(
    (sorting: SortingState) => {
      setSorting(sorting);
      void refetchConversations();
      // void refetchConversations();
      // {
      // projectId: "66ef79bb9eb80cb66e6fdd43",
      // limit: 10,
      // sorting: sorting as { id: string; desc: boolean }[],
      // }
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
