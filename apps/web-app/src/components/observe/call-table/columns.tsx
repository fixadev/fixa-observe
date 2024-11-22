import { type ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { CopyButton } from "~/components/CopyButton";
import { type CallWithIncludes } from "~/lib/types";
import { calculateLatencyPercentiles } from "~/lib/utils";

export type CallWithLatency = {
  id: string;
  createdAt: Date;
  callId: string;
  name: string;
  p50: number;
  p95: number;
  p99: number;
};

export const columns: ColumnDef<CallWithIncludes>[] = [
  {
    id: "agent-picture",
    // header: () => <div className="w-[1%]" />,
    cell: () => {
      return (
        <div className="flex size-full items-center justify-center">
          <Image
            className="size-[32px] shrink-0 rounded-full"
            src="/images/agent-avatars/jordan.png"
            alt="Jordan"
            width={32}
            height={32}
          />
        </div>
      );
    },
    size: 32,
  },
  {
    header: "details",
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
  },
  {
    accessorKey: "p50",
    header: "p50",
    cell: ({ row }) => {
      const call = row.original;
      const { p50 } = calculateLatencyPercentiles(
        call.latencyBlocks.map((block) => block.duration),
      );
      return (
        <div className="font-medium text-green-500">
          {Math.round(p50 * 1000)}ms
        </div>
      );
    },
  },
  {
    accessorKey: "p95",
    header: "p95",
    cell: ({ row }) => {
      const call = row.original;
      const { p90 } = calculateLatencyPercentiles(
        call.latencyBlocks.map((block) => block.duration),
      );
      return (
        <div className="font-medium text-muted-foreground">
          {Math.round(p90 * 1000)}ms
        </div>
      );
    },
  },
  {
    accessorKey: "p99",
    header: "p99",
    cell: ({ row }) => {
      const call = row.original;
      const { p95 } = calculateLatencyPercentiles(
        call.latencyBlocks.map((block) => block.duration),
      );
      return (
        <div className="font-medium text-red-500">
          {Math.round(p95 * 1000)}ms
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "created at",
    cell: ({ row }) => {
      const call = row.original;
      return (
        <div className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(), { addSuffix: true })}
        </div>
      );
    },
    size: 50,
  },
];
