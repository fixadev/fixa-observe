"use client";

import FlowChart from "~/components/FlowChart";
import { useAudio } from "../dashboard/_components/useAudio";
import { TEST_CALLS } from "~/lib/test-data";
import type { Call } from "~/lib/types";
import { useState, useEffect } from "react";
import CallCard from "../dashboard/_components/CallCard";

export default function Dashboard2Page() {
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const { play, pause, seek, isPlaying } = useAudio();

  useEffect(() => {
    // Load calls on mount
    setCalls(TEST_CALLS);
  }, []);

  return (
    <div className="relative">
      <FlowChart calls={calls} selectedCallId={selectedCallId} />
      <div className="absolute left-4 top-4">
        <div className="flex w-[20vw] min-w-[240px] max-w-[400px] flex-col overflow-y-auto rounded-md border border-input shadow-sm">
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
      </div>
    </div>
  );
}
