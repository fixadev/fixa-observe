import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

export function VideoPlayer({
  socket,
  className,
}: {
  socket: Socket;
  className: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaSourceRef = useRef<MediaSource | null>(null);
  const sourceBufferRef = useRef<SourceBuffer | null>(null);

  useEffect(() => {
    if ("MediaSource" in window) {
      mediaSourceRef.current = new MediaSource();
      videoRef.current!.src = URL.createObjectURL(mediaSourceRef.current);

      mediaSourceRef.current.addEventListener("sourceopen", () => {
        sourceBufferRef.current = mediaSourceRef.current!.addSourceBuffer(
          'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
        );

        socket.on("video_data", (chunk) => {
          if (sourceBufferRef.current && !sourceBufferRef.current.updating) {
            console.log("appending buffer", chunk);
            sourceBufferRef.current.appendBuffer(new Uint8Array(chunk));
          }
        });

        socket.on("scene_progress", (progress) => {
          if (progress === "EOF" && mediaSourceRef.current) {
            mediaSourceRef.current.endOfStream();
          }
        });
      });
    }

    return () => {
      socket.off("video_data");
      socket.off("scene_progress");
    };
  }, [socket]);

  return <video ref={videoRef} controls className={className} />;
}
