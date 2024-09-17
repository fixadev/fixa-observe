import { useEffect, useRef, useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import ExpandTransition from "~/components/ExpandTransition";
import Hls from "hls.js";
import { isIOS } from "../lib/platform";
import { HLS_TIMEOUT } from "~/lib/constants";
export function VideoPlayer({
  hls_playlist_url,
  className,
  scrollToBottom,
}: {
  hls_playlist_url: string | null;
  className?: string;
  scrollToBottom: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const startTime = useRef(new Date().getTime());
  const [downloadLink, setDownloadLink] = useState<string | null>(null);

  useEffect(() => {
    if (!hls_playlist_url) {
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
        videoRef.current!.addEventListener("ended", () => {
          console.log("video ended");
          const videoUrl = hls_playlist_url?.replace(
            "playlist.m3u8",
            "video.mp4",
          );
          setDownloadLink(videoUrl);
          scrollToBottom();
        });
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
      videoRef.current.addEventListener("ended", () => {
        console.log("video ended");
        const videoUrl = hls_playlist_url?.replace(
          "playlist.m3u8",
          "video.mp4",
        );
        setDownloadLink(videoUrl);
        scrollToBottom();
      });
    }
  }, [hls_playlist_url, scrollToBottom]);

  // i know -- this seems ridiculous, but https://stackoverflow.com/questions/50694881/how-to-download-file-in-react-js
  const handleDownloadVideo = async (url: string) => {
    if (!url) return;
    try {
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/mp4",
        },
      })
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `video.mp4`);
          document.body.appendChild(link);
          link.click();
          link.parentNode?.removeChild(link);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={className}>
      {isIOS() ? (
        <video
          src={hls_playlist_url ?? ""}
          autoPlay
          controls
          className="w-full"
        />
      ) : (
        <video ref={videoRef} className="w-full" controls />
      )}
      {downloadLink && (
        <ExpandTransition>
          <div className="mt-2 flex items-center justify-end gap-2 text-gray-400 hover:cursor-pointer hover:text-gray-100">
            <ArrowDownTrayIcon className="size-4" />
            <button
              className="text-sm hover:underline"
              onClick={() => handleDownloadVideo(downloadLink)}
            >
              download video
            </button>
          </div>
        </ExpandTransition>
      )}
    </div>
  );
}
