"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectValue,
  SelectItem,
  SelectContent,
  SelectTrigger,
} from "~/components/ui/select";
import CallCard from "./_components/CallCard";
import type { Call } from "~/lib/types";
import CallDetails from "./_components/CallDetails";
import { useAudio } from "./_components/useAudio";
import { TEST_CALLS } from "~/lib/test-data";

type CallType = "error" | "no-errors" | "all";

export default function DashboardPage() {
  const [selectedCallType, setSelectedCallType] = useState<CallType>("error");
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const { play, pause, seek, isPlaying } = useAudio();

  useEffect(() => {
    // Load calls on mount
    setCalls(TEST_CALLS);
    setSelectedCallId(TEST_CALLS[0]?.id ?? null);
  }, []);

  return (
    <div className="container mx-auto flex h-full flex-col overflow-hidden pt-8">
      <h1 className="mb-8 text-2xl font-medium">Dashboard</h1>
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
              onValueChange={(value) => setSelectedCallType(value as CallType)}
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
  );
}
