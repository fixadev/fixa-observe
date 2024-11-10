"use client";

import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { AudioVisualizer } from "react-audio-visualize";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "~/components/ui/select";
import type { Call, CallError } from "~/lib/types";
import { formatDurationHoursMinutesSeconds } from "~/lib/utils";
import { debounce } from "lodash";
import useSWR from "swr";
import { useAudio } from "./useAudio";

export type AudioPlayerRef = {
  setActiveError: (error: CallError | null) => void;
};

const AudioPlayer = forwardRef<
  AudioPlayerRef,
  {
    call: Call;
    onErrorHover?: (errorId: string | null) => void;
  }
>(function AudioPlayer({ call, onErrorHover }, ref) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [playheadHoverX, setPlayheadHoverX] = useState<number | null>(null);
  const [playheadX, setPlayheadX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeError, setActiveError] = useState<CallError | null>(null);
  const [key, setKey] = useState(0);
  const { data: botAudioBlob } = useSWR<Blob>(
    call.botRecordingUrl,
    (url: string) => fetch(url).then((res) => res.blob()),
  );
  const { data: userAudioBlob } = useSWR<Blob>(
    call.userRecordingUrl,
    (url: string) => fetch(url).then((res) => res.blob()),
  );
  const {
    isPlaying,
    play,
    pause,
    seek,
    duration,
    currentTime,
    playbackSpeed,
    setPlaybackSpeed,
    setAudioUrl,
  } = useAudio();
  useEffect(() => {
    setAudioUrl(call.recordingUrl);
  }, [call.recordingUrl, setAudioUrl]);

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 600);
  }, []);

  // Check if we need to stop playback due to reaching error end
  useEffect(() => {
    if (activeError && currentTime >= activeError.end) {
      pause();
      setActiveError(null);
    }
  }, [activeError, currentTime, pause]);

  // Get rid of active error if we pause in the middle of it playing
  useEffect(() => {
    if (!isPlaying && activeError) {
      setActiveError(null);
    }
  }, [activeError, isPlaying]);

  // Seek to a specific x position
  const seekToX = useCallback(
    (x: number) => {
      if (!containerRef.current) return;
      const percentage = x / containerWidth;
      const seekTime = percentage * duration;
      seek(seekTime);
      setActiveError(null);
    },
    [containerWidth, duration, seek],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setPlayheadHoverX(x);
      if (isDragging) {
        setPlayheadX(x);
        seekToX(x);
      }
    },
    [isDragging, seekToX],
  );
  const handleMouseLeave = useCallback(() => {
    setPlayheadHoverX(null);
    setIsDragging(false);
  }, []);
  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
    setPlayheadX(playheadHoverX);
  }, [playheadHoverX]);
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (playheadX !== null) {
      seekToX(playheadX);
    }
  }, [playheadX, seekToX]);

  // Set the container width and update on window resize
  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    const debouncedSetKey = debounce(() => {
      setKey((prev) => prev + 1);
    }, 250);

    const handleResize = () => {
      updateWidth();
      debouncedSetKey();
    };

    updateWidth(); // Initial width
    setKey((prev) => prev + 1); // Initial key set
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      debouncedSetKey.cancel(); // Clean up debounce
    };
  }, []);

  // Set the playhead position based on the current time
  useEffect(() => {
    if (!containerWidth || !duration || isDragging) return;
    const percentage = currentTime / duration;
    const position = percentage * containerWidth;
    setPlayheadX(position);
  }, [currentTime, containerWidth, duration, isDragging]);

  useImperativeHandle(
    ref,
    () => ({
      setActiveError: (error: CallError | null) => {
        setActiveError(error);
        if (error) {
          seek(error.start);
        }
      },
    }),
    [seek],
  );

  const handleErrorClick = useCallback(
    (error: CallError) => {
      seek(error.start);
      play();
      setActiveError(error);
    },
    [play, seek],
  );

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative h-[100px] w-full rounded-md border border-input shadow-sm"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {loaded && (
          <>
            {botAudioBlob && (
              <AudioVisualizer
                key={`bot-${key}`}
                width={containerWidth}
                height={50}
                blob={botAudioBlob}
                currentTime={currentTime}
                barPlayedColor="rgba(0, 0, 0, 0.5)"
              />
            )}
            {userAudioBlob && (
              <AudioVisualizer
                key={`user-${key}`}
                width={containerWidth}
                height={50}
                blob={userAudioBlob}
                currentTime={currentTime}
                barPlayedColor="rgba(0, 0, 0, 0.5)"
              />
            )}
          </>
        )}
        <div
          className="absolute right-0 top-0 h-full bg-primary/10"
          style={{
            width: `${containerWidth - (playheadX ?? 0) - 2}px`,
          }}
        />
        {playheadHoverX !== null && (
          <div
            className="absolute top-0 h-full w-[1px] bg-muted-foreground"
            style={{ left: `${playheadHoverX}px` }}
          />
        )}
        <div
          className="absolute left-0 top-0 h-full w-0.5 bg-primary"
          style={{ left: `${playheadX}px` }}
        />
        {call.errors?.map((error, index) => {
          if (!containerWidth || !duration) return null;
          const startPercentage = error.start / duration;
          const endPercentage = error.end / duration;
          const startPosition = startPercentage * containerWidth;
          const width = (endPercentage - startPercentage) * containerWidth;

          return (
            <div
              key={index}
              className="absolute top-0 h-full"
              style={{
                left: `${startPosition}px`,
                width: `${width}px`,
              }}
            >
              <div
                className="size-full cursor-pointer border border-red-500 bg-red-500/20 hover:bg-red-500/50"
                onMouseEnter={() => onErrorHover?.(error.id)}
                onMouseLeave={() => onErrorHover?.(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleErrorClick(error);
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                onMouseUp={(e) => {
                  e.stopPropagation();
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4">
        <Button
          size="icon"
          onClick={() => {
            isPlaying ? pause() : play();
            setActiveError(null);
          }}
        >
          {isPlaying ? (
            <PauseIcon className="size-4" />
          ) : (
            <PlayIcon className="size-4" />
          )}
        </Button>

        <div className="text-sm text-muted-foreground">
          {formatDurationHoursMinutesSeconds(currentTime)} /{" "}
          {formatDurationHoursMinutesSeconds(duration)}
        </div>

        <div className="flex-1" />

        <Select
          value={playbackSpeed.toString()}
          onValueChange={(value) => setPlaybackSpeed(parseFloat(value))}
        >
          <SelectTrigger className="w-20">
            <SelectValue placeholder="Speed" />
          </SelectTrigger>
          <SelectContent className="w-20">
            <SelectItem value="1">1x</SelectItem>
            <SelectItem value="2">2x</SelectItem>
            <SelectItem value="4">4x</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
});
export default AudioPlayer;
