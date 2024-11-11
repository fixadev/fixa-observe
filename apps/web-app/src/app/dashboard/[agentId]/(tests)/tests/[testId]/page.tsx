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
import type { TestWithIncludes } from "~/lib/types";
import CallDetails from "~/components/dashboard/CallDetails";
import { AudioProvider, useAudio } from "~/hooks/useAudio";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import useSocketMessage from "~/app/_components/UseSocketMessage";
import { type SocketMessage } from "~/lib/agent";
import { useUser } from "@clerk/nextjs";

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
  const [test, setTest] = useState<TestWithIncludes | null>(null);
  const { play, pause, seek, isPlaying } = useAudio();
  const { data: _test, isLoading } = api.test.get.useQuery({
    id: params.testId,
  });
  const { data: agent } = api.agent.get.useQuery({ id: params.agentId });

  const { user } = useUser();

  useSocketMessage(user?.id, (message: SocketMessage) => {
    if (test?.id === message.testId) {
      setTest((prev) =>
        prev
          ? {
              ...prev,
              calls: prev.calls.map((call) =>
                call.id === message.callId ? message.call : call,
              ),
            }
          : prev,
      );
    }
  });

  useEffect(() => {
    if (_test) {
      setTest(_test);
    }
  }, [_test]);

  return (
    <div>
      {/* header */}
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
          <div className="sticky top-[2.5rem] flex h-[calc(100vh-2.5rem-1px)] w-80 shrink-0 flex-col border-r border-input">
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
              {test?.calls
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