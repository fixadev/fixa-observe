import type { Call } from "~/lib/types";
import AudioPlayer, { type AudioPlayerRef } from "./AudioPlayer";
import { useMemo, useRef } from "react";

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

      <div className="mt-4 space-y-4">
        {call.originalMessages.map((message, index) => {
          if (message.role === "system") return null;
          return (
            <div
              key={index}
              onClick={() => {
                audioPlayerRef.current?.seekToTime(
                  message.secondsFromStart - offsetFromStart,
                );
              }}
              className="cursor-pointer rounded-lg bg-gray-50 p-4 hover:bg-muted"
            >
              <div className="font-medium text-gray-700">
                {message.role === "bot" ? "Assistant" : "User"}
              </div>
              <div className="mt-1 text-gray-600">{message.message}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
