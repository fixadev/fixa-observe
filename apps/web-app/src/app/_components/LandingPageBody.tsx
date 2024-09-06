"use client";
import React, { useCallback, useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import AnimatedPlaceholder from "@/components/AnimatedPlaceholder";
import { ibmPlexMono } from "~/app/fonts";
import { usePostHog } from "posthog-js/react";
import { ArrowRightCircleIcon } from "@heroicons/react/24/solid";
import { useSocketIO } from "@/components/UseSocketIO";
import { useWebSocket, SocketHook } from "@/components/UseWebsocket";
import { VideoPlayer } from "@/components/VideoPlayer";

const socket: SocketHook =
  process.env.NEXT_PUBLIC_BACKEND_ENV === "node" ? useSocketIO : useWebSocket;

export default function LandingPageBody() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // const { sendMessage, socket: WebSocket } = socket("ws://localhost:8000/ws");
  const { sendMessage, socket } = useWebSocket("ws://localhost:8000/ws");

  const posthog = usePostHog();

  const handleSubmit = useCallback(() => {
    if (text.length > 0) {
      setLoading(true);
      sendMessage(text);
      posthog.capture("Landing page prompt submitted", {
        prompt: text,
      });
    }
  }, [text, sendMessage, posthog]);

  return (
    <div className="flex h-[100dvh] w-screen flex-col items-center justify-center overflow-hidden p-2 text-white">
      <div
        className={`-mt-3 flex flex-col items-center justify-center gap-2 transition-[margin-top] duration-300 ease-in-out sm:gap-6`}
      >
        <LandingPageHeader />
        <LandingPageTextField
          text={text}
          onChange={setText}
          onSubmit={handleSubmit}
        />
      </div>
      {socket && (
        <div className="flex w-full justify-center">
          <VideoPlayer className="mt-4" socket={socket} isSocketIO={false} />
        </div>
      )}
    </div>
  );
}

const LandingPageHeader = () => {
  return (
    <div>
      <div
        className={[
          "mb-2 text-center text-sm text-neutral-400 sm:mb-4 sm:text-base",
          ibmPlexMono.className,
        ].join(" ")}
      >
        pixa.dev: the real-time AI text to video api
      </div>
      <h1 className="font-md mb-8 text-center text-3xl sm:text-5xl">
        bring any concept to life.
      </h1>
    </div>
  );
};

const LandingPageTextField = ({
  text,
  onChange,
  onSubmit,
}: {
  text: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    onSubmit();
    inputRef.current?.blur();
  };

  const placeholders = [
    "visualize 2x2 matrix multiplication step-by-step",
    "illustrate the doppler effect with sound waves",
    "animate the process of how the water cycle works",
    "show the formation and lifecycle of a star in space",
  ];

  return (
    <div className="flex w-full flex-row gap-2">
      <div className="relative flex-grow">
        {text.length === 0 && (
          <AnimatedPlaceholder placeholders={placeholders} />
        )}
        <Input
          ref={inputRef}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          type="text"
          className="w-full rounded-lg border-none bg-neutral-800 py-7 pl-4 pr-12 text-lg text-white"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />
        <button
          className="absolute right-2 top-1/2 size-10 -translate-y-1/2"
          onClick={handleSubmit}
        >
          <ArrowRightCircleIcon className="text-neutral-400 hover:cursor-pointer hover:text-neutral-200" />
        </button>
      </div>
    </div>
  );
};
