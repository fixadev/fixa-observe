import type { Call, CallError } from "~/lib/types";
import AudioPlayer, { type AudioPlayerRef } from "./AudioPlayer";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { cn, formatDurationHoursMinutesSeconds } from "~/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { ERROR_LABELS } from "~/lib/constants";

export default function CallDetails({ call }: { call: Call }) {
  const audioPlayerRef = useRef<AudioPlayerRef>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastActiveIndexRef = useRef(-1);
  const [activeErrorId, setActiveErrorId] = useState<string | null>(null);

  const messagesFiltered = useMemo(() => {
    return call.originalMessages.filter((m) => m.role !== "system");
  }, [call.originalMessages]);

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

  const activeErrorMessageIndex = useMemo(() => {
    return call.errors?.find((error) => error.id === activeErrorId)?.details
      ?.messageIndex;
  }, [call.errors, activeErrorId]);

  // Scroll to the active error message if it has changed
  useEffect(() => {
    if (activeErrorMessageIndex) {
      scrollMessageIntoView(activeErrorMessageIndex);
    }
  }, [activeErrorMessageIndex, scrollMessageIntoView]);

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

  const getMessageErrors = useCallback(
    (messageIndex: number) => {
      return call.errors?.filter(
        (error) =>
          error.type === "transcription" &&
          error.details?.messageIndex === messageIndex,
      );
    },
    [call.errors],
  );

  return (
    <div className="flex w-full flex-col overflow-hidden px-4 pt-4">
      <AudioPlayer
        ref={audioPlayerRef}
        call={call}
        onTimeChange={(timeInSeconds) => {
          setCurrentTime(timeInSeconds);
        }}
        onErrorHover={(errorId) => {
          setActiveErrorId(errorId);
        }}
      />

      <div
        ref={scrollContainerRef}
        className="-mx-4 mt-4 flex flex-1 flex-col overflow-y-auto px-4"
      >
        {messagesFiltered.map((message, index) => {
          const errors = getMessageErrors(index);
          const words = message.message.split(" ");

          return (
            <div key={index} className="flex gap-2">
              <div className="mt-2 w-8 shrink-0 text-xs text-muted-foreground">
                {formatDurationHoursMinutesSeconds(
                  message.secondsFromStart - offsetFromStart,
                )}
              </div>
              <div
                onClick={() => {
                  audioPlayerRef.current?.seekToTime(
                    message.secondsFromStart - offsetFromStart,
                  );
                  audioPlayerRef.current?.play();
                }}
                className={cn(
                  "flex-1 cursor-pointer rounded-md p-2 hover:bg-muted/30",
                  activeMessageIndex === index ? "bg-muted hover:bg-muted" : "",
                )}
              >
                <div className="text-xs font-medium">
                  {message.role === "bot" ? "assistant" : "user"}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {(() => {
                    let currentGroup: string[] = [];
                    const result: JSX.Element[] = [];
                    let currentHasError = false;
                    let currentError: CallError | undefined;

                    words.forEach((word, wordIndex) => {
                      const newErrorIndex =
                        errors?.findIndex(
                          (error) =>
                            error.type === "transcription" &&
                            error.details?.wordIndexRange?.[0] !== undefined &&
                            error.details?.wordIndexRange?.[1] !== undefined &&
                            wordIndex >= error.details.wordIndexRange[0] &&
                            wordIndex < error.details.wordIndexRange[1],
                        ) ?? -1;
                      const newError =
                        newErrorIndex !== -1
                          ? (errors?.[newErrorIndex] ?? undefined)
                          : undefined;

                      if (Boolean(newError) !== currentHasError) {
                        // Flush current group
                        if (currentGroup.length > 0) {
                          const error = currentError;
                          result.push(
                            <ErrorWord
                              key={result.length}
                              words={currentGroup.join(" ")}
                              error={error}
                              activeErrorId={activeErrorId}
                              onClick={() => {
                                audioPlayerRef.current?.setActiveError(
                                  error ?? null,
                                );
                                console.log("ERROR: ", error);
                                audioPlayerRef.current?.play();
                              }}
                            />,
                          );
                          currentGroup = [];
                        }
                        currentHasError = Boolean(newError);
                        currentError = newError;
                      }

                      currentGroup.push(word);
                    });

                    // Flush final group
                    if (currentGroup.length > 0) {
                      const error = currentError;
                      result.push(
                        <ErrorWord
                          key={result.length}
                          words={currentGroup.join(" ")}
                          error={error}
                          activeErrorId={activeErrorId}
                          onClick={() => {
                            audioPlayerRef.current?.setActiveError(
                              error ?? null,
                            );
                            audioPlayerRef.current?.play();
                          }}
                        />,
                      );
                    }

                    return result;
                  })()}
                </div>
              </div>
            </div>
          );
        })}
        <div className="h-10 shrink-0" />
      </div>
    </div>
  );
}

function ErrorWord({
  words,
  error,
  activeErrorId,
  onClick,
}: {
  words: string;
  error?: CallError;
  activeErrorId: string | null;
  onClick?: () => void;
}) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  if (!error) {
    return <span>{words} </span>;
  }

  return (
    <Tooltip open={error.id === activeErrorId || isTooltipOpen}>
      <TooltipTrigger
        asChild
        disabled
        onClick={(e) => {
          if (error.details?.type === "deletion") return;
          e.stopPropagation();
          onClick?.();
        }}
      >
        <span>
          {error.details?.type === "addition" && <span>{words}</span>}{" "}
          <span
            onMouseEnter={() => setIsTooltipOpen(true)}
            onMouseLeave={() => setIsTooltipOpen(false)}
            className={cn(
              "inline-block self-end bg-red-500/10 text-red-500 underline decoration-red-500 decoration-solid decoration-2 underline-offset-4 hover:bg-red-500/20",
              error.details?.type === "addition" && "text-transparent",
              error.details?.type === "deletion" && "hover:line-through",
            )}
          >
            {error.details?.type === "addition"
              ? error.details?.correctWord
              : words}
          </span>{" "}
        </span>
      </TooltipTrigger>
      <TooltipContent asChild side="right">
        <div className="flex flex-col gap-1 rounded-md border border-input bg-white p-2 text-foreground">
          <div className="text-xs font-medium text-muted-foreground">
            {ERROR_LABELS[error.type]}
          </div>
          <div className="text-sm text-foreground">
            {error.details?.type === "deletion" ? (
              <span className="italic">deleted</span>
            ) : (
              error.details?.correctWord
            )}
          </div>
          <div
            className="text-xs"
            style={{
              color: `rgb(${Math.round(255 * error.confidence)}, ${Math.round(75 * (1 - error.confidence))}, ${Math.round(75 * (1 - error.confidence))})`,
            }}
          >
            {(error.confidence * 100).toFixed(0)}% likely
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
