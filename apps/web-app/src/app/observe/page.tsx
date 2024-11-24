"use client";

import { useMemo, useRef, useState } from "react";
import CallDetails from "~/components/dashboard/CallDetails";
import { useAudio } from "~/components/hooks/useAudio";
import CallTable from "~/components/observe/CallTable";
import Filters, {
  type Filter,
  lookbackPeriods,
} from "~/components/observe/Filters";
import LatencyChart from "~/components/observe/LatencyChart";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { TEST_OBSERVE_CALLS } from "~/lib/test-data";
import { api } from "~/trpc/react";

export default function ObservePage() {
  const [filter, setFilter] = useState<Filter>({
    lookbackPeriod: lookbackPeriods[0]!,
    agentId: "agent1",
    latencyThreshold: {
      enabled: true,
      value: 1000,
    },
    interruptionThreshold: {
      enabled: true,
      value: 1000,
    },
  });

  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const { play, pause, isPlaying } = useAudio();

  // const { data: latencyPercentiles } = api._call.getLatencyPercentiles.useQuery(
  //   {
  //     lookbackPeriod: lookbackPeriod.value,
  //   },
  // );
  const latencyPercentiles = useMemo(() => {
    return [];
  }, []);
  const calls = useMemo(() => {
    return TEST_OBSERVE_CALLS.slice(0, 2);
  }, []);
  // const { data: calls } = api._call.getCalls.useQuery({
  //   ownerId: "11x",
  // });

  const selectedCall = useMemo(
    () => calls?.find((call) => call.id === selectedCallId),
    [calls, selectedCallId],
  );

  return (
    <div className="relative h-full bg-muted/30">
      <Filters filter={filter} setFilter={setFilter} />
      <div className="flex flex-col gap-4 p-4">
        <div className="flex w-full gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="mb-2">latency</CardTitle>
              <div className="flex gap-4 border-l-4 border-primary pl-2">
                <div className="flex flex-col gap-1">
                  <div className="text-xs font-medium text-muted-foreground">
                    average
                  </div>
                  <div className="text-sm">
                    last {filter.lookbackPeriod.label}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-xs font-medium text-muted-foreground">
                    50%
                  </div>
                  <div className="text-sm">400ms</div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-xs font-medium text-muted-foreground">
                    90%
                  </div>
                  <div className="text-sm">1000ms</div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-xs font-medium text-muted-foreground">
                    95%
                  </div>
                  <div className="text-sm">1500ms</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <LatencyChart
                lookbackPeriod={filter.lookbackPeriod.value}
                data={latencyPercentiles ?? []}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="mb-2">interruptions</CardTitle>
              <div className="flex gap-4 border-l-4 border-primary pl-2">
                <div className="flex flex-col gap-1">
                  <div className="text-xs font-medium text-muted-foreground">
                    average
                  </div>
                  <div className="text-sm">
                    last {filter.lookbackPeriod.label}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-xs font-medium text-muted-foreground">
                    50%
                  </div>
                  <div className="text-sm">400ms</div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-xs font-medium text-muted-foreground">
                    90%
                  </div>
                  <div className="text-sm">1000ms</div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-xs font-medium text-muted-foreground">
                    95%
                  </div>
                  <div className="text-sm">1500ms</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <LatencyChart
                lookbackPeriod={filter.lookbackPeriod.value}
                data={latencyPercentiles ?? []}
              />
            </CardContent>
          </Card>
        </div>
        <CallTable
          calls={calls ?? []}
          onRowClick={(call) => setSelectedCallId(call.id)}
        />
        {selectedCall && (
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
                  call={selectedCall}
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
        )}
      </div>
    </div>
  );
}
