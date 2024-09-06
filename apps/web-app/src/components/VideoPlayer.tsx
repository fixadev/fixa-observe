import { useEffect, useRef } from "react";
import Hls from "hls.js";

export function VideoPlayer({
  socket,
  className,
}: {
  socket: WebSocket;
  className: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const handleHLSReady = (playlistUrl: string) => {
      if (Hls.isSupported()) {
        if (!hlsRef.current) {
          hlsRef.current = new Hls();
        }
        if (videoRef.current && hlsRef.current) {
          hlsRef.current.loadSource(playlistUrl);
          hlsRef.current.attachMedia(videoRef.current);
          hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
            void videoRef.current?.play();
          });
        }
      } else if (
        videoRef.current?.canPlayType("application/vnd.apple.mpegurl")
      ) {
        // For browsers that natively support HLS (like Safari)
        if (videoRef.current) {
          videoRef.current.src = playlistUrl;
          void videoRef.current.play();
        }
      }
    };

    const handleMessage = (event: MessageEvent) => {
      console.log("message", event);
      if (typeof event.data === "string") {
        const data = JSON.parse(event.data) as {
          type: string;
          playlistUrl: string;
        };
        if (data.type === "hls_ready") {
          console.log("HLS ready", data.playlistUrl);
          handleHLSReady(data.playlistUrl);
        } else if (data.type === "error") {
          // TODO: display error toast
        } else {
          console.error("Unknown message type", data);
        }
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [socket]);

  return <video ref={videoRef} controls className={className} />;
}
