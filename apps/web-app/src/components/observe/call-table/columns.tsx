import { type ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { CopyButton } from "~/components/CopyButton";
import { useObserveState } from "~/components/hooks/useObserveState";
import { Button } from "~/components/ui/button";
import { type CallWithIncludes } from "~/lib/types";
import { cn, getInterruptionsColor, getLatencyColor } from "~/lib/utils";
import { SortButton } from "./SortButton";

export const columns: ColumnDef<CallWithIncludes>[] = [
  {
    header: ({ column }) => <SortButton column={column} title="id" />,
    accessorKey: "customerCallId",
    cell: ({ row }) => {
      const call = row.original;
      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <div className="text-sm font-medium">
              {call.customerCallId ?? "unknown"}
            </div>
            <CopyButton text={call.customerCallId ?? ""} size="xs" />
          </div>
        </div>
      );
    },
    size: 10,
  },
  {
    header: ({ column }) => <SortButton column={column} title="50%" />,
    accessorKey: "latencyP50",
    cell: ({ row }) => {
      const call = row.original;
      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <div
              className={cn(
                "text-sm font-medium",
                getLatencyColor(call.latencyP50 ?? 0),
              )}
            >
              {call.latencyP50 ?? 0}ms
            </div>
          </div>
        </div>
      );
    },
    size: 10,
  },
  {
    header: ({ column }) => <SortButton column={column} title="90%" />,
    accessorKey: "latencyP90",
    cell: ({ row }) => {
      const call = row.original;
      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <div
              className={cn(
                "text-sm font-medium",
                getLatencyColor(call.latencyP90 ?? 0),
              )}
            >
              {call.latencyP50 ?? 0}ms
            </div>
          </div>
        </div>
      );
    },
    size: 10,
  },
  {
    header: ({ column }) => <SortButton column={column} title="95%" />,
    accessorKey: "latencyP95",
    cell: ({ row }) => {
      const call = row.original;
      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <div
              className={cn(
                "text-sm font-medium",
                getLatencyColor(call.latencyP95 ?? 0),
              )}
            >
              {call.latencyP50 ?? 0}ms
            </div>
          </div>
        </div>
      );
    },
    size: 10,
  },
  // {
  //   header: ({ column }) => <SortButton column={column} title="50%" />,
  //   accessorKey: "interruptionP50",
  //   cell: ({ row }) => {
  //     const call = row.original;
  //     return (
  //       <div className="flex flex-col">
  //         <div className="flex items-center gap-1">
  //           <div
  //             className={cn(
  //               "text-sm font-medium",
  //               getLatencyColor(call.interruptionP50 ?? 0),
  //             )}
  //           >
  //             {call.interruptionP50 ?? 0}ms
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   },
  //   size: 10,
  // },
  // {
  //   header: ({ column }) => <SortButton column={column} title="90%" />,
  //   accessorKey: "interruptionP90",
  //   cell: ({ row }) => {
  //     const call = row.original;
  //     return (
  //       <div className="flex flex-col">
  //         <div className="flex items-center gap-1">
  //           <div
  //             className={cn(
  //               "text-sm font-medium",
  //               getLatencyColor(call.interruptionP90 ?? 0),
  //             )}
  //           >
  //             {call.interruptionP90 ?? 0}ms
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   },
  //   size: 10,
  // },
  // {
  //   header: ({ column }) => <SortButton column={column} title="95%" />,
  //   accessorKey: "interruptionP95",
  //   cell: ({ row }) => {
  //     const call = row.original;
  //     return (
  //       <div className="flex flex-col">
  //         <div className="flex items-center gap-1">
  //           <div
  //             className={cn(
  //               "text-sm font-medium",
  //               getLatencyColor(call.interruptionP95 ?? 0),
  //             )}
  //           >
  //             {call.interruptionP95 ?? 0}ms
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   },
  //   size: 10,
  // },
  {
    header: ({ column }) => <SortButton column={column} title="created at" />,
    accessorKey: "startedAt",
    cell: ({ row }) => {
      const call = row.original;
      if (!call.startedAt) {
        return null;
      }
      return (
        <div className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(call.startedAt), { addSuffix: true })}
        </div>
      );
    },
    size: 50,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const call = row.original;
      return <ActionCell call={call} />;
    },
    size: 50,
  },
];

const ActionCell = ({ call }: { call: CallWithIncludes }) => {
  const { setSelectedCallId } = useObserveState();
  return (
    <div className="flex w-full justify-end">
      <Button
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedCallId(call.id);
        }}
      >
        view details
      </Button>
    </div>
  );
};
