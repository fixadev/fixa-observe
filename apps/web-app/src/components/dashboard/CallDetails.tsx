"use client";

import type {
  CallWithIncludes,
  EvalResultWithIncludes,
} from "@repo/types/src/index";
import AudioPlayer, { type AudioPlayerRef } from "./AudioPlayer";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import {
  cn,
  formatDurationHoursMinutesSeconds,
  getLatencyBlockColor,
} from "~/lib/utils";
import {
  CheckCircleIcon,
  WrenchIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { CallStatus, type LatencyBlock, Role } from "@prisma/client";
import { LatencyCallHeader, TestCallHeader } from "./CallHeader";
import { type Message } from "@repo/types/src/index";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export type CallDetailsType = "test" | "latency";

export default function CallDetails({
  call,
  userName,
  botName,
  avatarUrl,
  agentId = "",
  type = "test",
  containerRef = null,
  headerHeight = 60,
  includeHeaderTop = true,
}: {
  call: CallWithIncludes;
  userName: string;
  botName: string;
  avatarUrl: string;
  agentId?: string;
  type?: CallDetailsType;
  containerRef?: React.RefObject<HTMLDivElement> | null;
  headerHeight?: number;
  includeHeaderTop?: boolean;
}) {
  const audioPlayerRef = useRef<AudioPlayerRef>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastActiveIndexRef = useRef(-1);
  const [activeEvalResultId, setActiveEvalResultId] = useState<string | null>(
    null,
  );
  const headerRef = useRef<HTMLDivElement>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const play = useCallback(() => {
    audioPlayerRef.current?.play();
  }, [audioPlayerRef]);
  const seek = useCallback((time: number) => {
    audioPlayerRef.current?.seek(time);
  }, []);

  const messagesFiltered = useMemo(() => {
    const ret = call.messages
      .filter((m) => m.role !== "system")
      .sort((a, b) => a.secondsFromStart - b.secondsFromStart);
    return ret;
  }, [call.messages]);

  const messageToLatencyMap = useMemo(() => {
    if (!call.latencyBlocks || !call.messages) return {};

    const map: Record<string, LatencyBlock> = {};

    for (const message of call.messages) {
      // Find the latency block that comes directly before this message
      const precedingBlock = call.latencyBlocks.filter((block) => {
        // Check if block ends exactly when message starts
        return (
          block.secondsFromStart + block.duration === message.secondsFromStart
        );
      })[0];

      if (precedingBlock) {
        map[message.id] = precedingBlock;
      }
    }

    return map;
  }, [call.latencyBlocks, call.messages]);

  // TODO: fix this
  // Offset from the start of the call to the first message
  const offsetFromStart = useMemo(() => {
    // If this is a customer call, we transcribe the messages ourselves so the offset is 0
    if (call.customerCallId) {
      return 0;
    }
    return messagesFiltered[0]?.secondsFromStart ?? 0;
  }, [messagesFiltered, call.customerCallId]);

  // Index of the currently active message
  const activeMessageIndex = useMemo(() => {
    return messagesFiltered.findIndex((message, index) => {
      const messageStart = message.secondsFromStart - offsetFromStart;
      const messageEnd = messageStart + message.duration;
      const prevMessageEnd = messagesFiltered[index - 1]
        ? messagesFiltered[index - 1]!.secondsFromStart - offsetFromStart
        : 0;
      const nextMessage = messagesFiltered[index + 1];
      const nextMessageStart = nextMessage?.secondsFromStart
        ? nextMessage.secondsFromStart - offsetFromStart
        : Infinity;

      if (type === "test") {
        return currentTime >= messageStart && currentTime < nextMessageStart;
      } else {
        return (
          (currentTime >= prevMessageEnd || currentTime >= messageStart) &&
          currentTime < messageEnd &&
          currentTime < nextMessageStart
        );
      }
    });
  }, [currentTime, messagesFiltered, offsetFromStart, type]);

  const scrollMessageIntoView = useCallback(
    (messageIndex: number) => {
      if (!scrollContainerRef.current || !headerRef.current) return;
      const messageElements = scrollContainerRef.current.children;
      const activeElement = messageElements[messageIndex];

      if (activeElement) {
        const container = containerRef?.current ?? window;
        const height =
          containerRef?.current?.clientHeight ?? window.innerHeight;
        const elementRect = activeElement.getBoundingClientRect();
        const header = headerRef.current.getBoundingClientRect();
        const isAboveViewport = elementRect.top < header.bottom;
        const isBelowViewport = elementRect.bottom > height;
        const scrollY = containerRef?.current?.scrollTop ?? window.scrollY;

        if (isAboveViewport || isBelowViewport) {
          const headerTopOffset = headerHeight;
          const scrollPosition =
            scrollY + elementRect.top - header.height - headerTopOffset;
          container.scrollTo({
            top: scrollPosition,
            behavior: "smooth",
          });
        }
      }
    },
    [containerRef, headerHeight],
  );

  const activeEvalMessageIndices = useMemo(() => {
    if (!activeEvalResultId || !call.evalResults || !call.latencyBlocks)
      return new Set<number>();

    const activeEval = call.evalResults.find(
      (evalResult) => evalResult.id === activeEvalResultId,
    );
    const activeLatencyBlock = call.latencyBlocks.find(
      (block) => block.id === activeEvalResultId,
    );
    if (!activeEval && !activeLatencyBlock) return new Set<number>();

    const overlappingIndices = new Set<number>();
    messagesFiltered.forEach((message, index) => {
      if (
        activeEval &&
        activeEval.secondsFromStart &&
        activeEval.duration &&
        activeEval.secondsFromStart <
          (messagesFiltered[index + 1]?.secondsFromStart ?? Infinity) &&
        activeEval.secondsFromStart + activeEval.duration >
          message.secondsFromStart
      ) {
        overlappingIndices.add(index);
      }
      const latencyBlock = messageToLatencyMap[message.id];
      if (latencyBlock && latencyBlock.id === activeEvalResultId) {
        overlappingIndices.add(index);
      }
    });

    return overlappingIndices;
  }, [
    activeEvalResultId,
    call.evalResults,
    call.latencyBlocks,
    messageToLatencyMap,
    messagesFiltered,
  ]);

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
      if (!evalResult.secondsFromStart || !evalResult.duration) return false;
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
          return "border-muted-foreground/50";
      }
    },
    [],
  );

  const timeToEvalResultMap = useMemo(() => {
    return call.evalResults?.reduce(
      (acc, evalResult) => {
        if (!evalResult.secondsFromStart) return acc;
        acc[evalResult.secondsFromStart] = evalResult;
        return acc;
      },
      {} as Record<number, EvalResultWithIncludes>,
    );
  }, [call.evalResults]);

  return (
    <div className="flex w-full flex-col rounded-md bg-background px-4 outline-none">
      <div
        ref={headerRef}
        className="sticky bg-background py-4"
        style={{
          top: includeHeaderTop ? `${headerHeight}px` : "0px",
        }}
      >
        {type === "test" ? (
          <TestCallHeader
            call={call}
            agentId={agentId}
            avatarUrl={avatarUrl}
            audioPlayerRef={audioPlayerRef}
            activeEvalResultId={activeEvalResultId}
            setActiveEvalResultId={setActiveEvalResultId}
          />
        ) : (
          <LatencyCallHeader
            call={call}
            avatarUrl={avatarUrl}
            audioPlayerRef={audioPlayerRef}
            activeEvalResultId={activeEvalResultId}
            setActiveEvalResultId={setActiveEvalResultId}
          />
        )}
        {call.status === CallStatus.completed && (
          <AudioPlayer
            ref={audioPlayerRef}
            call={call}
            offsetFromStart={offsetFromStart}
            onEvalResultHover={(evalId) => {
              setActiveEvalResultId(evalId);
            }}
            onTimeUpdate={setCurrentTime}
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
                  {message.role === Role.tool_call_result &&
                  message.name !== "endCall" &&
                  timeToEvalResultMap ? (
                    <ToolCallResult
                      message={message}
                      timeToEvalResultMap={timeToEvalResultMap}
                    />
                  ) : (
                    <>
                      <div className="mb-1 text-xs font-medium">
                        {message.role === Role.bot
                          ? botName // call.testAgent?.name
                          : message.role === Role.user
                            ? userName
                            : ""}
                      </div>
                      {messageToLatencyMap[message.id] && (
                        <div
                          className="mb-1 w-fit rounded-md p-1 text-xs font-medium"
                          style={{
                            background:
                              activeEvalResultId ===
                              messageToLatencyMap[message.id]!.id
                                ? getLatencyBlockColor(
                                    messageToLatencyMap[message.id]!,
                                    0.5,
                                  )
                                : getLatencyBlockColor(
                                    messageToLatencyMap[message.id]!,
                                  ),
                            border: `1px solid ${getLatencyBlockColor(
                              messageToLatencyMap[message.id]!,
                              1,
                            )}`,
                            color: getLatencyBlockColor(
                              messageToLatencyMap[message.id]!,
                              1,
                            ),
                          }}
                        >
                          {Math.round(
                            messageToLatencyMap[message.id]!.duration * 1000,
                          )}
                          ms - time to agent response
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">
                        {message.message}
                      </div>
                    </>
                  )}
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
                          activeEvalResultId === evalResult.id &&
                            (evalResult.success
                              ? "bg-green-500/30"
                              : "bg-red-500/30"),
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

function ToolCallResult({
  message,
  timeToEvalResultMap,
}: {
  message: Message;
  timeToEvalResultMap: Record<number, EvalResultWithIncludes>;
}) {
  const evalResult = useMemo(() => {
    return timeToEvalResultMap[message.secondsFromStart];
  }, [message.secondsFromStart, timeToEvalResultMap]);

  const status = useMemo(() => {
    if (!evalResult) return "unknown";
    return evalResult.success ? "success" : "failure";
  }, [evalResult]);

  const parsedJson = useMemo(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return JSON.parse(message.result) as Record<string, never>;
    } catch {
      return null;
    }
  }, [message.result]);

  const formattedJson = useMemo(() => {
    try {
      return JSON.stringify(parsedJson, null, 2);
    } catch {
      return message.result;
    }
  }, [message.result, parsedJson]);

  const toolType = useMemo(() => {
    return parsedJson?.type ?? "tool call";
  }, [parsedJson]);

  const toolDetails = useMemo(() => {
    if (!parsedJson) return "";

    if (parsedJson.type === "CHECK_STATE_EVENT") {
      const json = parsedJson as unknown as {
        type: string;
        items: { name: string; totalPrice: string }[];
      };
      return json.items
        ?.map((item) => `${item.name} (${item.totalPrice})`)
        .join(", ");
    }
    return "";
  }, [parsedJson]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={cn(
            "flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-muted/50",
            status === "failure" &&
              "border-red-500 bg-red-500/20 hover:bg-red-500/30",
          )}
        >
          <div className="flex items-center gap-2 text-sm italic text-muted-foreground">
            <WrenchIcon className="size-4 shrink-0" />
            <div>
              {toolType}: {toolDetails}
            </div>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                {status === "success" ? (
                  <CheckCircleIcon className="size-5 shrink-0 text-green-500" />
                ) : status === "failure" ? (
                  <XCircleIcon className="size-5 shrink-0 text-red-500" />
                ) : null}
              </div>
            </TooltipTrigger>
            <TooltipContent>{evalResult?.details}</TooltipContent>
          </Tooltip>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>tool call details</DialogTitle>
        </DialogHeader>
        <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-md bg-muted p-4 font-mono text-xs">
          <code>{formattedJson}</code>
        </pre>
      </DialogContent>
    </Dialog>
  );
}
