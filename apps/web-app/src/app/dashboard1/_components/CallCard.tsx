import { formatDistanceToNow } from "date-fns";
import { cn, formatDurationHoursMinutesSeconds } from "~/lib/utils";
import type { Call } from "~/lib/types";

export default function CallCard({
  call,
  selectedCallId,
  onSelect,
}: {
  call: Call;
  selectedCallId: string | null;
  onSelect: (callId: string) => void;
}) {
  return (
    <div
      className="relative cursor-pointer border-b border-input bg-background p-2 pl-4 hover:bg-muted"
      onClick={() => onSelect(call.id)}
    >
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-1 bg-primary",
          call.id === selectedCallId ? "visible" : "hidden",
        )}
      ></div>
      <div className="mb-1 flex items-center justify-between">
        <div className="truncate text-sm font-medium">{call.id}</div>
        <div className="ml-2 flex shrink-0 items-center text-xs text-muted-foreground">
          {formatDistanceToNow(call.createdAt, { addSuffix: true })}
          <div
            className={cn(
              "ml-2 size-2 shrink-0 rounded-full bg-primary",
              call.unread ? "opacity-100" : "opacity-0",
            )}
          ></div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "rounded-full px-2 py-1 text-xs",
            call.errors ? "bg-red-100" : "bg-gray-100",
          )}
        >
          {call.errors ? "error detected" : "no errors"}
        </div>
        <div className="ml-2 flex shrink-0 items-center text-xs text-muted-foreground">
          {formatDurationHoursMinutesSeconds(call.duration)}
          <div className="ml-2 size-2 shrink-0"></div>
        </div>
      </div>
    </div>
  );
}
