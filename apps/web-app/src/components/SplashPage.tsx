"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { SignUpDialog } from "@/components/SignUpDialog";
import AnimatedPlaceholder from "@/components/AnimatedPlaceholder";
import { ibmPlexMono } from "~/app/fonts";
import { usePostHog } from "posthog-js/react";

const SplashPage = () => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const placeholders = [
    "visualize 2x2 matrix multiplication step-by-step",
    "illustrate the doppler effect with sound waves",
    "animate the process of how the water cycle works",
    "show the formation and lifecycle of a star in space",
  ];
  const posthog = usePostHog();

  useEffect(() => {
    if (open && text.length > 0) {
      // Means that user submitted prompt
      posthog.capture("Landing page prompt submitted", {
        prompt: text,
      });
    }
  }, [open]);

  return (
    <div className="flex h-[100dvh] w-screen flex-col items-center justify-center overflow-hidden p-2 text-white">
      <div className="-mt-3 flex flex-col items-center justify-center gap-2 sm:gap-6">
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
                  setOpen(true);
                }
              }}
            />
            <SignUpDialog open={open} onOpenChange={setOpen} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
