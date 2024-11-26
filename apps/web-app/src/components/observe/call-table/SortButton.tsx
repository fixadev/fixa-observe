import { type Column } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface SortButtonProps<T> {
  column: Column<T>;
  title: string;
}

export function SortButton<T>({ column, title }: SortButtonProps<T>) {
  const isSorted = column.getIsSorted();

  if (!column.getCanSort()) {
    return <div>{title}</div>;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "-ml-3 h-8 hover:bg-transparent",
        column.getIsSorted() && "text-primary",
      )}
      onClick={() => column.toggleSorting()}
    >
      {title}
      {isSorted === "asc" && <ArrowUpIcon className="ml-2 h-4 w-4" />}
      {isSorted === "desc" && <ArrowDownIcon className="ml-2 h-4 w-4" />}
      {isSorted === false && (
        <ArrowUpDownIcon className="ml-2 h-4 w-4 opacity-50" />
      )}
    </Button>
  );
}
