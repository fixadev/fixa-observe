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
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeEvalResult, setActiveEvalResult] =
    useState<EvalResultWithIncludes | null>(null);
  const [hoveredEvalResult, setHoveredEvalResult] = useState<string | null>(
    null,
  );
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const seek = useCallback(
    (time: number) => {
      wavesurfer?.setTime(time);
      setActiveEvalResult(null);
    },
    [wavesurfer],
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const pause = useCallback(() => {
    wavesurfer?.pause();
    setIsPlaying(false);
  }, [wavesurfer]);
  const play = useCallback(() => {
    void wavesurfer?.play();
    setIsPlaying(true);
  }, [wavesurfer]);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const audioVisualizerId = useMemo(() => {
    return `audio-visualizer-${crypto.randomUUID()}`;
  }, []);

  useEffect(() => {
    const audioVisualizer = document.getElementById(audioVisualizerId);
    if (audioVisualizer) {
      const _wavesurfer = WaveSurfer.create({
        container: `#${audioVisualizerId}`,
        url: call.stereoRecordingUrl,
        height: small ? 50 : 100,
        splitChannels: [
          { height: small ? 25 : 50 },
          { height: small ? 25 : 50 },
        ],
        // interact: false,
        dragToSeek: true,
      });
      _wavesurfer.on("ready", (_duration) => {
        setDuration(_duration);
      });
      _wavesurfer.on("timeupdate", (time) => {
        setCurrentTime(time);
      });
      setWavesurfer(_wavesurfer);
      return () => {
        _wavesurfer.destroy();
      };
    }
  }, [audioVisualizerId, call.stereoRecordingUrl, small]);

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
      >
        <div id={audioVisualizerId} className="size-full" />
        {call.evalResults?.map((evalResult, index) => {
          if (!containerRef.current || !duration) return null;
          const startPercentage =
            Math.min(
              1,
              Math.max(
                0,
                (evalResult.secondsFromStart - offsetFromStart) / duration,
              ),
            ) * 100;
          const endPercentage =
            Math.min(
              1,
              Math.max(
                0,
                (evalResult.secondsFromStart +
                  evalResult.duration -
                  offsetFromStart) /
                  duration,
              ),
            ) * 100;

          return (
            <div
              key={index}
              className="absolute top-0 z-10 h-full"
              style={{
                left: `${startPercentage}%`,
                width: `${endPercentage - startPercentage}%`,
              }}
            >
              <div
                className={cn(
                  "size-full cursor-pointer border-l-2",
                  evalResult.success
                    ? "border-green-500 bg-green-500/20 hover:bg-green-500/50"
                    : "border-red-500 bg-red-500/20 hover:bg-red-500/50",
                  hoveredEvalResult === evalResult.id &&
                    (evalResult.success ? "bg-green-500/50" : "bg-red-500/50"),
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
          const startPercentage =
            Math.min(1, Math.max(0, latencyBlock.secondsFromStart / duration)) *
            100;
          const endPercentage =
            Math.min(
              1,
              Math.max(
                0,
                (latencyBlock.secondsFromStart + latencyBlock.duration) /
                  duration,
              ),
            ) * 100;

          return (
            <div
              key={index}
              className="absolute top-0 z-10 h-full cursor-pointer"
              style={{
                left: `${startPercentage}%`,
                width: `${endPercentage - startPercentage}%`,
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
          const startPercentage =
            Math.min(1, Math.max(0, interruption.secondsFromStart / duration)) *
            100;
          const endPercentage =
            Math.min(
              1,
              Math.max(
                0,
                (interruption.secondsFromStart + interruption.duration) /
                  duration,
              ),
            ) * 100;

          return (
            <div
              key={index}
              className="absolute top-0 z-10 h-full cursor-pointer"
              style={{
                top: "50%",
                height: "50%",
                left: `${startPercentage}%`,
                width: `${endPercentage - startPercentage}%`,
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
