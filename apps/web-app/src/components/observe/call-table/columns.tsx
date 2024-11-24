import { type ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { CopyButton } from "~/components/CopyButton";
import AudioPlayer from "~/components/dashboard/AudioPlayer";
import { useObserveState } from "~/components/hooks/useObserveState";
import { Button } from "~/components/ui/button";
import { type CallWithIncludes } from "~/lib/types";
import { calculateLatencyPercentiles } from "~/lib/utils";

export const columns: ColumnDef<CallWithIncludes>[] = [
  {
    header: "id",
    cell: ({ row }) => {
      const call = row.original;
      return (
        <div className="flex flex-col">
          {/* <div className="text-sm font-medium">{call.name}</div> */}
          <div className="flex items-center gap-1">
            <div className="text-sm font-medium">
              {call.customerCallId ?? "unknown"}
            </div>
            <CopyButton text={call.customerCallId ?? ""} size="xs" />
          </div>
        </div>
      );
    },
    size: 50,
  },
  // {
  //   header: "audio",
  //   cell: ({ row }) => {
  //     const call = row.original;
  //     return <AudioPlayer call={call} small />;
  //   },
  //   size: 300,
  // },
  {
    id: "latency",
    header: () => {
      return (
        <div className="flex w-full flex-col items-center gap-1 px-4">
          <div className="text-base font-medium">latency</div>
          <div className="flex w-full justify-between gap-2">
            <div className="w-12 text-center text-xs">50%</div>
            <div className="w-12 text-center text-xs">90%</div>
            <div className="w-12 text-center text-xs">95%</div>
          </div>
        </div>
      );
    },
    cell: ({ row }) => {
      const call = row.original;
      const { p50, p90, p95 } = calculateLatencyPercentiles(
        call.latencyBlocks.map((block) => block.duration),
      );
      return (
        <div className="flex w-full justify-between gap-2 px-4">
          <div className="w-12 text-center text-xs">
            {Math.round(p50 * 1000)}ms
          </div>
          <div className="w-12 text-center text-xs">
            {Math.round(p90 * 1000)}ms
          </div>
          <div className="w-12 text-center text-xs">
            {Math.round(p95 * 1000)}ms
          </div>
        </div>
      );
    },
    size: 50,
  },
  {
    id: "interruptions",
    header: () => {
      return (
        <div className="flex w-full flex-col items-center gap-1 px-4">
          <div className="text-base font-medium">interruptions</div>
          <div className="flex w-full justify-between gap-2">
            <div className="w-12 text-center text-xs">50%</div>
            <div className="w-12 text-center text-xs">90%</div>
            <div className="w-12 text-center text-xs">95%</div>
            <div className="w-12 text-center text-xs">total</div>
          </div>
        </div>
      );
    },
    cell: ({ row }) => {
      const call = row.original;
      const { p50, p90, p95 } = calculateLatencyPercentiles(
        call.latencyBlocks.map((block) => block.duration),
      );
      // const numInterruptions = Math.floor(Math.random() * 7);
      const numInterruptions = 6;
      return (
        <div className="flex w-full justify-between gap-2 px-4">
          <div className="w-12 text-center text-xs">
            {Math.round(p50 * 1000)}ms
          </div>
          <div className="w-12 text-center text-xs">
            {Math.round(p90 * 1000)}ms
          </div>
          <div className="w-12 text-center text-xs">
            {Math.round(p95 * 1000)}ms
          </div>
          <div className="w-12 text-center text-xs">{numInterruptions}</div>
        </div>
      );
    },
    size: 50,
  },
  {
    header: "created at",
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
    <Button variant="ghost" onClick={() => setSelectedCallId(call.id)}>
      view details
    </Button>
  );
};
