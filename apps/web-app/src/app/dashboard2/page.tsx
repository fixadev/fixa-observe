"use client";

import FlowChart from "~/components/FlowChart";
import { useAudio } from "../dashboard/_components/useAudio";
import { TEST_CALLS } from "~/lib/test-data";
import type { Call } from "~/lib/types";
import { useState, useEffect, useMemo } from "react";
import CallCard from "../dashboard/_components/CallCard";
import CallDetails from "../dashboard/_components/CallDetails";

export default function Dashboard2Page() {
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const { play, pause, seek, isPlaying } = useAudio();

  useEffect(() => {
    // Load calls on mount
    setCalls(TEST_CALLS);
  }, []);

  const callsMap = useMemo(() => {
    return new Map<string, Call>(calls.map((call) => [call.id, call]));
  }, [calls]);

  return (
    <div className="relative flex w-full overflow-hidden">
      <FlowChart calls={calls} selectedCallId={selectedCallId} />
      <div className="pointer-events-none absolute left-0 top-0 flex h-full w-full gap-4 overflow-hidden p-4">
        <div className="pointer-events-auto flex w-[20vw] min-w-[240px] max-w-[400px] flex-col overflow-y-auto rounded-md border border-input bg-background shadow-sm">
          {calls
            .filter((call) => true)
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
        {selectedCallId && (
          <div className="pointer-events-auto flex h-[60%] flex-1 self-end overflow-hidden rounded-md border border-input bg-background shadow-sm">
            <CallDetails
              key={selectedCallId}
              call={callsMap.get(selectedCallId)!}
            />
          </div>
        )}
      </div>
    </div>
  );
}
