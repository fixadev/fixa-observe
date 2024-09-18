import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import ExpandTransition from "~/components/ExpandTransition";
import Hls from "hls.js";
import { isIOS, isSafari } from "../lib/platform";
import { HLS_TIMEOUT } from "~/lib/constants";

export function VideoPlayer({
  prompt,
  hls_playlist_url: hlsPlaylistUrl,
  className,
  scrollToBottom,
}: {
  prompt?: string | null;
  hls_playlist_url: string | null;
  className?: string;
  scrollToBottom?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const startTime = useRef(new Date().getTime());
  const [downloadLink, setDownloadLink] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const loadVideo = useCallback(() => {
    if (!hlsPlaylistUrl) {
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(hlsPlaylistUrl);
      hls.attachMedia(videoRef.current!);

      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        void videoRef.current!.play();
        videoRef.current!.addEventListener("ended", () => {
          // console.log("ENDED VIDEO");
          const videoUrl = hlsPlaylistUrl?.replace(
            "playlist.m3u8",
            "video.mp4",
          );
          setDownloadLink(videoUrl);
          scrollToBottom?.();
        });
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
              hls.destroy();
              break;
            default:
              // cannot recover
              hls.destroy();
              break;
          }
        }
      });
    } else if (videoRef.current?.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = hlsPlaylistUrl;
      void videoRef.current.play();
      videoRef.current.addEventListener("ended", () => {
        // console.log("ENDED VIDEO");
        const videoUrl = hlsPlaylistUrl?.replace("playlist.m3u8", "video.mp4");
        setDownloadLink(videoUrl);
        scrollToBottom?.();
      });
    }
  }, [hlsPlaylistUrl, scrollToBottom]);

  const checkIfPlaylistExists = useCallback(async () => {
    if (!hlsPlaylistUrl) {
      return;
    }

    setIsLoading(true);

    const exists = await fetch(hlsPlaylistUrl)
      .then((response) => response.ok)
      .catch(() => false);

    if (!exists) {
      if (new Date().getTime() - startTime.current < HLS_TIMEOUT) {
        setTimeout(() => void checkIfPlaylistExists(), 100);
      }
    } else {
      setIsLoading(false);
      loadVideo();
    }
  }, [hlsPlaylistUrl, loadVideo]);

  useEffect(() => {
    startTime.current = new Date().getTime();
    void checkIfPlaylistExists();
  }, [checkIfPlaylistExists]);

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
          const cleanedPrompt = prompt?.replace(/\s+/g, "-").toLowerCase();
          link.setAttribute("download", `pixa-video-${cleanedPrompt}.mp4`);
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
      {isIOS() || isSafari() ? (
        <video
          src={isLoading ? "" : (hlsPlaylistUrl ?? "")}
          autoPlay
          controls
          className={className}
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
