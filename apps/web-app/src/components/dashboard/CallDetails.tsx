import type { CallWithIncludes } from "~/lib/types";
import AudioPlayer, { type AudioPlayerRef } from "./AudioPlayer";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { cn, formatDurationHoursMinutesSeconds } from "~/lib/utils";
import { useAudio } from "~/hooks/useAudio";
import { type Agent, type CallError } from "prisma/generated/zod";
import {
  // CheckIcon,
  ExclamationCircleIcon,
  // WrenchIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { CallResult, CallStatus, Role } from "@prisma/client";
import Spinner from "../Spinner";

export default function CallDetails({
  call,
  agent,
  isBeingAnalyzed,
}: {
  call: CallWithIncludes;
  agent: Agent;
  isBeingAnalyzed: boolean;
}) {
  const audioPlayerRef = useRef<AudioPlayerRef>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastActiveIndexRef = useRef(-1);
  const [activeErrorId, setActiveErrorId] = useState<string | null>(null);
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
        const headerTopOffset = 41;
        const scrollPosition =
          window.scrollY + elementRect.top - header.height - headerTopOffset;
        window.scrollTo({
          top: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  }, []);

  const activeErrorMessageIndices = useMemo(() => {
    if (!activeErrorId || !call.errors) return new Set<number>();

    const activeError = call.errors.find((error) => error.id === activeErrorId);
    if (!activeError) return new Set<number>();

    const overlappingIndices = new Set<number>();
    messagesFiltered.forEach((message, index) => {
      if (
        activeError.secondsFromStart <
          (messagesFiltered[index + 1]?.secondsFromStart ?? Infinity) &&
        activeError.secondsFromStart + activeError.duration >
          message.secondsFromStart
      ) {
        overlappingIndices.add(index);
      }
    });

    return overlappingIndices;
  }, [call.errors, activeErrorId, messagesFiltered]);

  // Scroll to the active error message if it has changed
  useEffect(() => {
    if (activeErrorMessageIndices.size > 0) {
      const firstIndex = Array.from(activeErrorMessageIndices)[0];
      if (typeof firstIndex === "number") {
        scrollMessageIntoView(firstIndex);
      }
    }
  }, [activeErrorMessageIndices, scrollMessageIntoView]);

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

  const doesErrorOverlapMessage = useCallback(
    (error: CallError, messageIndex: number) => {
      return (
        error.secondsFromStart <
          (messagesFiltered[messageIndex + 1]?.secondsFromStart ?? Infinity) &&
        error.secondsFromStart + error.duration >
          (messagesFiltered[messageIndex]?.secondsFromStart ?? 0)
      );
    },
    [messagesFiltered],
  );

  const { messageErrorsMap, errorRangesMap } = useMemo(() => {
    if (!call.errors) {
      return {
        messageErrorsMap: new Map<number, CallError[]>(),
        errorRangesMap: new Map<
          string,
          { firstMessageIndex: number; lastMessageIndex: number }
        >(),
      };
    }

    const messageMap = new Map<number, CallError[]>();
    const rangesMap = new Map<
      string,
      { firstMessageIndex: number; lastMessageIndex: number }
    >();

    // First collect all message -> errors mappings
    messagesFiltered.forEach((_, messageIndex) => {
      const overlappingErrors = call.errors.filter((error) =>
        doesErrorOverlapMessage(error, messageIndex),
      );
      if (overlappingErrors.length > 0) {
        messageMap.set(messageIndex, overlappingErrors);
      }
    });

    // Then find ranges for each error
    call.errors?.forEach((error) => {
      let firstMessageIndex = Infinity;
      let lastMessageIndex = -1;

      messagesFiltered.forEach((_, messageIndex) => {
        if (doesErrorOverlapMessage(error, messageIndex)) {
          firstMessageIndex = Math.min(firstMessageIndex, messageIndex);
          lastMessageIndex = Math.max(lastMessageIndex, messageIndex);
        }
      });

      if (lastMessageIndex !== -1) {
        rangesMap.set(error.id, {
          firstMessageIndex,
          lastMessageIndex,
        });
      }
    });

    return { messageErrorsMap: messageMap, errorRangesMap: rangesMap };
  }, [call.errors, messagesFiltered, doesErrorOverlapMessage]);

  return (
    <div className="flex w-full flex-col rounded-md bg-background px-4 outline-none">
      <div
        ref={headerRef}
        className="sticky top-[calc(2.5rem+1px)] z-20 bg-background py-4"
      >
        {/* CALL ID: {call.id} */}
        <div className="flex items-center gap-4 pb-4">
          <div className="size-[48px] shrink-0">
            <Image
              src={call.testAgent.headshotUrl}
              alt="agent avatar"
              width={48 * 2}
              height={48 * 2}
              className="rounded-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium">{call.intent.name}</div>
              {call.status !== CallStatus.in_progress && (
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
            {call.status === CallStatus.in_progress && (
              <div className="-mt-1 flex items-center gap-2 text-sm italic text-muted-foreground">
                <Spinner className="size-4" />{" "}
                {isBeingAnalyzed ? "analyzing call..." : "call in progress..."}
              </div>
            )}
            <div className="flex w-fit flex-row flex-wrap gap-2">
              {call.errors?.map((error) => (
                <div
                  key={error.id}
                  className="flex cursor-pointer items-start gap-1 border-l-2 border-red-500 bg-red-100 p-1 pl-1 text-xs text-red-500 hover:bg-red-200"
                  onMouseEnter={() => {
                    setActiveErrorId(error.id);
                    audioPlayerRef.current?.setHoveredError(error.id);
                  }}
                  onMouseLeave={() => {
                    setActiveErrorId(null);
                    audioPlayerRef.current?.setHoveredError(null);
                  }}
                  onClick={() => {
                    audioPlayerRef.current?.setActiveError(error);
                    play();
                  }}
                >
                  <ExclamationCircleIcon className="size-4 shrink-0 text-red-500" />
                  {error.description}
                </div>
              ))}
            </div>
          </div>
        </div>
        {call.status !== CallStatus.in_progress && (
          <AudioPlayer
            ref={audioPlayerRef}
            call={call}
            offsetFromStart={offsetFromStart}
            onErrorHover={(errorId) => {
              setActiveErrorId(errorId);
            }}
          />
        )}
      </div>

      <div ref={scrollContainerRef} className="-mx-4 flex flex-1 flex-col px-4">
        {messagesFiltered.map((message, index) => {
          const errors = messageErrorsMap.get(index) ?? [];
          const isFirstErrorMessage = errors.some(
            (error) =>
              errorRangesMap.get(error.id)?.firstMessageIndex === index,
          );
          const isLastErrorMessage = errors.some(
            (error) => errorRangesMap.get(error.id)?.lastMessageIndex === index,
          );
          const isActiveErrorMessage = activeErrorMessageIndices.has(index);

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
                    errors.length > 0
                      ? "rounded-none border-x border-red-500"
                      : "",
                    errors.length > 0 && isActiveErrorMessage
                      ? "-mx-px border-x-2"
                      : "",
                    isFirstErrorMessage
                      ? "mt-px rounded-t-md border-t border-red-500"
                      : "",
                    isFirstErrorMessage && isActiveErrorMessage
                      ? "mt-0 border-t-2"
                      : "",
                  )}
                >
                  <div className="text-xs font-medium">
                    {message.role === Role.bot
                      ? call.testAgent.name
                      : message.role === Role.user
                        ? agent.name
                        : ""}
                  </div>
                  {/* {message.role === Role.tool_calls && (
                    <div className="flex items-center gap-1 text-xs italic text-muted-foreground">
                      <WrenchIcon className="size-4" />
                      tool called:
                      {message.toolCalls &&
                      Array.isArray(message.toolCalls) &&
                      message.toolCalls.length > 0
                        ? ` ${message.toolCalls
                            .map((toolCall) => {
                              if (
                                typeof toolCall === "object" &&
                                toolCall !== null
                              ) {
                                return (
                                  toolCall as { function?: { name?: string } }
                                )?.function?.name;
                              }
                              return "";
                            })
                            .filter(Boolean)
                            .join(", ")}`
                        : ""}
                    </div>
                  )}
                  {message.role === Role.tool_call_result && (
                    <div className="flex items-center gap-1 text-xs italic text-muted-foreground">
                      <CheckIcon className="size-4" />
                      tool finished: {message.name}
                    </div>
                  )} */}
                  <div className="mt-1 text-sm text-muted-foreground">
                    {message.message}
                  </div>
                </div>
                {isLastErrorMessage && (
                  <div
                    className={cn(
                      "flex cursor-pointer flex-col items-start rounded-b-md border-x border-b border-red-500 bg-red-500/20 px-1 py-1.5 text-sm text-red-500",
                      isActiveErrorMessage
                        ? "z-10 -mx-px -mb-px border-x-2 border-b-2 shadow-lg"
                        : "",
                    )}
                  >
                    {errors.map((error) => (
                      <div
                        key={error.id}
                        className={cn(
                          "flex w-full items-start gap-1 py-0.5",
                          errors.length > 1 && "hover:bg-red-500/20",
                        )}
                        onMouseEnter={() => {
                          setActiveErrorId(error.id);
                          audioPlayerRef.current?.setHoveredError(error.id);
                        }}
                        onMouseLeave={() => {
                          setActiveErrorId(null);
                          audioPlayerRef.current?.setHoveredError(null);
                        }}
                        onClick={() => {
                          audioPlayerRef.current?.setActiveError(error);
                          play();
                        }}
                      >
                        <ExclamationCircleIcon className="size-5 shrink-0" />
                        {error.description}
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
