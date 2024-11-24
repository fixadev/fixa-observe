"use client";

import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "~/components/ui/select";
import type { CallWithIncludes, EvalResultWithIncludes } from "~/lib/types";
import {
  cn,
  formatDurationHoursMinutesSeconds,
  getInterruptionColor,
  getLatencyBlockColor,
} from "~/lib/utils";
import { useAudio } from "~/components/hooks/useAudio";
import dynamic from "next/dynamic";
import WaveSurfer from "wavesurfer.js";

export type AudioPlayerRef = {
  setActiveEvalResult: (evalResult: EvalResultWithIncludes | null) => void;
  setHoveredEvalResult: (evalResultId: string | null) => void;
};

const _AudioPlayer = forwardRef<
  AudioPlayerRef,
  {
    call: CallWithIncludes;
    small?: boolean;
    offsetFromStart?: number;
    onEvalResultHover?: (evalId: string | null) => void;
  }
>(function AudioPlayer(
  { call, small = false, offsetFromStart = 0, onEvalResultHover },
  ref,
) {
  const [playheadHoverX, setPlayheadHoverX] = useState<number | null>(null);
  const [playheadX, setPlayheadX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeEvalResult, setActiveEvalResult] =
    useState<EvalResultWithIncludes | null>(null);
  const [hoveredEvalResult, setHoveredEvalResult] = useState<string | null>(
    null,
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
    setAudioUrl(call.monoRecordingUrl ?? call.stereoRecordingUrl);
  }, [call.monoRecordingUrl, call.stereoRecordingUrl, setAudioUrl]);

  // Check if we need to stop playback due to reaching eval end
  useEffect(() => {
    if (
      activeEvalResult &&
      currentTime >=
        activeEvalResult.secondsFromStart +
          activeEvalResult.duration -
          offsetFromStart
    ) {
      pause();
      setActiveEvalResult(null);
    }
  }, [activeEvalResult, currentTime, offsetFromStart, pause]);

  // Get rid of active eval if we pause in the middle of it playing
  useEffect(() => {
    if (!isPlaying && activeEvalResult) {
      setActiveEvalResult(null);
    }
  }, [activeEvalResult, isPlaying]);

  // Seek to a specific x position
  const seekToX = useCallback(
    (x: number) => {
      if (!containerRef.current) return;
      const percentage = x / containerRef.current.offsetWidth;
      const seekTime = percentage * duration;
      seek(seekTime);
      setActiveEvalResult(null);
    },
    [duration, seek],
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

  // Set the playhead position based on the current time
  useEffect(() => {
    if (!containerRef.current || !duration || isDragging) return;
    const percentage = currentTime / duration;
    const position = percentage * containerRef.current.offsetWidth;
    setPlayheadX(position);
  }, [currentTime, duration, isDragging]);

  useImperativeHandle(
    ref,
    () => ({
      setActiveEvalResult: (evalResult: EvalResultWithIncludes | null) => {
        setActiveEvalResult(evalResult);
        if (evalResult) {
          seek(evalResult.secondsFromStart - offsetFromStart);
        }
      },
      setHoveredEvalResult: (evalResultId: string | null) => {
        setHoveredEvalResult(evalResultId);
      },
    }),
    [seek, offsetFromStart],
  );

  const handleEvalResultClick = useCallback(
    (evalResult: EvalResultWithIncludes) => {
      seek(evalResult.secondsFromStart - offsetFromStart);
      play();
      setActiveEvalResult(evalResult);
    },
    [play, seek, offsetFromStart],
  );

  const audioVisualizerId = useMemo(() => {
    return `audio-visualizer-${crypto.randomUUID()}`;
  }, []);

  useEffect(() => {
    const audioVisualizer = document.getElementById(audioVisualizerId);
    if (audioVisualizer) {
      const wavesurfer = WaveSurfer.create({
        container: `#${audioVisualizerId}`,
        url: call.stereoRecordingUrl,
        height: small ? 50 : 100,
        splitChannels: [
          { height: small ? 25 : 50 },
          { height: small ? 25 : 50 },
        ],
        interact: false,
      });
      return () => {
        wavesurfer.destroy();
      };
    }
  }, [audioVisualizerId, call.stereoRecordingUrl, small]);

  return (
    <div
      className={cn(
        "flex w-full gap-4",
        small ? "flex-row-reverse" : "flex-col",
      )}
    >
      <div
        className={cn(
          "relative w-full rounded-md border border-input shadow-sm",
          small ? "h-[50px]" : "h-[100px]",
        )}
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div id={audioVisualizerId} className="size-full" />
        <div className="absolute left-0 top-0 z-10 size-full">
          <div
            className="absolute right-0 top-0 h-full bg-primary/10"
            style={{
              width: `${
                (containerRef.current?.offsetWidth ?? 0) - (playheadX ?? 0) - 2
              }px`,
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
          {call.evalResults?.map((evalResult, index) => {
            if (!containerRef.current || !duration) return null;
            const startPercentage = Math.min(
              1,
              Math.max(
                0,
                (evalResult.secondsFromStart - offsetFromStart) / duration,
              ),
            );
            const endPercentage = Math.min(
              1,
              Math.max(
                0,
                (evalResult.secondsFromStart +
                  evalResult.duration -
                  offsetFromStart) /
                  duration,
              ),
            );
            const startPosition =
              startPercentage * containerRef.current.offsetWidth;
            const width =
              (endPercentage - startPercentage) *
              containerRef.current.offsetWidth;

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
                  className={cn(
                    "size-full cursor-pointer border-l-2",
                    evalResult.success
                      ? "border-green-500 bg-green-500/20 hover:bg-green-500/50"
                      : "border-red-500 bg-red-500/20 hover:bg-red-500/50",
                    hoveredEvalResult === evalResult.id &&
                      (evalResult.success
                        ? "bg-green-500/50"
                        : "bg-red-500/50"),
                  )}
                  onMouseEnter={() => onEvalResultHover?.(evalResult.id)}
                  onMouseLeave={() => onEvalResultHover?.(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEvalResultClick(evalResult);
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
          {call.latencyBlocks?.map((latencyBlock, index) => {
            if (!containerRef.current || !duration) return null;
            const startPercentage = Math.min(
              1,
              Math.max(0, latencyBlock.secondsFromStart / duration),
            );
            const endPercentage = Math.min(
              1,
              Math.max(
                0,
                (latencyBlock.secondsFromStart + latencyBlock.duration) /
                  duration,
              ),
            );
            const startPosition =
              startPercentage * containerRef.current.offsetWidth;
            const width =
              (endPercentage - startPercentage) *
              containerRef.current.offsetWidth;

            return (
              <div
                key={index}
                className="absolute top-0 h-full cursor-pointer"
                style={{
                  left: `${startPosition}px`,
                  width: `${width}px`,
                  background:
                    hoveredEvalResult === latencyBlock.id
                      ? getLatencyBlockColor(latencyBlock, 0.5)
                      : getLatencyBlockColor(latencyBlock),
                  border: `1px solid ${getLatencyBlockColor(latencyBlock, 1)}`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  seek(latencyBlock.secondsFromStart);
                  play();
                }}
                onMouseEnter={() => {
                  setHoveredEvalResult(latencyBlock.id);
                  onEvalResultHover?.(latencyBlock.id);
                }}
                onMouseLeave={() => {
                  setHoveredEvalResult(null);
                  onEvalResultHover?.(null);
                }}
              />
            );
          })}
          {call.interruptions?.map((interruption, index) => {
            if (!containerRef.current || !duration) return null;
            const startPercentage = Math.min(
              1,
              Math.max(0, interruption.secondsFromStart / duration),
            );
            const endPercentage = Math.min(
              1,
              Math.max(
                0,
                (interruption.secondsFromStart + interruption.duration) /
                  duration,
              ),
            );
            const startPosition =
              startPercentage * containerRef.current.offsetWidth;
            const width =
              (endPercentage - startPercentage) *
              containerRef.current.offsetWidth;

            return (
              <div
                key={index}
                className="absolute top-0 h-full cursor-pointer"
                style={{
                  top: "50%",
                  height: "50%",
                  left: `${startPosition}px`,
                  width: `${width}px`,
                  background:
                    hoveredEvalResult === interruption.id
                      ? getInterruptionColor(0.5)
                      : getInterruptionColor(),
                  border: `1px solid ${getInterruptionColor(1)}`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  seek(interruption.secondsFromStart);
                  play();
                }}
                onMouseEnter={() => {
                  setHoveredEvalResult(interruption.id);
                  onEvalResultHover?.(interruption.id);
                }}
                onMouseLeave={() => {
                  setHoveredEvalResult(null);
                  onEvalResultHover?.(null);
                }}
              />
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button
          size="icon"
          onClick={() => {
            isPlaying ? pause() : play();
            setActiveEvalResult(null);
          }}
        >
          {isPlaying ? (
            <PauseIcon className="size-4" />
          ) : (
            <PlayIcon className="size-4" />
          )}
        </Button>

        {!small && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
});
export default dynamic(() => Promise.resolve(_AudioPlayer), { ssr: false });
