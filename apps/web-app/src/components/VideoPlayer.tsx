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

  useEffect(() => {
    // console.log("[VideoPlayer] useEffect triggered");
    // console.log("[VideoPlayer] hls_playlist_url:", hls_playlist_url);
    if (!hls_playlist_url) {
      // console.log(
      //   "[VideoPlayer] No hls_playlist_url provided, exiting useEffect",
      // );
      return;
    }

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
              console.log(
                "fatal media error encountered, try to recover",
                data,
              );
              hls.recoverMediaError();
              break;
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error("fatal network error encountered", data);
              // All retries and media options have been exhausted.
              // Immediately trying to restart loading could cause loop loading.
              // Consider modifying loading policies to best fit your asset and network
              // conditions (manifestLoadPolicy, playlistLoadPolicy, fragLoadPolicy).
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
    }
  }, [hls_playlist_url]);

  // console.log("[VideoPlayer] Rendering video element");
  return <video ref={videoRef} controls className={className} />;
}
