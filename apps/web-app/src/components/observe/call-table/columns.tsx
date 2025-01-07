import { type ColumnDef, type Table } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { CopyButton } from "~/components/CopyButton";
import { useObserveState } from "~/components/hooks/useObserveState";
import { Button } from "~/components/ui/button";
import { type CallWithIncludes } from "@repo/types/src/index";
import { cn, getInterruptionsColor, getLatencyColor } from "~/lib/utils";
import { SortButton } from "./SortButton";
import {
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useMemo } from "react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "~/components/ui/hover-card";
import EvalResultChip from "~/components/dashboard/EvalResultChip";

interface TableMeta {
  readCallIds: Set<string>;
}

export const columns: ColumnDef<CallWithIncludes>[] = [
  {
    header: ({ column }) => <SortButton column={column} title="id" />,
    accessorKey: "customerCallId",
    cell: ({ row, table }) => {
      const call = row.original;
      const typedTable = table as Table<CallWithIncludes> & {
        options: { meta: TableMeta };
      };
      const readCallIds = typedTable.options.meta?.readCallIds ?? new Set();
      const isRead = call.unread === false || readCallIds.has(call.id);
      return (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div
              className={cn("text-sm font-normal", !isRead && "font-medium")}
            >
              {call.customerCallId ?? "unknown"}
            </div>
            <CopyButton text={call.customerCallId ?? ""} size="xs" />
          </div>
          <Button
            variant="ghost"
            className="gap-2 text-xs text-muted-foreground"
            asChild
          >
            <Link
              href={`/observe/calls/${call.customerCallId}`}
              target="_blank"
            >
              direct link <ArrowTopRightOnSquareIcon className="size-4" />
            </Link>
          </Button>
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
              {call.latencyP90 ?? 0}ms
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
              {call.latencyP95 ?? 0}ms
            </div>
          </div>
        </div>
      );
    },
    size: 10,
  },
  {
    header: ({ column }) => (
      <SortButton column={column} title="interruptions" />
    ),
    accessorKey: "numInterruptions",
    cell: ({ row }) => {
      const call = row.original;
      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <div
              className={cn(
                "text-sm font-medium",
                getInterruptionsColor(call.numInterruptions ?? 0),
              )}
            >
              {call.numInterruptions ?? 0}
            </div>
          </div>
        </div>
      );
    },
    size: 10,
  },
  {
    id: "evalResults",
    header: () => <div className="text-xs font-medium">eval results</div>,
    cell: ({ row }) => {
      const call = row.original;
      return <EvalResultCell call={call} />;
    },
    size: 50,
  },
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

const EvalResultCell = ({ call }: { call: CallWithIncludes }) => {
  const { savedSearch } = useObserveState();
  const evaluationGroupIds = useMemo(
    () =>
      new Set(
        savedSearch?.evaluationGroups?.map(
          (evaluationGroup) => evaluationGroup.id,
        ) ?? [],
      ),
    [savedSearch],
  );
  const callEvaluationGroupIds = useMemo(
    () => Object.keys(call.evalSetToSuccess ?? {}),
    [call],
  );
  const relevantEvaluationGroupIds = useMemo(
    () => callEvaluationGroupIds.filter((id) => evaluationGroupIds.has(id)),
    [callEvaluationGroupIds, evaluationGroupIds],
  );
  const passed = useMemo(() => {
    const evalSetToSuccess = call.evalSetToSuccess as Record<string, boolean>;
    return relevantEvaluationGroupIds.filter(
      (id) => evalSetToSuccess[id] === true,
    ).length;
  }, [relevantEvaluationGroupIds, call.evalSetToSuccess]);
  const total = useMemo(
    () => relevantEvaluationGroupIds.length,
    [relevantEvaluationGroupIds],
  );
  const filteredEvalResults = useMemo(() => {
    return call.evaluationResults.filter(
      (evalResult) =>
        evalResult.evaluation.evaluationGroupId &&
        evaluationGroupIds.has(evalResult.evaluation.evaluationGroupId),
    );
  }, [call.evaluationResults, evaluationGroupIds]);

  if (total === 0) {
    return <div className="text-sm text-muted-foreground/50">n/a</div>;
  }
  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild>
        <div className="w-fit pr-1">
          <div className="flex cursor-pointer items-center gap-1 rounded-sm p-1 hover:bg-gray-200">
            {passed === total ? (
              <CheckCircleIcon className="size-5 text-green-500" />
            ) : (
              <XCircleIcon className="size-5 text-red-500" />
            )}
            <div className="text-sm font-medium">
              {passed}/{total}
            </div>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        side="right"
        align="start"
        sideOffset={0}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1">
          {filteredEvalResults.map((evalResult) => (
            <EvalResultChip key={evalResult.id} evalResult={evalResult} />
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
