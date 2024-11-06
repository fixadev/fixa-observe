"use client";

import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import { useState, useRef, useEffect, useCallback } from "react";
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

export default function AudioPlayer({ call }: { call: Call }) {
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

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const response = await fetch(call.recordingUrl);
        const blob = await response.blob();
        setAudioBlob(blob);
        console.log("Audio blob fetched");
      } catch (error) {
        console.error("Error fetching audio:", error);
      }
    };

    void fetchAudio();
  }, [call.recordingUrl]);

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

  useEffect(() => {
    if (!sound) return;

    if (isPlaying) {
      sound.play();
      sound.rate(playbackSpeed);
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
  }, [isPlaying, sound, playbackSpeed]);

  useEffect(() => {
    if (!sound) return;
    sound.rate(playbackSpeed);
  }, [playbackSpeed, sound]);

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
      }
    },
    [isDragging],
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

  useEffect(() => {
    if (!containerRef.current) return;
    setContainerWidth(containerRef.current.offsetWidth);
  }, []);

  useEffect(() => {
    if (!containerWidth || !duration || isDragging) return;
    const percentage = currentTime / duration;
    const position = percentage * containerWidth;
    setPlayheadX(position);
  }, [currentTime, containerWidth, duration, isDragging]);

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
}
