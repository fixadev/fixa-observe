"use client";

import TestCard from "~/components/dashboard/TestCard";
import { useEffect, useState } from "react";
import {
  Select,
  SelectValue,
  SelectItem,
  SelectContent,
  SelectTrigger,
} from "~/components/ui/select";
import CallCard from "~/components/dashboard/CallCard";
import type { CallWithIncludes } from "~/lib/types";
import CallDetails from "~/components/dashboard/CallDetails";
import { AudioProvider, useAudio } from "~/hooks/useAudio";
import { TEST_CALLS } from "~/lib/test-data";

type CallType = "error" | "no-errors" | "all";

export default function TestPageWithProvider({
  params,
}: {
  params: { agentId: string; testId: string };
}) {
  return (
    <AudioProvider>
      <TestPage params={params} />
    </AudioProvider>
  );
}

function TestPage({ params }: { params: { agentId: string; testId: string } }) {
  const [selectedCallType, setSelectedCallType] = useState<CallType>("error");
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
  const [calls, setCalls] = useState<CallWithIncludes[]>([]);
  const { play, pause, seek, isPlaying } = useAudio();

  useEffect(() => {
    // Load calls on mount
    setCalls(TEST_CALLS);
    setSelectedCallId(TEST_CALLS[0]?.id ?? null);
  }, []);
  return (
    <div>
      {/* header */}
      <div className="container flex items-center justify-between py-8">
        <TestCard className="w-full rounded-md border border-input shadow-sm" />
      </div>

      {/* content */}
      <div className="container mx-auto flex h-full flex-col overflow-hidden">
        <div
          className="flex flex-1 overflow-hidden rounded-md border border-input shadow-sm outline-none"
          autoFocus
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === " ") {
              e.preventDefault();
              if (isPlaying) {
                pause();
              } else {
                play();
              }
            }
          }}
        >
          <div className="flex w-96 shrink-0 flex-col overflow-hidden border-r border-input">
            <div className="flex items-center gap-2 border-b border-input p-2">
              <div className="text-sm">show</div>
              <Select
                value={selectedCallType}
                onValueChange={(value) =>
                  setSelectedCallType(value as CallType)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="call type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="error" className="cursor-pointer">
                    calls with errors
                  </SelectItem>
                  <SelectItem value="no-errors" className="cursor-pointer">
                    calls without errors
                  </SelectItem>
                  <SelectItem value="all" className="cursor-pointer">
                    all calls
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col overflow-y-auto">
              {calls
                .filter((call) => {
                  if (selectedCallType === "error")
                    return call.errors !== undefined;
                  if (selectedCallType === "no-errors")
                    return call.errors === undefined;
                  return true;
                })
                .map((call) => (
                  <CallCard
                    key={call.id}
                    call={call}
                    selectedCallId={selectedCallId}
                    onSelect={(callId) => {
                      setSelectedCallId(callId);
                      seek(0);
                    }}
                  />
                ))}
            </div>
          </div>
          {selectedCallId && (
            <CallDetails
              key={selectedCallId}
              call={calls.find((call) => call.id === selectedCallId)!}
            />
          )}
        </div>
      </div>
    </div>
  );
}
