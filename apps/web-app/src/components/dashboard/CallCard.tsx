import { formatDistanceToNow } from "date-fns";
import {
  cn,
  didCallSucceed,
  formatDurationHoursMinutesSeconds,
} from "~/lib/utils";
import type { CallWithIncludes } from "@repo/types/src/index";
import { useMemo } from "react";
import Image from "next/image";
import { CallStatus } from "@prisma/client";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

export default function CallCard({
  call,
  selectedCallId,
  onSelect,
  className,
}: {
  call: CallWithIncludes;
  selectedCallId: string | null;
  onSelect: (callId: string) => void;
  className?: string;
}) {
  const startedAt = useMemo(() => {
    return call.startedAt ? new Date(call.startedAt) : new Date();
  }, [call.startedAt]);

  const duration = useMemo(() => {
    const diff = call.endedAt
      ? new Date(call.endedAt).getTime() - startedAt.getTime()
      : 0;
    return Math.ceil(diff / 1000);
  }, [call.endedAt, startedAt]);

  const numErrors = useMemo(() => {
    return call.evaluationResults.filter((evalResult) => !evalResult.success)
      .length;
  }, [call.evaluationResults]);

  return (
    <div
      className={cn(
        "relative flex cursor-pointer gap-2 overflow-hidden border-b border-input bg-background p-2 pl-2 hover:bg-muted/50",
        call.id === selectedCallId && "bg-muted",
        className,
      )}
      onClick={() => onSelect(call.id)}
    >
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-1 bg-primary",
          call.id === selectedCallId ? "visible" : "hidden",
        )}
      ></div>
      <div className="flex size-[48px] shrink-0 items-center">
        <Image
          src={call.testAgent?.headshotUrl ?? ""}
          alt="agent avatar"
          width={48}
          height={48}
          className="rounded-full"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center justify-between gap-4">
          <div className="truncate text-sm font-medium">
            {call.scenario?.name}
          </div>

          {call.status === CallStatus.completed && (
            <div className="flex shrink-0 items-center text-xs text-muted-foreground">
              {formatDistanceToNow(startedAt, { addSuffix: true }).replace(
                "about ",
                "",
              )}
              {/* <div
                className={cn(
                  "ml-2 size-2 shrink-0 rounded-full bg-primary",
                  false ? "opacity-100" : "opacity-0",
                )}
              ></div> */}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-fit rounded-full px-2 py-1 text-xs",
                call.status === CallStatus.in_progress ||
                  call.status === CallStatus.analyzing ||
                  call.status === CallStatus.queued
                  ? "bg-yellow-100"
                  : didCallSucceed(call)
                    ? "bg-green-100"
                    : "bg-red-100",
              )}
            >
              {call.status === CallStatus.in_progress
                ? "in progress"
                : call.status === CallStatus.analyzing
                  ? "analyzing"
                  : call.status === CallStatus.queued
                    ? "queued"
                    : didCallSucceed(call)
                      ? "succeeded"
                      : "failed"}
            </div>

            {call.status === CallStatus.completed && numErrors > 0 && (
              <div className="flex gap-0.5">
                <ExclamationCircleIcon className="size-4 shrink-0 text-red-500" />
                <div className="mt-px text-xs text-muted-foreground">
                  {numErrors}
                </div>
              </div>
            )}
          </div>
          {call.status === CallStatus.completed && (
            <div className="flex shrink-0 items-center text-xs text-muted-foreground">
              {formatDurationHoursMinutesSeconds(duration)}
              {/* <div className="ml-2 size-2 shrink-0"></div> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
