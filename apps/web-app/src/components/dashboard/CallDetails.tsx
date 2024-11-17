import type { CallWithIncludes, EvalResultWithIncludes } from "~/lib/types";
import AudioPlayer, { type AudioPlayerRef } from "./AudioPlayer";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { cn, formatDurationHoursMinutesSeconds } from "~/lib/utils";
import { useAudio } from "~/hooks/useAudio";
import { type Agent } from "prisma/generated/zod";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { CallResult, CallStatus, Role } from "@prisma/client";
import Spinner from "../Spinner";

export default function CallDetails({
  call,
  agent,
}: {
  call: CallWithIncludes;
  agent: Agent;
}) {
  const audioPlayerRef = useRef<AudioPlayerRef>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastActiveIndexRef = useRef(-1);
  const [activeEvalResultId, setActiveEvalResultId] = useState<string | null>(
    null,
  );
  const { play, seek, currentTime } = useAudio();
  const headerRef = useRef<HTMLDivElement>(null);

  const messagesFiltered = useMemo(() => {
    return call.messages.filter((m) => m.role !== "system");
  }, [call.messages]);

  // Offset from the start of the call to the first message
  const offsetFromStart = useMemo(() => {
    return messagesFiltered[0]?.secondsFromStart ?? 0;
  }, [messagesFiltered]);

  // Index of the currently active message
  const activeMessageIndex = useMemo(() => {
    return messagesFiltered.findIndex((message, index) => {
      const messageStart = message.secondsFromStart - offsetFromStart;
      const nextMessage = messagesFiltered[index + 1];
      const nextMessageStart = nextMessage?.secondsFromStart
        ? nextMessage.secondsFromStart - offsetFromStart
        : Infinity;

      return currentTime >= messageStart && currentTime < nextMessageStart;
    });
  }, [currentTime, messagesFiltered, offsetFromStart]);

  const scrollMessageIntoView = useCallback((messageIndex: number) => {
    if (!scrollContainerRef.current || !headerRef.current) return;
    const messageElements = scrollContainerRef.current.children;
    const activeElement = messageElements[messageIndex];

    if (activeElement) {
      const elementRect = activeElement.getBoundingClientRect();
      const header = headerRef.current.getBoundingClientRect();
      const isAboveViewport = elementRect.top < header.bottom;
      const isBelowViewport = elementRect.bottom > window.innerHeight;

      if (isAboveViewport || isBelowViewport) {
        const headerTopOffset = 57;
        const scrollPosition =
          window.scrollY + elementRect.top - header.height - headerTopOffset;
        window.scrollTo({
          top: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  }, []);

  const activeEvalMessageIndices = useMemo(() => {
    if (!activeEvalResultId || !call.evalResults) return new Set<number>();

    const activeEval = call.evalResults.find(
      (evalResult) => evalResult.id === activeEvalResultId,
    );
    if (!activeEval) return new Set<number>();

    const overlappingIndices = new Set<number>();
    messagesFiltered.forEach((message, index) => {
      if (
        activeEval.secondsFromStart <
          (messagesFiltered[index + 1]?.secondsFromStart ?? Infinity) &&
        activeEval.secondsFromStart + activeEval.duration >
          message.secondsFromStart
      ) {
        overlappingIndices.add(index);
      }
    });

    return overlappingIndices;
  }, [call.evalResults, activeEvalResultId, messagesFiltered]);

  // Scroll to the active eval message if it has changed
  useEffect(() => {
    if (activeEvalMessageIndices.size > 0) {
      const firstIndex = Array.from(activeEvalMessageIndices)[0];
      if (typeof firstIndex === "number") {
        scrollMessageIntoView(firstIndex);
      }
    }
  }, [activeEvalMessageIndices, scrollMessageIntoView]);

  // Scroll to the active message if it has changed
  useEffect(() => {
    if (
      activeMessageIndex !== -1 &&
      activeMessageIndex !== lastActiveIndexRef.current &&
      scrollContainerRef.current
    ) {
      scrollMessageIntoView(activeMessageIndex);
      lastActiveIndexRef.current = activeMessageIndex;
    }
  }, [activeMessageIndex, scrollMessageIntoView]);

  const doesEvalOverlapMessage = useCallback(
    (evalResult: EvalResultWithIncludes, messageIndex: number) => {
      return (
        evalResult.secondsFromStart <
          (messagesFiltered[messageIndex + 1]?.secondsFromStart ?? Infinity) &&
        evalResult.secondsFromStart + evalResult.duration >
          (messagesFiltered[messageIndex]?.secondsFromStart ?? 0)
      );
    },
    [messagesFiltered],
  );

  const { messageEvalsMap, evalRangesMap: evalRangesMap } = useMemo(() => {
    if (!call.evalResults) {
      return {
        messageEvalsMap: new Map<number, EvalResultWithIncludes[]>(),
        evalRangesMap: new Map<
          string,
          { firstMessageIndex: number; lastMessageIndex: number }
        >(),
      };
    }

    const messageMap = new Map<number, EvalResultWithIncludes[]>();
    const rangesMap = new Map<
      string,
      { firstMessageIndex: number; lastMessageIndex: number }
    >();

    // First find initial ranges for each evalResult
    call.evalResults?.forEach((evalResult) => {
      let firstMessageIndex = Infinity;
      let lastMessageIndex = -1;

      messagesFiltered.forEach((_, messageIndex) => {
        if (doesEvalOverlapMessage(evalResult, messageIndex)) {
          firstMessageIndex = Math.min(firstMessageIndex, messageIndex);
          lastMessageIndex = Math.max(lastMessageIndex, messageIndex);
        }
      });

      if (lastMessageIndex !== -1) {
        rangesMap.set(evalResult.id, {
          firstMessageIndex,
          lastMessageIndex,
        });
      }
    });

    // Merge overlapping ranges
    call.evalResults?.forEach((evalResult) => {
      const currentRange = rangesMap.get(evalResult.id);
      if (!currentRange) return;

      call.evalResults?.forEach((otherEval) => {
        if (evalResult.id === otherEval.id) return;
        const otherRange = rangesMap.get(otherEval.id);
        if (!otherRange) return;

        // Check if ranges overlap
        if (
          currentRange.firstMessageIndex <= otherRange.lastMessageIndex &&
          currentRange.lastMessageIndex >= otherRange.firstMessageIndex
        ) {
          // Merge ranges
          const mergedFirst = Math.min(
            currentRange.firstMessageIndex,
            otherRange.firstMessageIndex,
          );
          const mergedLast = Math.max(
            currentRange.lastMessageIndex,
            otherRange.lastMessageIndex,
          );

          // Update both ranges to the merged range
          rangesMap.set(evalResult.id, {
            firstMessageIndex: mergedFirst,
            lastMessageIndex: mergedLast,
          });
          rangesMap.set(otherEval.id, {
            firstMessageIndex: mergedFirst,
            lastMessageIndex: mergedLast,
          });
        }
      });
    });

    // Now build messageMap using the merged ranges
    call.evalResults?.forEach((evalResult) => {
      const range = rangesMap.get(evalResult.id);
      if (!range) return;

      for (let i = range.firstMessageIndex; i <= range.lastMessageIndex; i++) {
        const existing = messageMap.get(i) ?? [];
        messageMap.set(i, [...existing, evalResult]);
      }
    });

    return { messageEvalsMap: messageMap, evalRangesMap: rangesMap };
  }, [call.evalResults, messagesFiltered, doesEvalOverlapMessage]);

  const getBorderColorClass = useCallback(
    (evalResultState: "success" | "failure" | "both") => {
      switch (evalResultState) {
        case "success":
          return "border-green-500";
        case "failure":
          return "border-red-500";
        case "both":
          return "border-input";
      }
    },
    [],
  );

  return (
    <div className="flex w-full flex-col rounded-md bg-background px-4 outline-none">
      <div
        ref={headerRef}
        className="sticky top-[calc(3.5rem+1px)] bg-background py-4"
      >
        {/* CALL ID: {call.id} */}
        <div className="flex items-center gap-4 pb-4">
          <div className="size-[48px] shrink-0">
            <Image
              src={call.testAgent?.headshotUrl ?? ""}
              alt="agent avatar"
              width={48}
              height={48}
              className="rounded-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium">{call.scenario?.name}</div>
              {call.status === CallStatus.completed && (
                <div
                  className={cn(
                    "w-fit rounded-full px-2 py-1 text-xs",
                    call.result === CallResult.failure
                      ? "bg-red-100"
                      : "bg-green-100",
                  )}
                >
                  {call.result === CallResult.failure ? "failed" : "succeeded"}
                </div>
              )}
            </div>
            {call.status !== CallStatus.completed && (
              <div className="-mt-1 flex items-center gap-2 text-sm italic text-muted-foreground">
                <Spinner className="size-4" />{" "}
                {call.status === CallStatus.analyzing
                  ? "analyzing call..."
                  : "call in progress..."}
              </div>
            )}
            <div className="flex w-fit flex-row flex-wrap gap-2">
              {call.evalResults?.map((evalResult) => (
                <div
                  key={evalResult.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-1 border-l-2 p-1 pl-1 text-xs",
                    evalResult.success
                      ? "border-green-500 bg-green-100 text-green-500 hover:bg-green-200"
                      : "border-red-500 bg-red-100 text-red-500 hover:bg-red-200",
                  )}
                  onMouseEnter={() => {
                    setActiveEvalResultId(evalResult.id);
                    audioPlayerRef.current?.setHoveredEvalResult(evalResult.id);
                  }}
                  onMouseLeave={() => {
                    setActiveEvalResultId(null);
                    audioPlayerRef.current?.setHoveredEvalResult(null);
                  }}
                  onClick={() => {
                    audioPlayerRef.current?.setActiveEvalResult(evalResult);
                    play();
                  }}
                >
                  {evalResult.success ? (
                    <CheckCircleIcon className="size-4 shrink-0 text-green-500" />
                  ) : (
                    <XCircleIcon className="size-4 shrink-0 text-red-500" />
                  )}
                  {evalResult.eval.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        {call.status === CallStatus.completed && (
          <AudioPlayer
            ref={audioPlayerRef}
            call={call}
            offsetFromStart={offsetFromStart}
            onEvalResultHover={(evalId) => {
              setActiveEvalResultId(evalId);
            }}
          />
        )}
      </div>

      <div ref={scrollContainerRef} className="-mx-4 flex flex-1 flex-col px-4">
        {messagesFiltered.map((message, index) => {
          const evalResults = messageEvalsMap.get(index) ?? [];
          const evalResultState = evalResults.every(
            (evalResult) => evalResult.success,
          )
            ? "success"
            : evalResults.every((evalResult) => !evalResult.success)
              ? "failure"
              : "both";
          const isFirstEvalMessage = evalResults.some(
            (evalResult) =>
              evalRangesMap.get(evalResult.id)?.firstMessageIndex === index,
          );
          const isLastEvalMessage = evalResults.some(
            (evalResult) =>
              evalRangesMap.get(evalResult.id)?.lastMessageIndex === index,
          );
          const isActiveEvalMessage = activeEvalMessageIndices.has(index);

          return (
            <div key={index} className="flex gap-2">
              <div className="mt-2 w-8 shrink-0 text-xs text-muted-foreground">
                {message.role !== Role.tool_calls &&
                message.role !== Role.tool_call_result
                  ? formatDurationHoursMinutesSeconds(
                      message.secondsFromStart - offsetFromStart,
                    )
                  : ""}
              </div>
              <div className="flex flex-1 flex-col">
                <div
                  onClick={() => {
                    if (
                      message.role === Role.tool_calls ||
                      message.role === Role.tool_call_result
                    ) {
                      return;
                    }
                    seek(message.secondsFromStart - offsetFromStart);
                    play();
                  }}
                  className={cn(
                    "flex-1 cursor-pointer rounded-md p-2 hover:bg-muted/30",
                    (message.role === Role.tool_calls ||
                      message.role === Role.tool_call_result) &&
                      "cursor-[unset] hover:bg-background",
                    activeMessageIndex === index
                      ? "bg-muted hover:bg-muted"
                      : "",
                    evalResults.length > 0
                      ? `rounded-none border-x ${getBorderColorClass(evalResultState)}`
                      : "",
                    evalResults.length > 0 && isActiveEvalMessage
                      ? "-mx-px border-x-2"
                      : "",
                    isFirstEvalMessage
                      ? `mt-px rounded-t-md border-t ${getBorderColorClass(evalResultState)}`
                      : "",
                    isFirstEvalMessage && isActiveEvalMessage
                      ? "mt-0 border-t-2"
                      : "",
                  )}
                >
                  <div className="text-xs font-medium">
                    {message.role === Role.bot
                      ? call.testAgent?.name
                      : message.role === Role.user
                        ? agent.name
                        : ""}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {message.message}
                  </div>
                </div>
                {isLastEvalMessage && (
                  <div
                    className={cn(
                      "flex cursor-pointer flex-col items-start rounded-b-md border-x border-b text-sm",
                      getBorderColorClass(evalResultState),
                      isActiveEvalMessage
                        ? "z-10 -mx-px -mb-px border-x-2 border-b-2 shadow-lg"
                        : "",
                    )}
                  >
                    {evalResults.map((evalResult) => (
                      <div
                        key={evalResult.id}
                        className={cn(
                          "flex w-full items-start gap-1 px-1 py-1",
                          evalResult.success
                            ? "border-green-500 bg-green-500/20 text-green-500"
                            : "border-red-500 bg-red-500/20 text-red-500",
                          evalResults.length > 1 &&
                            (evalResult.success
                              ? "hover:bg-green-500/30"
                              : "hover:bg-red-500/30"),
                        )}
                        onMouseEnter={() => {
                          setActiveEvalResultId(evalResult.id);
                          audioPlayerRef.current?.setHoveredEvalResult(
                            evalResult.id,
                          );
                        }}
                        onMouseLeave={() => {
                          setActiveEvalResultId(null);
                          audioPlayerRef.current?.setHoveredEvalResult(null);
                        }}
                        onClick={() => {
                          audioPlayerRef.current?.setActiveEvalResult(
                            evalResult,
                          );
                          play();
                        }}
                      >
                        {evalResult.success ? (
                          <CheckCircleIcon className="size-5 shrink-0" />
                        ) : (
                          <XCircleIcon className="size-5 shrink-0" />
                        )}
                        <div className="flex flex-col gap-0.5 text-sm">
                          <div className="font-medium">
                            {evalResult.eval.name}
                          </div>
                          <div className="text-xs">{evalResult.details}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div className="h-10 shrink-0" />
      </div>
    </div>
  );
}
