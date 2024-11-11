import {
  CheckCircleIcon,
  WrenchIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { CallResult } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { useMemo } from "react";
import { ibmPlexMono } from "~/app/fonts";
import { type TestWithIncludes } from "~/lib/types";
import { cn } from "~/lib/utils";

export default function TestCard({
  test,
  className,
}: {
  test: TestWithIncludes;
  className?: string;
}) {
  const callsSucceeded = useMemo(
    () => test.calls.filter((call) => call.result === CallResult.success),
    [test.calls],
  );

  const testFailed = useMemo(
    () => test.calls.some((call) => call.result === CallResult.failure),
    [test.calls],
  );

  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-input p-4",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {testFailed ? (
          <XCircleIcon className="size-8 text-red-500" />
        ) : (
          <CheckCircleIcon className="size-8 text-green-500" />
        )}
        <div className="flex flex-col gap-1">
          <div className="font-medium">
            {callsSucceeded.length}/{test.calls.length} checks passed
          </div>
          <div className="flex h-1.5 w-48 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-green-500 transition-all"
              style={{
                width: `${(callsSucceeded.length / test.calls.length) * 100}%`,
              }}
            />
            <div
              className="h-full bg-red-500 transition-all"
              style={{
                width: `${((test.calls.length - callsSucceeded.length) / test.calls.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
      {test.gitBranch && test.gitCommit ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className={cn("text-sm font-medium", ibmPlexMono.className)}>
              main
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn("text-sm font-medium", ibmPlexMono.className)}>
              90abcde fixes stuff
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
          <WrenchIcon className="size-4" /> manual run
        </div>
      )}
      <div className="flex gap-2">
        <div className="text-sm text-muted-foreground">
          {formatDistanceToNow(test.createdAt, { addSuffix: true })}
        </div>
      </div>
    </div>
  );
}
