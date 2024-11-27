import { type SortingState } from "@tanstack/react-table";
import { DataTable } from "./call-table/CallsDataTable";
import { columns } from "./call-table/columns";
import { type CallWithIncludes } from "~/lib/types";
import { useObserveState } from "../hooks/useObserveState";
import { useCallback, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";

export default function CallTable({
  calls,
  isLoading,
}: {
  calls: CallWithIncludes[];
  isLoading?: boolean;
}) {
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
    <div className="flex flex-col gap-2">
      {/* <Input className="max-w-md" placeholder="search for call ID" /> */}
      {(isLoading ?? !calls) ? (
        <div className="flex flex-col gap-1">
          <Skeleton className="h-[50px] w-full" />
          <Skeleton className="h-[50px] w-full" />
          <Skeleton className="h-[50px] w-full" />
          <Skeleton className="h-[50px] w-full" />
          <Skeleton className="h-[50px] w-full" />
          <Skeleton className="h-[50px] w-full" />
        </div>
      ) : (
        <DataTable
          sorting={sorting}
          onSortingChange={setSorting}
          columns={columns}
          data={calls}
        />
      )}
    </div>
  );
}
