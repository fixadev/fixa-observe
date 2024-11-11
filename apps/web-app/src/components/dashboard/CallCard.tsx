import { formatDistanceToNow } from "date-fns";
import { cn, formatDurationHoursMinutesSeconds } from "~/lib/utils";
import type { CallWithIncludes } from "~/lib/types";
import { useMemo } from "react";
import Image from "next/image";
import { CallStatus } from "@prisma/client";

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
  const createdAt = useMemo(() => {
    return new Date(call.messages[0]?.time ?? 0);
  }, [call.messages]);

  const duration = useMemo(() => {
    const d =
      (call.messages[call.messages.length - 1]?.endTime ?? 0) -
      (call.messages[0]?.time ?? 0);
    return Math.ceil(d / 1000);
  }, [call.messages]);

  return (
    <div
      className={cn(
        "relative flex cursor-pointer gap-2 overflow-hidden border-b border-input bg-background p-2 pl-4 hover:bg-muted",
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
      <div className="flex shrink-0 items-center">
        <Image
          src={call.testAgent.headshotUrl}
          alt="agent avatar"
          width={48}
          height={48}
          className="rounded-full"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between gap-4">
          <div className="truncate text-sm font-medium">{call.intent.name}</div>

          {call.status !== CallStatus.in_progress && (
            <div className="flex shrink-0 items-center text-xs text-muted-foreground">
              {formatDistanceToNow(createdAt, { addSuffix: true })}
              <div
                className={cn(
                  "ml-2 size-2 shrink-0 rounded-full bg-primary",
                  false ? "opacity-100" : "opacity-0",
                )}
              ></div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-4">
          <div
            className={cn(
              "w-fit rounded-full px-2 py-1 text-xs",
              call.status === CallStatus.in_progress
                ? "bg-yellow-100"
                : call.result === "failure"
                  ? "bg-red-100"
                  : "bg-green-100",
            )}
          >
            {call.status === CallStatus.in_progress
              ? "in progress"
              : call.result === "failure"
                ? "failed"
                : "succeeded"}
          </div>
          {call.status !== CallStatus.in_progress && (
            <div className="flex shrink-0 items-center text-xs text-muted-foreground">
              {formatDurationHoursMinutesSeconds(duration)}
              <div className="ml-2 size-2 shrink-0"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
