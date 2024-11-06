import type { Call } from "~/lib/types";
import AudioPlayer, { type AudioPlayerRef } from "./AudioPlayer";
import { useMemo, useRef, useState, useEffect } from "react";
import { cn, formatDurationHoursMinutesSeconds } from "~/lib/utils";

export default function CallDetails({ call }: { call: Call }) {
  const audioPlayerRef = useRef<AudioPlayerRef>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastActiveIndexRef = useRef(-1);

  const offsetFromStart = useMemo(() => {
    return (
      call.originalMessages.find((m) => m.role !== "system")
        ?.secondsFromStart ?? 0
    );
  }, [call.originalMessages]);

  const activeMessageIndex = useMemo(() => {
    return call.originalMessages.findIndex((message, index) => {
      if (message.role === "system") return false;
      const messageStart = message.secondsFromStart - offsetFromStart;
      const nextMessage = call.originalMessages[index + 1];
      const nextMessageStart = nextMessage?.secondsFromStart
        ? nextMessage.secondsFromStart - offsetFromStart
        : Infinity;

      return currentTime >= messageStart && currentTime < nextMessageStart;
    });
  }, [currentTime, call.originalMessages, offsetFromStart]);

  useEffect(() => {
    if (
      activeMessageIndex !== -1 &&
      activeMessageIndex !== lastActiveIndexRef.current &&
      scrollContainerRef.current
    ) {
      const messageElements = scrollContainerRef.current.children;
      const activeElement = messageElements[activeMessageIndex];
      console.log(activeElement);

      if (activeElement) {
        const container = scrollContainerRef.current;
        const containerBottom = container.offsetTop + container.clientHeight;
        const elementBottom = activeElement.getBoundingClientRect().bottom;

        // Only scroll if the element is below the visible area
        if (elementBottom > containerBottom) {
          activeElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }

      lastActiveIndexRef.current = activeMessageIndex;
    }
  }, [activeMessageIndex]);

  return (
    <div className="flex w-full flex-col overflow-hidden px-4 pt-4">
      <AudioPlayer
        ref={audioPlayerRef}
        call={call}
        onTimeChange={(timeInSeconds) => {
          setCurrentTime(timeInSeconds);
        }}
      />

      <div
        ref={scrollContainerRef}
        className="-mx-4 mt-4 flex flex-1 flex-col overflow-y-auto px-4"
      >
        {call.originalMessages.map((message, index) => {
          if (message.role === "system") return null;
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
                  (() => {
                    // Determine if the current time is within the current message
                    const currentMessageStart =
                      message.secondsFromStart - offsetFromStart;
                    const nextMessage = call.originalMessages[index + 1];
                    const nextMessageStart = nextMessage?.secondsFromStart
                      ? nextMessage.secondsFromStart - offsetFromStart
                      : Infinity;
                    return currentTime >= currentMessageStart &&
                      currentTime < nextMessageStart
                      ? "bg-muted hover:bg-muted"
                      : "";
                  })(),
                )}
              >
                <div className="text-xs font-medium">
                  {message.role === "bot" ? "assistant" : "user"}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {message.message}
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
