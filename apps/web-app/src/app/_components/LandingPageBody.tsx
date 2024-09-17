"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import AnimatedPlaceholder from "@/components/AnimatedPlaceholder";
import { ibmPlexMono } from "~/app/fonts";
import { usePostHog } from "posthog-js/react";
import { ArrowRightCircleIcon } from "@heroicons/react/24/solid";
import { VideoPlayer } from "@/components/VideoPlayer";
import BookCallDialog from "./BookCallDialog";
import { cn } from "~/lib/utils";
import { AnimatePresence } from "framer-motion";
import ExpandTransition from "~/components/ExpandTransition";
import { api } from "~/trpc/react";
import axios from "axios";
import { type ChatMessage } from "~/lib/types";
import Spinner from "~/components/Spinner";

export default function LandingPageBody() {
  const [state, setState] = useState<"initial" | "chat">("initial");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  // const { openSignIn } = useClerk();
  // const { isSignedIn } = useAuth();

  const posthog = usePostHog();
  const [text, setText] = useState("");

  const chatHistoryRef = useRef<HTMLDivElement>(null);

  const { mutateAsync: sendServerIsDownEmail } =
    api.email.sendServerIsDownEmail.useMutation();
  const { mutateAsync: serverBackUp } = api.email.serverBackUp.useMutation();

  // const { data: user, refetch: refetchUser } = api.user.getProfile.useQuery();
  // const { mutateAsync: generate } = api.user.generate.useMutation({
  //   onSuccess: () => {
  //     void refetchUser();
  //   },
  // });
  // const [generationsLeft, setGenerationsLeft] = useState(0);
  // useEffect(() => {
  //   void refetchUser();
  // }, [isSignedIn, refetchUser]);
  // useEffect(() => {
  //   if (user) {
  //     setGenerationsLeft(user.generationsLeft);
  //   }
  // }, [user]);

  // Function to scroll to bottom of chat history
  const scrollToBottom = () => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTo({
        top: chatHistoryRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const [isBackendDown, setIsBackendDown] = useState(false);
  useEffect(() => {
    if (!sendServerIsDownEmail) return;

    const checkIsBackendDown = async () => {
      await axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}`, { timeout: 1500 })
        .then(() => {
          void serverBackUp();
          setIsBackendDown(false);
        })
        .catch(() => {
          void sendServerIsDownEmail();
          setIsBackendDown(true);
        });
    };
    void checkIsBackendDown();
  }, [sendServerIsDownEmail, serverBackUp]);

  const [isServerFull, setIsServerFull] = useState(false);
  const checkIsServerFull = useCallback(async () => {
    try {
      const res: { data: { status: "OK" | "FULL" } } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/status`,
      );
      if (res.data.status === "FULL") {
        setIsServerFull(true);

        // check again in 1 second
        setTimeout(() => {
          void checkIsServerFull();
        }, 1000);

        return true;
      } else {
        setIsServerFull(false);
        return false;
      }
    } catch (error) {
      console.error("Error checking server status:", error);
      return false;
    }
  }, []);

  const callGenerate = useCallback(async () => {
    const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/generate`;
    console.log("calling generate with", endpoint);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as { hls_playlist_url: string };

      if (!data.hls_playlist_url) {
        throw new Error("No HLS playlist URL in the response");
      }
      return data.hls_playlist_url.toString().trim();
    } catch (error) {
      console.error("Error calling generate API:", error);
      // You might want to set an error state here or show a toast notification
      // For example: setError("Failed to generate video. Please try again.");
    }
  }, [text]);

  // Scroll to bottom on mount and when chat history changes
  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    });
  }, [chatHistory, chatHistoryRef.current?.scrollHeight]);

  const handleSubmit = useCallback(async () => {
    if (text.length > 0) {
      if (isBackendDown) {
        setBookCallDialogOpen(true);
        return;
      }

      // [TEMPORARILY DISABLED]
      // if (false) {
      //   // If not signed in, check if the user has submitted a prompt before
      //   if (!isSignedIn) {
      //     const promptsSubmitted = localStorage.getItem("promptsSubmitted");
      //     // If the user has not submitted a prompt before, allow them to submit 1 prompt
      //     // Otherwise, open the sign in modal
      //     if (!promptsSubmitted) {
      //       localStorage.setItem("promptsSubmitted", "1");
      //     } else {
      //       const promptsSubmittedInt = parseInt(promptsSubmitted);
      //       if (promptsSubmittedInt >= ANONYMOUS_PROMPT_SUBMISSION_LIMIT) {
      //         openSignIn({
      //           redirectUrl: "/",
      //           forceRedirectUrl: "/",
      //           signUpForceRedirectUrl: "/",
      //         });
      //         // setBookCallDialogOpen(true);
      //         return;
      //       }
      //       localStorage.setItem(
      //         "promptsSubmitted",
      //         (promptsSubmittedInt + 1).toString(),
      //       );
      //     }
      //   } else if (isSignedIn && user && user.generationsLeft <= 0) {
      //     setTimeout(() => {
      //       setBookCallDialogOpen(true);
      //     });
      //     return;
      //   }
      // }

      posthog.capture("Landing page prompt submitted", {
        prompt: text,
      });
      setChatHistory((old) => [...old, { type: "message", message: text }]);
      setText("");

      if (state === "initial") {
        setState("chat");
      }

      // Decrease generations left
      // if (isSignedIn && user) {
      //   setGenerationsLeft((old) => old - 1);
      //   void generate();
      // }

      const isFull = await checkIsServerFull();
      if (isFull) {
        return;
      }

      // call API
      const url = await callGenerate();
      if (url) {
        setChatHistory((old) => [...old, { type: "video", videoUrl: url }]);
      }
      setTimeout(() => {
        scrollToBottom();
      }, 300);
    }
  }, [text, isBackendDown, posthog, state, checkIsServerFull, callGenerate]);

  const [bookCallDialogOpen, setBookCallDialogOpen] = useState(false);

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
              {chatHistory.map((item: ChatMessage, i: number) => {
                if (item.type === "message") {
                  if (item.message === undefined) {
                    console.error("Message is undefined for item:", item);
                    return null;
                  }
                  return (
                    <div
                      key={i}
                      className="mb-2 flex w-full flex-col items-end gap-0.5"
                    >
                      <div className="inline-block rounded-lg bg-neutral-700 px-4 py-3 text-base text-white">
                        {item.message}
                      </div>
                    </div>
                  );
                } else if (item.type === "video") {
                  if (item.videoUrl === undefined) {
                    console.error("Video URL is undefined for item:", item);
                    return null;
                  }
                  return (
                    <AnimatePresence key={i}>
                      <ExpandTransition buffer={100}>
                        <VideoPlayer
                          className="mb-4 w-full"
                          hls_playlist_url={item.videoUrl}
                        />
                      </ExpandTransition>
                    </AnimatePresence>
                  );
                }
              })}
            </div>
            <LandingPageTextField
              className="mb-2"
              autoFocus
              disabled={isServerFull}
              placeholder="ask pixa anything"
              text={text}
              onChange={setText}
              onSubmit={handleSubmit}
            />
            <div className="mb-6 rounded-lg text-muted-foreground">
              {isServerFull ? (
                <div className="flex items-center gap-3">
                  <Spinner />
                  too many people using pixa rn :0. textbox will be enabled once
                  there is capacity !
                </div>
              ) : (
                <>
                  generated something cool? submit it us at{" "}
                  <a
                    className="font-medium underline"
                    href="mailto:contact@pixa.dev?subject=super%20cool%20pixa%20video&body=here's%20the%20super%20cool%20video%20i%20generated%20with%20pixa:%0A%0A[please%20attach%20a%20screen%20recording]"
                    target="_blank"
                  >
                    contact@pixa.dev
                  </a>
                  . person with the coolest video gets{" "}
                  <span className="font-medium">$100</span> (we&apos;re not
                  kidding).
                </>
              )}
            </div>
            {/* {isSignedIn && (
              <div className="text-muted-foreground">
                you have {generationsLeft} animation generations left.
              </div>
            )} */}
          </div>
        )}
      </div>
      <BookCallDialog
        title={
          isBackendDown
            ? "we're currently experiencing high traffic :\\"
            : undefined
        }
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
        pixa.dev: the real-time AI text to animation api
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
  disabled,
  className,
  placeholder,
}: {
  text: string;
  onChange: (text: string) => void;
  onSubmit: () => void;

  autoFocus?: boolean;
  disabled?: boolean;
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
          disabled={disabled}
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
          className="absolute right-2 top-1/2 size-10 -translate-y-1/2 text-neutral-400 enabled:hover:cursor-pointer enabled:hover:text-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled}
          onClick={handleSubmit}
        >
          <ArrowRightCircleIcon />
        </button>
      </div>
    </div>
  );
};
