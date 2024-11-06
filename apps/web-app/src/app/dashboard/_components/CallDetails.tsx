import type { Call } from "~/lib/types";
import AudioPlayer, { type AudioPlayerRef } from "./AudioPlayer";
import { useMemo, useRef, useState } from "react";
import { cn, formatDurationHoursMinutesSeconds } from "~/lib/utils";

export default function CallDetails({ call }: { call: Call }) {
  const audioPlayerRef = useRef<AudioPlayerRef>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const offsetFromStart = useMemo(() => {
    return (
      call.originalMessages.find((m) => m.role !== "system")
        ?.secondsFromStart ?? 0
    );
  }, [call.originalMessages]);

  return (
    <div className="w-full p-4">
      <AudioPlayer
        ref={audioPlayerRef}
        call={call}
        onTimeChange={(timeInSeconds) => {
          setCurrentTime(timeInSeconds);
        }}
      />

      <div className="mt-4">
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
                      ? "bg-muted"
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
      </div>
    </div>
  );
}
