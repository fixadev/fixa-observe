"use client";

import FlowChart from "~/components/FlowChart";
import { useAudio } from "../dashboard/_components/useAudio";
import { TEST_CALLS } from "~/lib/test-data";
import type { Call } from "~/lib/types";
import { useState, useEffect, useMemo } from "react";
import CallCard from "../dashboard/_components/CallCard";
import CallDetails from "../dashboard/_components/CallDetails";
import { Button } from "~/components/ui/button";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/solid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type TimeRange = "24h" | "3d" | "7d";

export default function Dashboard2Page() {
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const { seek } = useAudio();
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("24h");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    // Load calls on mount
    setCalls(TEST_CALLS);
  }, []);

  const callsMap = useMemo(() => {
    return new Map<string, Call>(calls.map((call) => [call.id, call]));
  }, [calls]);

  useEffect(() => {
    if (selectedCallId) {
      setSelectedNodeId(callsMap.get(selectedCallId)?.node ?? null);
    } else {
      setSelectedNodeId(null);
    }
  }, [callsMap, selectedCallId]);

  return (
    <div className="relative flex w-full overflow-hidden">
      <FlowChart
        selectedNodeId={selectedNodeId}
        onSelectNodeId={setSelectedNodeId}
      />
      <div className="pointer-events-none absolute left-0 top-0 flex h-full w-full gap-4 overflow-hidden p-4">
        <div className="pointer-events-auto flex w-[20vw] min-w-[240px] max-w-[400px] flex-col">
          <div className="mb-2 flex items-center justify-between">
            <Select
              value={selectedTimeRange}
              onValueChange={(value) =>
                setSelectedTimeRange(value as TimeRange)
              }
            >
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h" className="cursor-pointer">
                  last 24 hours
                </SelectItem>
                <SelectItem value="3d" className="cursor-pointer">
                  last 3 days
                </SelectItem>
                <SelectItem value="7d" className="cursor-pointer">
                  last 7 days
                </SelectItem>
              </SelectContent>
            </Select>
            <Button size="icon" variant="outline">
              <FunnelIcon className="size-4" />
            </Button>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto rounded-md border border-input bg-background shadow-sm">
            {calls
              .filter(
                (call) =>
                  selectedNodeId === null || call.node === selectedNodeId,
              )
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
          <div className="pointer-events-auto flex h-[50%] flex-1 self-end overflow-hidden rounded-md border border-input bg-background shadow-sm">
            <CallDetails
              key={selectedCallId}
              call={callsMap.get(selectedCallId)!}
            />
            <Button
              size="icon"
              variant="ghost"
              className="-ml-3 shrink-0"
              onClick={() => setSelectedCallId(null)}
            >
              <XMarkIcon className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
