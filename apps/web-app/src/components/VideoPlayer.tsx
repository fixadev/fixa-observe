import { useEffect, useRef } from "react";
import Hls from "hls.js";

export function VideoPlayer({
  hls_playlist_url,
  className,
}: {
  hls_playlist_url: string | null;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    console.log("[VideoPlayer] useEffect triggered");
    console.log("[VideoPlayer] hls_playlist_url:", hls_playlist_url);
    if (!hls_playlist_url) {
      console.log(
        "[VideoPlayer] No hls_playlist_url provided, exiting useEffect",
      );
      return;
    }

    const initializeHLS = (playlistUrl: string) => {
      console.log("[VideoPlayer] Initializing HLS with URL:", playlistUrl);
      if (Hls.isSupported()) {
        console.log("[VideoPlayer] HLS is supported");
        if (!hlsRef.current) {
          console.log("[VideoPlayer] Creating new Hls instance");
          hlsRef.current = new Hls();
        }
        if (videoRef.current && hlsRef.current) {
          console.log("[VideoPlayer] Loading source and attaching media");
          hlsRef.current.loadSource(playlistUrl);
          console.log("[VideoPlayer] Attaching media");
          hlsRef.current.attachMedia(videoRef.current);
          console.log("[VideoPlayer] Adding HLS event listener");
          hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log(
              "[VideoPlayer] HLS manifest parsed - attempting to play video",
            );
            void videoRef.current.play();
            // .then(() => {
            //   console.log(
            //     "[VideoPlayer] Video playback started successfully",
            //   );
            // })
            // .catch((error) => {
            //   console.error(
            //     "[VideoPlayer] Error starting video playback:",
            //     error,
            //   );
            // });
          });
          hlsRef.current.on(Hls.Events.ERROR, (event, data) => {
            console.error("[VideoPlayer] HLS error", event, data);
            if (data.fatal) {
              console.log(
                "[VideoPlayer] Fatal error occurred, stopping playback",
              );
              if (videoRef.current) {
                videoRef.current.pause();
                console.log("[VideoPlayer] Video paused");
              }
              if (hlsRef.current) {
                hlsRef.current.stopLoad();
                hlsRef.current.destroy();
                console.log("[VideoPlayer] HLS instance destroyed");
              }
            }
          });
        } else {
          console.log("[VideoPlayer] Video ref or hls ref is null");
        }
      } else if (
        videoRef.current?.canPlayType("application/vnd.apple.mpegurl")
      ) {
        console.log(
          "[VideoPlayer] HLS not supported, but native playback is possible",
        );
        if (videoRef.current) {
          console.log(
            "[VideoPlayer] Setting video source and attempting to play",
          );
          videoRef.current.src = playlistUrl;
          void videoRef.current.play();
          // videoRef.current
          //   .play()
          //   .then(() => {
          //     console.log(
          //       "[VideoPlayer] Native video playback started successfully",
          //     );
          //   })
          //   .catch((error) => {
          //     console.error(
          //       "[VideoPlayer] Error starting native video playback:",
          //       error,
          //     );
          //   });
        }
      } else {
        console.error(
          "[VideoPlayer] HLS is not supported and native playback is not possible",
        );
      }
    };

    console.log("[VideoPlayer] Calling initializeHLS");
    initializeHLS(hls_playlist_url);

    return () => {
      console.log("[VideoPlayer] Cleanup function called");
      if (hlsRef.current) {
        console.log("[VideoPlayer] Destroying HLS instance");
        hlsRef.current.destroy();
      }
    };
  }, [hls_playlist_url]);

  console.log("[VideoPlayer] Rendering video element");
  return <video ref={videoRef} controls className={className} />;
}
