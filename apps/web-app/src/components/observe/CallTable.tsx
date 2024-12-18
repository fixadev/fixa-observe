import { type SortingState } from "@tanstack/react-table";
import { DataTable } from "./call-table/CallsDataTable";
import { columns } from "./call-table/columns";
import { type CallWithIncludes } from "@repo/types/src/index";
import { useObserveState } from "../hooks/useObserveState";
import { useCallback, useEffect, useState, useMemo } from "react";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import debounce from "lodash/debounce";
import { Button } from "../ui/button";
import Link from "next/link";

export default function CallTable({
  calls,
  isLoading,
}: {
  calls: CallWithIncludes[];
  isLoading?: boolean;
}) {
  const { setOrderBy, filter, setFilter } = useObserveState();

  const [sorting, setSorting] = useState<SortingState>([
    { id: "startedAt", desc: true },
  ]);

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

  const [customerCallId, setCustomerCallId] = useState(
    filter.customerCallId ?? "",
  );

  const debouncedSetFilter = useMemo(
    () =>
      debounce((value: string) => {
        setFilter({ ...filter, customerCallId: value });
      }, 300),
    [setFilter, filter],
  );

  const handleCustomerCallIdChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCustomerCallId(e.target.value);
      debouncedSetFilter(e.target.value);
    },
    [debouncedSetFilter],
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end justify-between">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={customerCallId}
            onChange={handleCustomerCallIdChange}
            className="max-w-sm bg-background pl-8"
            placeholder="search for call ID"
          />
        </div>
        <Button size="sm" variant="link" className="px-0" asChild>
          <Link
            href="https://docs.fixa.dev/api-reference/endpoint/upload-call"
            target="_blank"
          >
            how do i upload a call?
          </Link>
        </Button>
      </div>

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
