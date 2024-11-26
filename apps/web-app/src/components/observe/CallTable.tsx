import { type SortingState } from "@tanstack/react-table";
import { DataTable } from "./call-table/CallsDataTable";
import { columns } from "./call-table/columns";
import { type CallWithIncludes } from "~/lib/types";
import { useObserveState } from "../hooks/useObserveState";
import { useCallback, useEffect, useState } from "react";

export default function CallTable({ calls }: { calls: CallWithIncludes[] }) {
  const { setOrderBy } = useObserveState();

  const [sorting, setSorting] = useState<SortingState>([
    { id: "startedAt", desc: true },
  ]);

  // const sorting = useMemo(() => {
  //   return orderBy
  //     ? [{ id: orderBy.property, desc: orderBy.direction === "desc" }]
  //     : [{ id: "startedAt", desc: true }];
  // }, [orderBy]);

  const handleSortingChange = useCallback(
    (sorting: SortingState) => {
      setOrderBy({
        property: sorting[0]?.id ?? "startedAt",
        direction: sorting[0]?.desc ? "desc" : "asc",
      });
    },
    [setOrderBy],
  );

  useEffect(() => {
    handleSortingChange(sorting);
  }, [handleSortingChange, sorting]);

  return (
    <DataTable
      sorting={sorting}
      onSortingChange={setSorting}
      columns={columns}
      data={calls}
    />
  );
}
