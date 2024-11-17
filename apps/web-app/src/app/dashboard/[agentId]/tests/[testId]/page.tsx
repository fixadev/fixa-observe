"use client";

import TestCard from "~/components/dashboard/TestCard";
import { useCallback, useEffect, useState } from "react";
import CallCard from "~/components/dashboard/CallCard";
import type { TestWithIncludes } from "~/lib/types";
import CallDetails from "~/components/dashboard/CallDetails";
import { AudioProvider, useAudio } from "~/hooks/useAudio";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import useSocketMessage from "~/app/_components/UseSocketMessage";
import {
  type MessagesUpdatedData,
  type CallEndedData,
  type SocketMessage,
  type AnalysisStartedData,
} from "~/lib/agent";
import { useUser } from "@clerk/nextjs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { InformationCircleIcon, SlashIcon } from "@heroicons/react/24/solid";
import { CallStatus } from "@prisma/client";
import Link from "next/link";

// type CallType = "error" | "no-errors" | "all";

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
  // const [selectedCallType] = useState<CallType>("error");
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
  const [test, setTest] = useState<TestWithIncludes | null>(null);
  const { play, pause, seek, isPlaying } = useAudio();
  const { data: _test, isLoading } = api.test.get.useQuery({
    id: params.testId,
  });
  const { data: agent } = api.agent.get.useQuery({ id: params.agentId });

  const { user } = useUser();

  useSocketMessage(
    user?.id,
    useCallback(
      (message: SocketMessage) => {
        if (message.type === "call-ended") {
          const data = message.data as CallEndedData;
          if (test?.id === data.testId) {
            setTest((prev) =>
              prev
                ? {
                    ...prev,
                    calls: prev.calls.map((call) =>
                      call.id === data.callId ? data.call : call,
                    ),
                  }
                : prev,
            );
          }
        } else if (message.type === "messages-updated") {
          const data = message.data as MessagesUpdatedData;
          data.messages.sort((a, b) => a.time - b.time);
          if (test?.id === data.testId) {
            setTest((prev) =>
              prev
                ? {
                    ...prev,
                    calls: prev.calls.map((call) =>
                      call.id === data.callId
                        ? { ...call, messages: data.messages }
                        : call,
                    ),
                  }
                : prev,
            );
          }
        } else if (message.type === "analysis-started") {
          const data = message.data as AnalysisStartedData;
          if (test?.id === data.testId) {
            setTest((prev) =>
              prev
                ? {
                    ...prev,
                    calls: prev.calls.map((call) =>
                      call.id === data.callId
                        ? { ...call, status: CallStatus.analyzing }
                        : call,
                    ),
                  }
                : prev,
            );
          }
        }
      },
      [test?.id, setTest],
    ),
  );

  useEffect(() => {
    if (_test) {
      setTest(_test);
      setSelectedCallId(_test.calls[0]?.id ?? null);
    }
  }, [_test]);

  return (
    <div>
      {/* header */}
      <div className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-input bg-[#FAFBFC] px-4 lg:h-[60px]">
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/${params.agentId}`}>
            <div className="font-medium">test history</div>
          </Link>
          <SlashIcon className="size-4 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">{test?.id}</div>
        </div>
      </div>

      <div className="container flex items-center justify-between py-4">
        {isLoading || !test ? (
          <Skeleton className="h-20 w-full text-muted-foreground" />
        ) : (
          <TestCard
            test={test}
            className="w-full rounded-md border border-input shadow-sm"
          />
        )}
      </div>

      {/* content */}
      <div className="container">
        <div
          className="flex rounded-t-md border border-input shadow-sm outline-none"
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
          <div className="sticky top-[3.5rem] flex h-[calc(100vh-3.5rem-1px)] w-80 shrink-0 flex-col border-r border-input">
            {/* <div className="flex items-center gap-2 border-b border-input p-2">
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
            </div> */}
            <div className="flex flex-col gap-2 border-b border-input p-2">
              <div className="text-sm font-medium">scenarios</div>
              {test &&
                Array.from(
                  new Set(test.calls.map((call) => call.scenario?.name)),
                ).map((scenarioName) => {
                  const scenario = test.calls.find(
                    (call) => call.scenario?.name === scenarioName,
                  )?.scenario;
                  if (!scenario) return null;
                  const callsWithScenario = test.calls.filter(
                    (call) => call.scenario?.name === scenarioName,
                  );
                  const successCount = callsWithScenario.filter(
                    (call) => call.result === "success",
                  ).length;
                  const totalCount = callsWithScenario.length;
                  const successRate = (successCount / totalCount) * 100;

                  return (
                    <div
                      key={String(scenarioName)}
                      className="flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs font-medium">
                          {scenarioName}
                          <Popover>
                            <PopoverTrigger>
                              {/* <EllipsisHorizontalCircleIcon className="size-5 shrink-0 text-muted-foreground" /> */}
                              <InformationCircleIcon className="size-5 shrink-0 text-muted-foreground opacity-80" />
                            </PopoverTrigger>
                            <PopoverContent className="flex flex-col gap-1">
                              <div className="text-xs font-medium">
                                instructions
                              </div>
                              <div className="mb-1 text-xs text-muted-foreground">
                                {scenario.instructions}
                              </div>
                              <div className="text-xs font-medium">
                                success criteria
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {scenario.successCriteria}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="text-xs">
                          {Math.round(successRate)}%
                        </div>
                      </div>
                      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="bg-green-500"
                          style={{
                            width: `${successRate}%`,
                          }}
                        />
                        <div
                          className="bg-red-500"
                          style={{
                            width: `${100 - successRate}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{successCount} succeeded</span>
                        <span>{totalCount - successCount} failed</span>
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="flex flex-col overflow-y-auto">
              {test?.calls
                // .filter((call) => {
                //   if (selectedCallType === "error")
                //     return call.errors !== undefined;
                //   if (selectedCallType === "no-errors")
                //     return call.errors === undefined;
                //   return true;
                // })
                .map((call) => (
                  <CallCard
                    key={call.id}
                    className="shrink-0"
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
          {selectedCallId && agent && test && (
            <div className="min-h-screen flex-1">
              <CallDetails
                key={selectedCallId}
                call={test.calls.find((call) => call.id === selectedCallId)!}
                agent={agent}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
