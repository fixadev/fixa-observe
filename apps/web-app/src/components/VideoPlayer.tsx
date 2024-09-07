import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { useToast } from "~/hooks/use-toast";

export function VideoPlayer({
  socket,
  className,
}: {
  socket: WebSocket;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const { toast } = useToast();

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
          hlsRef.current.on(Hls.Events.ERROR, (event, data) => {
            console.error("HLS error", event, data);
            // Stop reading from HLS stream on HLS fatal error
            if (data.fatal) {
              if (videoRef.current) {
                videoRef.current.pause();
              }
              if (hlsRef.current) {
                hlsRef.current.stopLoad();
                hlsRef.current.destroy();
              }
            }
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
          console.error("Error creating video");
          // TODO: display error toast
          toast({
            title: "Error creating video.",
            description:
              "There was a problem with your request. Please try again.",
          });
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
