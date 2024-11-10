import type { CallWithIncludes } from "~/lib/types";
import AudioPlayer, { type AudioPlayerRef } from "./AudioPlayer";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { cn, formatDurationHoursMinutesSeconds } from "~/lib/utils";
import { useAudio } from "~/hooks/useAudio";
import { type CallError } from "prisma/generated/zod";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

export default function CallDetails({ call }: { call: CallWithIncludes }) {
  const audioPlayerRef = useRef<AudioPlayerRef>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastActiveIndexRef = useRef(-1);
  const [activeErrorId, setActiveErrorId] = useState<string | null>(null);
  const { play, seek, currentTime } = useAudio();

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
    if (!scrollContainerRef.current) return;
    const messageElements = scrollContainerRef.current.children;
    const activeElement = messageElements[messageIndex];

    if (activeElement) {
      const container = scrollContainerRef.current;
      const containerBottom = container.offsetTop + container.clientHeight;
      const { bottom: elementBottom, top: elementTop } =
        activeElement.getBoundingClientRect();
      // Only scroll if the element is below the visible area
      if (elementBottom > containerBottom || elementTop < container.offsetTop) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, []);

  // const activeErrorMessageIndex = useMemo(() => {
  //   return call.errors?.find((error) => error.id === activeErrorId)?.details
  //     ?.messageIndex;
  // }, [call.errors, activeErrorId]);

  // Scroll to the active error message if it has changed
  // useEffect(() => {
  //   if (activeErrorMessageIndex) {
  //     scrollMessageIntoView(activeErrorMessageIndex);
  //   }
  // }, [activeErrorMessageIndex, scrollMessageIntoView]);

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
        messageErrorsMap: new Map<number, CallError>(),
        errorRangesMap: new Map<
          string,
          { firstMessageIndex: number; lastMessageIndex: number }
        >(),
      };
    }

    const messageMap = new Map<number, CallError>();
    const rangesMap = new Map<
      string,
      { firstMessageIndex: number; lastMessageIndex: number }
    >();

    // First collect all message -> errors mappings
    messagesFiltered.forEach((_, messageIndex) => {
      const overlappingErrors = call.errors.find((error) =>
        doesErrorOverlapMessage(error, messageIndex),
      );
      if (overlappingErrors) {
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
    <div className="flex w-full flex-col overflow-hidden bg-background px-4 pt-4 outline-none">
      <AudioPlayer
        ref={audioPlayerRef}
        call={call}
        offsetFromStart={offsetFromStart}
        onErrorHover={(errorId) => {
          setActiveErrorId(errorId);
        }}
      />

      <div
        ref={scrollContainerRef}
        className="-mx-4 mt-4 flex flex-1 flex-col overflow-y-auto px-4"
      >
        {messagesFiltered.map((message, index) => {
          const error = messageErrorsMap.get(index);
          const isFirstErrorMessage = error
            ? errorRangesMap.get(error.id)?.firstMessageIndex === index
            : false;
          const isLastErrorMessage = error
            ? errorRangesMap.get(error.id)?.lastMessageIndex === index
            : false;

          return (
            <div key={index} className="flex gap-2">
              <div className="mt-2 w-8 shrink-0 text-xs text-muted-foreground">
                {formatDurationHoursMinutesSeconds(
                  message.secondsFromStart - offsetFromStart,
                )}
              </div>
              <div className="flex flex-1 flex-col">
                <div
                  onClick={() => {
                    seek(message.secondsFromStart - offsetFromStart);
                    play();
                  }}
                  className={cn(
                    "flex-1 cursor-pointer rounded-md p-2 hover:bg-muted/30",
                    activeMessageIndex === index
                      ? "bg-muted hover:bg-muted"
                      : "",
                    error ? "rounded-none border-x border-red-500" : "",
                    isFirstErrorMessage
                      ? "rounded-t-md border-t border-red-500"
                      : "",
                    isLastErrorMessage ? "border-red-500" : "",
                  )}
                >
                  <div className="text-xs font-medium">
                    {message.role === "bot" ? "assistant" : "user"}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {message.message}
                  </div>
                </div>
                {isLastErrorMessage && (
                  <div className="flex w-full items-center gap-1 rounded-b-md border-x border-b border-red-500 bg-red-500/20 p-2 text-sm text-red-500">
                    <ExclamationCircleIcon className="size-5" />
                    {error?.description}
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
