"use client";

import {
  ArrowDownTrayIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/24/solid";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useMemo,
  Fragment,
} from "react";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "~/components/ui/select";
import {
  MARK_CALL_AS_READ_DELAY_MS,
  type CallWithIncludes,
  type EvaluationResultWithIncludes,
} from "@repo/types/src/index";
import { cn, formatDurationHoursMinutesSeconds } from "~/lib/utils";
import WaveSurfer from "wavesurfer.js";
import { Skeleton } from "../ui/skeleton";
import { useAudioSettings } from "~/components/hooks/useAudioSettings";
import { api } from "~/trpc/react";
import { useObserveStateSafe } from "../hooks/useObserveState";
import { AudioVisualizationBlock } from "./AudioVisualizationBlock";
import { type BlockChange } from "@repo/types/src";
import Spinner from "../Spinner";

export type AudioPlayerRef = {
  setActiveEvalResult: (
    evalResult: EvaluationResultWithIncludes | null,
  ) => void;
  setHoveredEvalResult: (evalResultId: string | null) => void;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
};

export const AudioPlayer = forwardRef<
  AudioPlayerRef,
  {
    call: CallWithIncludes;
    small?: boolean;
    offsetFromStart?: number;
    onEvalResultHover?: (evalId: string | null) => void;
    onTimeUpdate?: (time: number) => void;
  }
