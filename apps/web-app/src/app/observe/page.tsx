"use client";

import { useRef, useState } from "react";
import CallDetails from "~/components/dashboard/CallDetails";
import { useAudio } from "~/components/hooks/useAudio";
import CallTable from "~/components/observe/CallTable";
import LatencyChart from "~/components/observe/LatencyChart";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { TEST_OBSERVE_CALLS } from "~/lib/test-data";

type LookbackPeriod = {
  label: string;
  value: string;
};

const lookbackPeriods: LookbackPeriod[] = [
  { label: "24 hours", value: "24h" },
  { label: "2 days", value: "2d" },
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
];

export default function ObservePage() {
  const [lookbackPeriod, setLookbackPeriod] = useState<LookbackPeriod>(
    lookbackPeriods[0]!,
  );

  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const { play, pause, isPlaying } = useAudio();

  return (
    <div className="container">
      <div className="flex justify-between">
        <Select
          value={lookbackPeriod.value}
          onValueChange={(value) => {
            setLookbackPeriod(lookbackPeriods.find((p) => p.value === value)!);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="time range" />
          </SelectTrigger>
          <SelectContent>
            {lookbackPeriods.map((period) => (
              <SelectItem key={period.value} value={period.value}>
                {period.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline">refresh</Button>
      </div>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Latency</CardTitle>
        </CardHeader>
        <CardContent>
          <LatencyChart />
        </CardContent>
      </Card>
      <CallTable onRowClick={(call) => setSelectedCallId(call.id)} />
      <Dialog
        open={!!selectedCallId}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedCallId(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-[90vw] p-0">
          {/* <DialogHeader>
            <DialogTitle>Call Details</DialogTitle>
          </DialogHeader> */}
          <div
            className="h-[90vh] w-[90vw] overflow-hidden overflow-y-auto rounded-md focus:outline-none"
            ref={containerRef}
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
            <CallDetails
              call={TEST_OBSERVE_CALLS[0]!}
              botName="jordan"
              userName="caller"
              headerHeight={44}
              includeHeaderTop={false}
              avatarUrl="/images/agent-avatars/jordan.png"
              type="latency"
              containerRef={containerRef}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
