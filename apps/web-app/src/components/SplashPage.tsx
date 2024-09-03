"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { SignUpDialog } from "@/components/SignUpDialog";
import AnimatedPlaceholder from "@/components/AnimatedPlaceholder";
import { ibmPlexMono } from "~/app/fonts";
import { usePostHog } from "posthog-js/react";
import { ArrowRightCircleIcon } from "@heroicons/react/24/solid";
import { useWebSocket } from "@/components/UseWebsocket";
import { VideoPlayer } from "@/components/VideoPlayer";

const SplashPage = () => {
  const [text, setText] = useState("");
  const { data, sendMessage } = useWebSocket("ws://localhost:8000/ws");

  const placeholders = [
    "visualize 2x2 matrix multiplication step-by-step",
    "illustrate the doppler effect with sound waves",
    "animate the process of how the water cycle works",
    "show the formation and lifecycle of a star in space",
  ];
  const posthog = usePostHog();

  const handleSubmit = useCallback(() => {
    if (text.length > 0) {
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
        <div className="flex w-full flex-row gap-2">
          <div className="relative flex-grow">
            {text.length === 0 && (
              <AnimatedPlaceholder placeholders={placeholders} />
            )}
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              type="text"
              className="w-full rounded-lg border-none bg-neutral-800 py-7 pl-4 pr-12 text-lg text-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
            {/* <SignUpDialog open={open} onOpenChange={setOpen} /> */}
            <button
              className="absolute right-2 top-1/2 size-10 -translate-y-1/2"
              onClick={handleSubmit}
            >
              <ArrowRightCircleIcon className="text-neutral-400 hover:cursor-pointer hover:text-neutral-200" />
            </button>
          </div>
        </div>
      </div>
      <div
        className={`mt-4 transition-opacity duration-300 ease-in-out ${
          data.imageSrc !== null ? "opacity-100" : "opacity-0"
        }`}
      >
        {data.imageSrc !== null && <VideoPlayer imageSrc={data.imageSrc} />}
      </div>
    </div>
  );
};

export default SplashPage;
