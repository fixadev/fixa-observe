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
import type { Call } from "~/lib/types";
import { formatDurationHoursMinutesSeconds } from "~/lib/utils";
import { Howl } from "howler";

export type AudioPlayerRef = {
  seekToTime: (timeInSeconds: number) => void;
};

const AudioPlayer = forwardRef<AudioPlayerRef, { call: Call }>(
  function AudioPlayer({ call }, ref) {
    const [containerWidth, setContainerWidth] = useState(0);
    const [playheadHoverX, setPlayheadHoverX] = useState<number | null>(null);
    const [playheadX, setPlayheadX] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [sound, setSound] = useState<Howl | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

    // Fetch the audio blob
    useEffect(() => {
      const fetchAudio = async () => {
        try {
          const response = await fetch(call.recordingUrl);
          const blob = await response.blob();
          setAudioBlob(blob);
        } catch (error) {
          console.error("Error fetching audio:", error);
        }
      };

      void fetchAudio();
    }, [call.recordingUrl]);

    // Create the sound object
    useEffect(() => {
      const howl = new Howl({
        src: [call.recordingUrl],
        html5: true,
        preload: true,
        onload: () => {
          setDuration(howl.duration());
        },
      });
      setSound(howl);

      return () => {
        howl.unload();
      };
    }, [call.recordingUrl]);

    // Play the sound
    useEffect(() => {
      if (!sound) return;

      if (isPlaying) {
        sound.play();
      } else {
        sound.pause();
      }

      // Set up time tracking
      const interval = setInterval(() => {
        if (sound.playing()) {
          setCurrentTime(sound.seek());
        }
      }, 100);

      return () => {
        clearInterval(interval);
      };
    }, [isPlaying, sound]);

    // Set the playback speed
    useEffect(() => {
      if (!sound) return;
      sound.rate(playbackSpeed);
    }, [playbackSpeed, sound]);

    // Seek to a specific time
    const handleSeek = useCallback(
      (x: number) => {
        if (!sound || !containerRef.current) return;
        const percentage = x / containerWidth;
        const seekTime = percentage * duration;
        sound.seek(seekTime);
        setCurrentTime(seekTime);
      },
      [sound, containerWidth, duration],
    );

    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        setPlayheadHoverX(x);
        if (isDragging) {
          setPlayheadX(x);
          handleSeek(x);
        }
      },
      [isDragging, handleSeek],
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
        handleSeek(playheadX);
      }
    }, [playheadX, handleSeek]);

    // Set the container width
    useEffect(() => {
      if (!containerRef.current) return;
      setContainerWidth(containerRef.current.offsetWidth);
    }, []);

    // Set the playhead position based on the current time
    useEffect(() => {
      if (!containerWidth || !duration || isDragging) return;
      const percentage = currentTime / duration;
      const position = percentage * containerWidth;
      setPlayheadX(position);
    }, [currentTime, containerWidth, duration, isDragging]);

    const seekToTime = useCallback(
      (timeInSeconds: number) => {
        if (!sound) return;
        sound.seek(timeInSeconds);
        setCurrentTime(timeInSeconds);
      },
      [sound],
    );

    useImperativeHandle(
      ref,
      () => ({
        seekToTime,
      }),
      [seekToTime],
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
          {audioBlob && (
            <AudioVisualizer
              width={containerWidth}
              height={100}
              blob={audioBlob}
              currentTime={currentTime}
            />
          )}
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
        </div>
        <div className="flex items-center gap-4">
          <Button size="icon" onClick={() => setIsPlaying(!isPlaying)}>
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
  },
);
export default AudioPlayer;
