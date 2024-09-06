import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import Hls from "hls.js";

export function VideoPlayer({
  socket,
  className,
}: {
  socket: Socket;
  className: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    if (Hls.isSupported()) {
      hlsRef.current = new Hls();
      //   console.log("loading source");
      //   hlsRef.current.loadSource("http://localhost:8000/hls/playlist.m3u8");
      //   console.log("attaching media");

      socket.on("hls_ready", (playlistUrl: string) => {
        if (videoRef.current && hlsRef.current) {
          hlsRef.current.loadSource("http://localhost:8000" + playlistUrl);
          hlsRef.current.attachMedia(videoRef.current);
          hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
            void videoRef.current?.play();
          });
        }
      });
    } else if (videoRef.current?.canPlayType("application/vnd.apple.mpegurl")) {
      // For browsers that natively support HLS (like Safari)
      socket.on("hls_ready", (playlistUrl) => {
        if (videoRef.current) {
          videoRef.current.src = "http://localhost:8000" + playlistUrl;
          void videoRef.current.play();
        }
      });
    }

    return () => {
      socket.off("hls_ready");
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [socket]);

  return <video ref={videoRef} controls className={className} />;
}
