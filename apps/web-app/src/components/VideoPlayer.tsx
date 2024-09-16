import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { isIOS } from "../lib/platform";
import { HLS_TIMEOUT } from "~/lib/constants";
export function VideoPlayer({
  hls_playlist_url,
  className,
}: {
  hls_playlist_url: string | null;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const startTime = useRef(new Date().getTime());

  useEffect(() => {
    // console.log("[VideoPlayer] useEffect triggered");
    // console.log("[VideoPlayer] hls_playlist_url:", hls_playlist_url);
    if (!hls_playlist_url) {
      // console.log(
      //   "[VideoPlayer] No hls_playlist_url provided, exiting useEffect",
      // );
      return;
    }

    startTime.current = new Date().getTime();

    if (Hls.isSupported()) {
      const hls = new Hls();
      // hls.on(Hls.Events.MEDIA_ATTACHED, function () {
      //   console.log("video and hls.js are now bound together !");
      // });
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        // console.log(
        //   "manifest loaded, found " + data.levels.length + " quality level",
        // );
        void videoRef.current!.play();
      });
      hls.on(Hls.Events.ERROR, function (event, data) {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.MEDIA_ERROR:
              // console.log(
              //   "fatal media error encountered, try to recover",
              //   data,
              // );
              hls.recoverMediaError();
              break;
            case Hls.ErrorTypes.NETWORK_ERROR:
              // console.error("fatal network error encountered", data);

              // All retries and media options have been exhausted.
              // Immediately trying to restart loading could cause loop loading.
              // Consider modifying loading policies to best fit your asset and network
              // conditions (manifestLoadPolicy, playlistLoadPolicy, fragLoadPolicy).
              // Implement a retry mechanism with a 100ms timeout
              if (new Date().getTime() - startTime.current < HLS_TIMEOUT) {
                setTimeout(() => {
                  // console.log("Retrying to load the source after network error");
                  hls.loadSource(hls_playlist_url);
                }, 100);
              } else {
                hls.destroy();
              }
              break;
            default:
              // cannot recover
              hls.destroy();
              break;
          }
        }
      });

      // console.log("LOADING ", hls_playlist_url);
      hls.loadSource(hls_playlist_url);
      hls.attachMedia(videoRef.current!);
    } else if (videoRef.current?.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = hls_playlist_url;
      void videoRef.current.play();
    }
  }, [hls_playlist_url]);

  // console.log("[VideoPlayer] Rendering video element");
  return isIOS() ? (
    <video
      src={hls_playlist_url ?? ""}
      autoPlay
      controls
      className={className}
    />
  ) : (
    <video ref={videoRef} controls className={className} />
  );
}
