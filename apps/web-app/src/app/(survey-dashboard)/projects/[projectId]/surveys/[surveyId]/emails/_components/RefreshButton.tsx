import { ArrowPathIcon } from "@heroicons/react/24/outline";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export function RefreshButton({
  onRefresh,
  refreshing,
}: {
  onRefresh: () => void;
  refreshing: boolean;
  lastRefreshedAt: Date;
}) {
  return (
    <div className="flex items-center justify-between gap-1">
      <span className="ml-4 font-medium">Inbox</span>
      {/* <div>
        {!refreshing && (
          <span className="text-sm text-muted-foreground">
            Last refreshed{" "}
            {formatDistanceToNow(lastRefreshedAt, { addSuffix: true })}
          </span>
        )}
      </div> */}
      <Button
        variant="outline"
        onClick={onRefresh}
        disabled={refreshing}
        className="w-fit"
      >
        <ArrowPathIcon
          className={cn("mr-2 h-4 w-4", refreshing && "animate-spin")}
        />{" "}
        {refreshing ? "Refreshing..." : "Refresh"}
      </Button>
    </div>
  );
}
