import { useEffect, useRef } from "react";
import { Socket as SocketIOSocket } from "socket.io-client";
import Hls from "hls.js";

type SocketType = SocketIOSocket | WebSocket;

export function VideoPlayer({
  socket,
  className,
  isSocketIO,
}: {
  socket: SocketType;
  className: string;
  isSocketIO: boolean;
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

    if (isSocketIO) {
      (socket as SocketIOSocket).on("hls_ready", handleHLSReady);
    } else {
      (socket as WebSocket).addEventListener("message", (event) => {
        console.log("message", event);
        const data = JSON.parse(event.data);
        if (data.type === "hls_ready") {
          console.log("HLS ready", data.playlistUrl);
          handleHLSReady(data.playlistUrl);
        } else {
          console.error("Unknown message type", data);
        }
      });
    }

    return () => {
      if (isSocketIO) {
        (socket as SocketIOSocket).off("hls_ready");
      } else {
        (socket as WebSocket).removeEventListener("message", handleHLSReady);
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [socket, isSocketIO]);

  return <video ref={videoRef} controls className={className} />;
}
