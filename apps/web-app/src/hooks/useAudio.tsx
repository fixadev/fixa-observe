"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Howl } from "howler";

interface AudioContextType {
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  playbackSpeed: number;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setPlaybackSpeed: (playbackSpeed: number) => void;
  setAudioUrl: (audioUrl: string | null) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [sound, setSound] = useState<Howl | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // When howl is loaded ==> set the duration and play the sound if it's already playing
  const onLoad = useCallback(
    (howl: Howl) => {
      setDuration(howl.duration());
      if (isPlaying) {
        howl.play();
      }
    },
    [isPlaying],
  );

  // Create the sound object
  useEffect(() => {
    if (!audioUrl) return;

    const howl = new Howl({
      src: [audioUrl],
      html5: true,
      preload: true,
      onload: () => onLoad(howl),
      onpause: () => {
        setIsPlaying(false);
      },
      onend: () => {
        setIsPlaying(false);
      },
    });
    setSound(howl);

    // Add MediaSession API listener
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("pause", () => {
        setIsPlaying(false);
        howl.pause();
      });
      navigator.mediaSession.setActionHandler("play", () => {
        setIsPlaying(true);
        howl.play();
      });
    }

    return () => {
      howl.unload();
      if ("mediaSession" in navigator) {
        navigator.mediaSession.setActionHandler("pause", null);
        navigator.mediaSession.setActionHandler("play", null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioUrl]);

  // Play, pause, and seek
  const play = useCallback(() => {
    setIsPlaying(true);
    sound?.play();
  }, [setIsPlaying, sound]);
  const pause = useCallback(() => {
    setIsPlaying(false);
    sound?.pause();
  }, [setIsPlaying, sound]);
  const seek = useCallback(
    (time: number) => {
      sound?.seek(time);
      setCurrentTime(time);
    },
    [sound, setCurrentTime],
  );

  // Update currentTime at 30fps
  useEffect(() => {
    if (!sound) return;

    // Set up time tracking
    const interval = setInterval(() => {
      if (sound.playing()) {
        const currentPos = sound.seek();
        setCurrentTime(currentPos);
      }
    }, 1 / 30);

    return () => {
      clearInterval(interval);
    };
  }, [sound]);

  // Set the playback speed
  useEffect(() => {
    if (!sound) return;
    sound.rate(playbackSpeed);
  }, [playbackSpeed, sound]);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        duration,
        currentTime,
        playbackSpeed,
        play,
        pause,
        seek,
        setPlaybackSpeed,
        setAudioUrl,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
