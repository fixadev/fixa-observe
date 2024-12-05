"use client";

import TestCard from "~/components/dashboard/TestCard";
import { useCallback, useEffect, useMemo, useState } from "react";
import CallCard from "~/components/dashboard/CallCard";
import type { TestWithIncludes } from "~/lib/types";
import CallDetails from "~/components/dashboard/CallDetails";
import { AudioProvider, useAudio } from "~/components/hooks/useAudio";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import useSocketMessage from "~/app/_components/UseSocketMessage";
import {
  type MessagesUpdatedData,
  type CallEndedData,
  type SocketMessage,
  type AnalysisStartedData,
  type CallStartedData,
} from "~/lib/agent";
import { useUser } from "@clerk/nextjs";
import { SlashIcon } from "@heroicons/react/24/solid";
import { CallResult, CallStatus } from "@prisma/client";
import Link from "next/link";
// import { TEST_TESTS } from "~/lib/test-data";
import TestScenarios from "~/components/dashboard/TestScenarios";
import { SidebarTrigger } from "~/components/ui/sidebar";

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
        } else if (message.type === "call-started") {
          const data = message.data as CallStartedData;
          setTest((prev) =>
            prev
              ? {
                  ...prev,
                  calls: prev.calls.map((call) =>
                    call.id === data.callId
                      ? { ...call, status: CallStatus.in_progress }
                      : call,
                  ),
                }
              : prev,
          );
        }
      },
      [test?.id, setTest],
    ),
  );

  // Add new state to track expanded scenarios
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const filteredCalls = useMemo(() => {
    return test?.calls
      .filter(
        (call) => !selectedScenario || call.scenario?.id === selectedScenario,
      )
      .sort((a, b) => {
        // Sort by scenario name first
        const scenarioCompare =
          a.scenario?.id?.localeCompare(b.scenario?.id ?? "") ?? 0;
        if (scenarioCompare !== 0) {
          return scenarioCompare;
        }
        // Then sort succeeded after failed within each scenario
        const aSucceeded = a.result === CallResult.success;
        const bSucceeded = b.result === CallResult.success;
        return aSucceeded === bSucceeded ? 0 : aSucceeded ? 1 : -1;
      });
  }, [selectedScenario, test?.calls]);

  const selectedCall = useMemo(() => {
    return filteredCalls?.find((call) => call.id === selectedCallId);
  }, [filteredCalls, selectedCallId]);

  useEffect(() => {
    setSelectedCallId(filteredCalls?.[0]?.id ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedScenario]);

  // useEffect(() => {
  //   setTest(TEST_TESTS[0]!);
  // }, []);
  useEffect(() => {
    if (_test) {
      setTest(_test);
      setSelectedCallId(_test.calls[0]?.id ?? null);
    }
  }, [_test]);

  return (
    <div>
      {/* header */}
      <div className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-input bg-sidebar px-4 lg:h-[60px]">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
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
            {test && (
              <TestScenarios
                test={test}
                selectedScenario={selectedScenario}
                setSelectedScenario={setSelectedScenario}
              />
            )}
            <div className="flex flex-col overflow-y-auto">
              {filteredCalls?.map((call) => (
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
          {selectedCall && agent && (
            <div className="min-h-screen flex-1">
              <CallDetails
                call={selectedCall}
                agentId={params.agentId}
                botName={selectedCall.testAgent?.name ?? ""}
                userName={agent.name}
                avatarUrl={selectedCall.testAgent?.headshotUrl ?? ""}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
