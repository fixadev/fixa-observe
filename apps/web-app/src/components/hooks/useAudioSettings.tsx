"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useCallback,
  useEffect,
} from "react";

const PLAYBACK_SPEED_KEY = "audio-playback-speed";

interface AudioSettingsContextType {
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
}

const AudioSettingsContext = createContext<AudioSettingsContextType | null>(
  null,
);

export function AudioSettingsProvider({ children }: { children: ReactNode }) {
  const [playbackSpeed, setPlaybackSpeedState] = useState(1);

  useEffect(() => {
    const savedSpeed = localStorage.getItem(PLAYBACK_SPEED_KEY);
    if (savedSpeed) {
      setPlaybackSpeedState(parseFloat(savedSpeed));
    }
  }, []);

  const handleSetPlaybackSpeed = useCallback((speed: number) => {
    setPlaybackSpeedState(speed);
    localStorage.setItem(PLAYBACK_SPEED_KEY, speed.toString());
  }, []);

  return (
    <AudioSettingsContext.Provider
      value={{
        playbackSpeed,
        setPlaybackSpeed: handleSetPlaybackSpeed,
      }}
    >
      {children}
    </AudioSettingsContext.Provider>
  );
}

export function useAudioSettings() {
  const context = useContext(AudioSettingsContext);
  if (!context) {
    throw new Error(
      "useAudioSettings must be used within an AudioSettingsProvider",
    );
  }
  return context;
}
