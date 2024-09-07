"use client";
import React, { useCallback, useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import AnimatedPlaceholder from "@/components/AnimatedPlaceholder";
import { ibmPlexMono } from "~/app/fonts";
import { usePostHog } from "posthog-js/react";
import { ArrowRightCircleIcon } from "@heroicons/react/24/solid";
import { useWebSocket, SocketHook } from "@/components/UseWebsocket";
import { VideoPlayer } from "@/components/VideoPlayer";
import { useAuth, useClerk } from "@clerk/nextjs";
import { ANONYMOUS_PROMPT_SUBMISSION_LIMIT } from "~/lib/constants";
import BookCallDialog from "./BookCallDialog";
import { cn } from "~/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "~/components/ui/button";
import ExpandTransition from "~/components/ExpandTransition";
import { api } from "~/trpc/react";

export default function LandingPageBody() {
  const [state, setState] = useState<"initial" | "chat">("initial");
  const [chatHistory, setChatHistory] = useState<string[]>([]);

  const posthog = usePostHog();
  const [text, setText] = useState("");
  const { sendMessage, socket } = useWebSocket("ws://localhost:8000/ws");

  const chatHistoryRef = useRef<HTMLDivElement>(null);

  const { data: profile } = api.user.getProfile.useQuery();
  const { mutate: generate } = api.user.generate.useMutation();
  const [generationsLeft, setGenerationsLeft] = useState(0);
  useEffect(() => {
    if (profile) {
      setGenerationsLeft(profile.generationsLeft);
    }
  }, [profile]);

  // Function to scroll to bottom of chat history
  const scrollToBottom = () => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTo({
        top: chatHistoryRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Scroll to bottom on mount and when chat history changes
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, chatHistoryRef.current?.scrollHeight]);

  const { openSignIn } = useClerk();
  const { isSignedIn } = useAuth();
  const handleSubmit = useCallback(() => {
    if (text.length > 0) {
      // If not signed in, check if the user has submitted a prompt before
      if (!isSignedIn) {
        const promptsSubmitted = localStorage.getItem("promptsSubmitted");
        // If the user has not submitted a prompt before, allow them to submit 1 prompt
        // Otherwise, open the sign in modal
        if (!promptsSubmitted) {
          localStorage.setItem("promptsSubmitted", "1");
        } else {
          const promptsSubmittedInt = parseInt(promptsSubmitted);
          if (promptsSubmittedInt >= ANONYMOUS_PROMPT_SUBMISSION_LIMIT) {
            openSignIn();
            // setBookCallDialogOpen(true);
            return;
          }
          localStorage.setItem(
            "promptsSubmitted",
            (promptsSubmittedInt + 1).toString(),
          );
        }
      } else if (isSignedIn && generationsLeft <= 0) {
        setTimeout(() => {
          setBookCallDialogOpen(true);
        });
        return;
      }

      sendMessage(text);
      posthog.capture("Landing page prompt submitted", {
        prompt: text,
      });
      setChatHistory([...chatHistory, text]);
      setText("");

      if (state === "initial") {
        setState("chat");
      }

      setJustSubmitted(true);
      setShowVideo(false);
      setTimeout(() => {
        setJustSubmitted(false);
        setShowVideo(true);
        setTimeout(() => {
          scrollToBottom();
        }, 310);
      }, 1000);

      generate();
      setGenerationsLeft(generationsLeft - 1);
    }
  }, [
    state,
    text,
    isSignedIn,
    openSignIn,
    sendMessage,
    posthog,
    generate,
    generationsLeft,
    setGenerationsLeft,
  ]);

  const [bookCallDialogOpen, setBookCallDialogOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  return (
    <>
      <div className="flex h-[calc(100dvh-64px)] w-screen flex-col items-center justify-center overflow-hidden p-2 text-white">
        {state === "initial" && (
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
        )}

        {state === "chat" && (
          <div className="flex h-full w-full max-w-screen-lg flex-col justify-end px-2 sm:px-4">
            <div
              ref={chatHistoryRef}
              className="-mx-2 mb-4 overflow-y-auto px-2 sm:-mx-4 sm:px-4"
            >
              {chatHistory.map((text, i) => {
                // Do not render the message that was just submitted, instead render it below the video player
                if (i === chatHistory.length - 1 && justSubmitted) return null;
                return (
                  <div
                    key={i}
                    className="mb-2 flex w-full flex-col items-end gap-0.5"
                  >
                    <div className="inline-block rounded-lg bg-neutral-700 px-4 py-3 text-base text-white">
                      {text}
                    </div>
                  </div>
                );
              })}

              {/* The video player */}
              <AnimatePresence>
                {socket && showVideo && (
                  <ExpandTransition buffer={100}>
                    <VideoPlayer className="mb-4 w-full" socket={socket} />
                  </ExpandTransition>
                )}
              </AnimatePresence>

              {/* The message that was just submitted */}
              {justSubmitted && (
                <div className="mb-2 flex w-full flex-col items-end gap-0.5">
                  <div className="inline-block rounded-lg bg-neutral-700 px-4 py-3 text-base text-white">
                    {chatHistory[chatHistory.length - 1]}
                  </div>
                </div>
              )}
            </div>
            <LandingPageTextField
              className="mb-2"
              autoFocus
              placeholder="ask pixa anything"
              text={text}
              onChange={setText}
              onSubmit={handleSubmit}
            />
            {isSignedIn && (
              <div className="text-muted-foreground">
                you have {generationsLeft} animation generations left.
              </div>
            )}
          </div>
        )}
      </div>
      <BookCallDialog
        open={bookCallDialogOpen}
        onOpenChange={setBookCallDialogOpen}
      />
    </>
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

  autoFocus,
  className,
  placeholder,
}: {
  text: string;
  onChange: (text: string) => void;
  onSubmit: () => void;

  autoFocus?: boolean;
  className?: string;
  placeholder?: string;
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    onSubmit();
  };

  const placeholders = [
    "visualize 2x2 matrix multiplication step-by-step",
    "illustrate the doppler effect with sound waves",
    "animate the process of how the water cycle works",
    "show the formation and lifecycle of a star in space",
  ];

  return (
    <div className={cn("flex w-full flex-row gap-2", className)}>
      <div className="relative flex-grow">
        {text.length === 0 && !placeholder && (
          <AnimatedPlaceholder placeholders={placeholders} />
        )}
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          type="text"
          autoFocus={autoFocus}
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