>(function AudioPlayer(
  {
    call: _call,
    small = false,
    offsetFromStart = 0,
    onEvalResultHover,
    onTimeUpdate,
  },
  ref,
) {
  const [call, setCall] = useState<CallWithIncludes>(_call);
  useEffect(() => {
    setCall(_call);
  }, [_call]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeEvalResult, setActiveEvalResult] =
    useState<EvaluationResultWithIncludes | null>(null);
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
  }, [wavesurfer]);
  const play = useCallback(() => {
    void wavesurfer?.play();
  }, [wavesurfer]);
  const [currentTime, setCurrentTime] = useState(0);
  const { playbackSpeed, setPlaybackSpeed } = useAudioSettings();
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioVisualizerId = useMemo(() => {
    return `audio-visualizer-${crypto.randomUUID()}`;
  }, []);
  const observeState = useObserveStateSafe();
  const { mutate: markCallAsRead } = api._call.updateIsRead.useMutation({
    onSuccess: () => {
      if (observeState) {
        observeState.handleUpdateCallReadState(call.id, true);
      }
    },
  });
  const [unsavedChanges, setUnsavedChanges] = useState<
    Record<string, BlockChange>
  >({});

  // Load the audio visualizer
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
        setAudioLoaded(true);
        _wavesurfer.setPlaybackRate(playbackSpeed);
      });
      _wavesurfer.on("timeupdate", (time) => {
        setCurrentTime(time);
      });
      _wavesurfer.on("finish", () => {
        setIsPlaying(false);
      });
      _wavesurfer.on("play", () => {
        setIsPlaying(true);
      });
      _wavesurfer.on("pause", () => {
        setIsPlaying(false);
      });
      setWavesurfer(_wavesurfer);
      return () => {
        _wavesurfer.destroy();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioVisualizerId, call.stereoRecordingUrl, small]);

  // Update the time
  useEffect(() => {
    onTimeUpdate?.(currentTime);
  }, [currentTime, onTimeUpdate]);

  // Update playback speed
  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.setPlaybackRate(playbackSpeed);
    }
  }, [playbackSpeed, wavesurfer]);

  // Check if we need to stop playback due to reaching eval end
  useEffect(() => {
    if (
      activeEvalResult?.secondsFromStart &&
      activeEvalResult.duration &&
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

  useEffect(() => {
    if (
      observeState &&
      audioLoaded &&
      (!call.isRead ||
        (call.id in observeState.callReadState &&
          !observeState.callReadState[call.id]))
    ) {
      const timer = setTimeout(() => {
        markCallAsRead({ callId: call.id, isRead: true });
      }, MARK_CALL_AS_READ_DELAY_MS);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioLoaded]);

  useImperativeHandle(
    ref,
    () => ({
      setActiveEvalResult: (
        evalResult: EvaluationResultWithIncludes | null,
      ) => {
        setActiveEvalResult(evalResult);
        if (evalResult?.secondsFromStart && evalResult.duration) {
          seek(evalResult.secondsFromStart - offsetFromStart);
        }
      },
      setHoveredEvalResult: (evalResultId: string | null) => {
        setHoveredEvalResult(evalResultId);
      },
      seek,
      play,
      pause,
    }),
    [seek, offsetFromStart, play, pause],
  );

  const handleEvalResultClick = useCallback(
    (evalResult: EvaluationResultWithIncludes) => {
      if (!evalResult.secondsFromStart || !evalResult.duration) return;
      seek(evalResult.secondsFromStart - offsetFromStart);
      play();
      setActiveEvalResult(evalResult);
    },
    [play, seek, offsetFromStart],
  );
  const handleEvalResultHover = useCallback(
    (evalResultId: string | null) => {
      setHoveredEvalResult(evalResultId);
      onEvalResultHover?.(evalResultId);
    },
    [onEvalResultHover],
  );

  const downloadAudio = useCallback(async () => {
    try {
      const response = await fetch(call.stereoRecordingUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${call.id}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading audio:", error);
    }
  }, [call.stereoRecordingUrl, call.id]);

  const handleEditBlock = useCallback((blockChange: BlockChange) => {
    console.log("blockChange", blockChange);
    setUnsavedChanges((prev) => ({
      ...prev,
      [blockChange.id]: blockChange,
    }));
  }, []);

  const [blocksKey, setBlocksKey] = useState(0);
  const handleDiscardChanges = useCallback(() => {
    setBlocksKey((prev) => prev + 1);
    setUnsavedChanges({});
  }, []);

  const { mutate: updateBlocks, isPending: isUpdatingBlocks } =
    api._call.updateBlocks.useMutation({
      onSuccess: (updatedCall) => {
        if (updatedCall) {
          setCall(updatedCall);
          setBlocksKey((prev) => prev + 1);
          setUnsavedChanges({});
        }
      },
    });
  const handleSaveChanges = useCallback(() => {
    updateBlocks({
      callId: call.id,
      blocks: Object.values(unsavedChanges),
    });
  }, [updateBlocks, call.id, unsavedChanges]);

  return (
    <>
      <div
        className={cn("flex w-full", small ? "flex-row-reverse" : "flex-col")}
      >
        <div
          className={cn(
            "relative w-full rounded-md border border-input shadow-sm",
            small ? "h-[50px]" : "h-[100px]",
          )}
          ref={containerRef}
        >
          <div id={audioVisualizerId} className="size-full" />
          {!audioLoaded && (
            <Skeleton className="absolute left-0 top-0 size-full" />
          )}
          {call.evaluationResults?.map((evalResult, index) => (
            <AudioVisualizationBlock
              key={index}
              type="evaluationResult"
              data={evalResult}
              duration={duration}
              offsetFromStart={offsetFromStart}
              hoveredEvalResult={hoveredEvalResult}
              onEvalResultHover={handleEvalResultHover}
              onEvalResultClick={handleEvalResultClick}
            />
          ))}
          <Fragment key={blocksKey}>
            {call.latencyBlocks?.map((latencyBlock, index) => (
              <AudioVisualizationBlock
                key={index}
                type="latencyBlock"
                data={latencyBlock}
                duration={duration}
                offsetFromStart={offsetFromStart}
                hoveredEvalResult={hoveredEvalResult}
                onEvalResultHover={handleEvalResultHover}
                onEditBlock={handleEditBlock}
              />
            ))}
            {call.interruptions?.map((interruption, index) => (
              <AudioVisualizationBlock
                key={index}
                type="interruption"
                data={interruption}
                duration={duration}
                offsetFromStart={offsetFromStart}
                hoveredEvalResult={hoveredEvalResult}
                onEvalResultHover={handleEvalResultHover}
                onEditBlock={handleEditBlock}
              />
            ))}
          </Fragment>
        </div>
        {!small && Object.keys(unsavedChanges).length > 0 && (
          <div className="mt-1 flex items-baseline gap-4">
            <div className="text-xs">save changes?</div>
            <div className="flex items-center">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-1.5"
                onClick={handleSaveChanges}
              >
                save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-1.5 text-muted-foreground hover:text-muted-foreground"
                onClick={handleDiscardChanges}
              >
                discard
              </Button>
            </div>
          </div>
        )}
        <div className={cn("flex items-center gap-4", small ? "mr-4" : "mt-4")}>
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
                  <SelectItem value="1.5">1.5x</SelectItem>
                  <SelectItem value="2">2x</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" onClick={downloadAudio}>
                <ArrowDownTrayIcon className="size-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      {small && Object.keys(unsavedChanges).length > 0 && (
        <div className="mt-1 flex items-center gap-4">
          <div className="text-xs">
            {isUpdatingBlocks ? "saving changes..." : "save changes?"}
          </div>
          <div className="flex items-center">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-1.5"
              onClick={handleSaveChanges}
              disabled={isUpdatingBlocks}
            >
              {isUpdatingBlocks ? <Spinner className="size-4" /> : "save"}
            </Button>
            {!isUpdatingBlocks && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-1.5 text-muted-foreground hover:text-muted-foreground"
                onClick={handleDiscardChanges}
              >
                discard
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
});
