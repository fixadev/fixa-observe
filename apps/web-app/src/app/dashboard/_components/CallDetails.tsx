import type { Call } from "~/lib/types";
import AudioPlayer, { type AudioPlayerRef } from "./AudioPlayer";
import { useMemo, useRef } from "react";
import { formatDurationHoursMinutesSeconds } from "~/lib/utils";

export default function CallDetails({ call }: { call: Call }) {
  const audioPlayerRef = useRef<AudioPlayerRef>(null);

  const offsetFromStart = useMemo(() => {
    return (
      call.originalMessages.find((m) => m.role !== "system")
        ?.secondsFromStart ?? 0
    );
  }, [call.originalMessages]);

  return (
    <div className="w-full p-4">
      <AudioPlayer ref={audioPlayerRef} call={call} />

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
                className="flex-1 cursor-pointer rounded-md p-2 hover:bg-muted"
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
