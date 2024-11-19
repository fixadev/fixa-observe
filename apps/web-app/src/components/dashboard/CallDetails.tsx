import type { CallWithIncludes, EvalResultWithIncludes } from "~/lib/types";
import AudioPlayer, { type AudioPlayerRef } from "./AudioPlayer";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import {
  cn,
  didCallSucceed,
  formatDurationHoursMinutesSeconds,
} from "~/lib/utils";
import { useAudio } from "~/components/hooks/useAudio";
import { type Agent } from "prisma/generated/zod";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { CallStatus, Role } from "@prisma/client";
import Spinner from "../Spinner";
import { EvalResultCard } from "./EvalResultCard";

export default function CallDetails({
  call,
  agent,
}: {
  call: CallWithIncludes;
  agent: Agent;
}) {
  const audioPlayerRef = useRef<AudioPlayerRef>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastActiveIndexRef = useRef(-1);
  const [activeEvalResultId, setActiveEvalResultId] = useState<string | null>(
    null,
  );
  const { play, seek, currentTime } = useAudio();
  const headerRef = useRef<HTMLDivElement>(null);

  const messagesFiltered = useMemo(() => {
    return call.messages.filter((m) => m.role !== "system");
  }, [call.messages]);

  // Offset from the start of the call to the first message
  const offsetFromStart = useMemo(() => {
    return messagesFiltered[0]?.secondsFromStart ?? 0;
  }, [messagesFiltered]);

  // Index of the currently active message
  const activeMessageIndex = useMemo(() => {
    return messagesFiltered.findIndex((message, index) => {
      const messageStart = message.secondsFromStart - offsetFromStart;
      const nextMessage = messagesFiltered[index + 1];
      const nextMessageStart = nextMessage?.secondsFromStart
        ? nextMessage.secondsFromStart - offsetFromStart
        : Infinity;

      return currentTime >= messageStart && currentTime < nextMessageStart;
    });
  }, [currentTime, messagesFiltered, offsetFromStart]);

  const scrollMessageIntoView = useCallback((messageIndex: number) => {
    if (!scrollContainerRef.current || !headerRef.current) return;
    const messageElements = scrollContainerRef.current.children;
    const activeElement = messageElements[messageIndex];

    if (activeElement) {
      const elementRect = activeElement.getBoundingClientRect();
      const header = headerRef.current.getBoundingClientRect();
      const isAboveViewport = elementRect.top < header.bottom;
      const isBelowViewport = elementRect.bottom > window.innerHeight;

      if (isAboveViewport || isBelowViewport) {
        const headerTopOffset = 60;
        const scrollPosition =
          window.scrollY + elementRect.top - header.height - headerTopOffset;
        window.scrollTo({
          top: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  }, []);

  const activeEvalMessageIndices = useMemo(() => {
    if (!activeEvalResultId || !call.evalResults) return new Set<number>();

    const activeEval = call.evalResults.find(
      (evalResult) => evalResult.id === activeEvalResultId,
    );
    if (!activeEval) return new Set<number>();

    const overlappingIndices = new Set<number>();
    let wordCount = 0;

    // Calculate word offsets for each message
    messagesFiltered.forEach((message, index) => {
      const messageWordCount = message.message.split(" ").length;
      const messageStartWord = wordCount;
      const messageEndWord = wordCount + messageWordCount;

      // Check if the eval's word range overlaps with this message
      if (
        activeEval.wordIndexStart &&
        activeEval.wordIndexEnd &&
        activeEval.wordIndexStart < messageEndWord &&
        activeEval.wordIndexEnd >= messageStartWord
      ) {
        overlappingIndices.add(index);
      }

      wordCount += messageWordCount;
    });

    return overlappingIndices;
  }, [activeEvalResultId, call, messagesFiltered]);

  // Scroll to the active eval message if it has changed
  useEffect(() => {
    if (activeEvalMessageIndices.size > 0) {
      const firstIndex = Array.from(activeEvalMessageIndices)[0];
      if (typeof firstIndex === "number") {
        scrollMessageIntoView(firstIndex);
      }
    }
  }, [activeEvalMessageIndices, scrollMessageIntoView]);

  // Scroll to the active message if it has changed
  useEffect(() => {
    if (
      activeMessageIndex !== -1 &&
      activeMessageIndex !== lastActiveIndexRef.current &&
      scrollContainerRef.current
    ) {
      scrollMessageIntoView(activeMessageIndex);
      lastActiveIndexRef.current = activeMessageIndex;
    }
  }, [activeMessageIndex, scrollMessageIntoView]);

  const messageEvalsMap = useMemo(() => {
    if (!call.evalResults) {
      return new Map<number, EvalResultWithIncludes[]>();
    }

    const messageMap = new Map<number, EvalResultWithIncludes[]>();
    let wordCount = 0;

    // First pass: calculate cumulative word count for each message
    const messageWordOffsets = messagesFiltered.map((message) => {
      const currentOffset = wordCount;
      wordCount += message.message.split(" ").length;
      return currentOffset;
    });

    // Process each eval result to create word-level mappings
    call.evalResults?.forEach((evalResult) => {
      // Find which message(s) this eval spans

      // Find which messages this eval result belongs to
      messagesFiltered.forEach((message, messageIndex) => {
        const messageStartWord = messageWordOffsets[messageIndex]!;
        const messageEndWord =
          messageIndex < messageWordOffsets.length - 1
            ? messageWordOffsets[messageIndex + 1]!
            : wordCount;

        // Check if this eval result overlaps with this message
        if (
          evalResult.wordIndexStart &&
          evalResult.wordIndexEnd &&
          evalResult.wordIndexStart < messageEndWord &&
          evalResult.wordIndexEnd >= messageStartWord
        ) {
          const existing = messageMap.get(messageIndex) ?? [];
          messageMap.set(messageIndex, [...existing, evalResult]);
        }
      });
    });

    return messageMap;
  }, [call, messagesFiltered]);

  // Update the splitMessageByEvals function to account for global word indices
  const splitMessageByEvals = useCallback(
    (
      message: string,
      evalResults: EvalResultWithIncludes[],
      messageIndex: number,
    ): { word: string; evalResult?: EvalResultWithIncludes }[] => {
      if (!evalResults.length)
        return message.split(" ").map((word) => ({ word }));

      let wordOffset = 0;
      messagesFiltered.slice(0, messageIndex).forEach((msg) => {
        wordOffset += msg.message.split(" ").length;
      });

      const words = message.split(" ");
      const result: { word: string; evalResult?: EvalResultWithIncludes }[] =
        words.map((word, idx) => {
          const globalWordIndex = wordOffset + idx;
          const matchingEval = evalResults.find((evalResult) => {
            if (!evalResult.wordIndexStart || !evalResult.wordIndexEnd)
              return false;
            return (
              globalWordIndex >= evalResult.wordIndexStart &&
              globalWordIndex <= evalResult.wordIndexEnd
            );
          });
          return { word, evalResult: matchingEval };
        });

      return result;
    },
    [messagesFiltered],
  );

  return (
    <div className="flex w-full flex-col rounded-md bg-background px-4 outline-none">
      <div
        ref={headerRef}
        className="sticky top-[calc(3.5rem+1px)] bg-background py-4"
      >
        {/* CALL ID: {call.id} */}
        <div className="flex items-center gap-4 pb-4">
          <div className="size-[48px] shrink-0">
            <Image
              src={call.testAgent?.headshotUrl ?? ""}
              alt="agent avatar"
              width={48}
              height={48}
              className="rounded-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium">{call.scenario?.name}</div>
              {call.status === CallStatus.completed && (
                <div
                  className={cn(
                    "w-fit rounded-full px-2 py-1 text-xs",
                    didCallSucceed(call) ? "bg-green-100" : "bg-red-100",
                  )}
                >
                  {didCallSucceed(call) ? "succeeded" : "failed"}
                </div>
              )}
            </div>
            {call.status !== CallStatus.completed && (
              <div className="-mt-1 flex items-center gap-2 text-sm italic text-muted-foreground">
                <Spinner className="size-4" />{" "}
                {call.status === CallStatus.analyzing
                  ? "analyzing call..."
                  : "call in progress..."}
              </div>
            )}
            <div className="flex w-fit flex-row flex-wrap gap-2">
              {call.evalResults?.map((evalResult) => (
                <div
                  key={evalResult.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-1 border-l-2 p-1 pl-1 text-xs",
                    evalResult.success
                      ? "border-green-500 bg-green-100 text-green-500 hover:bg-green-200"
                      : "border-red-500 bg-red-100 text-red-500 hover:bg-red-200",
                    activeEvalResultId === evalResult.id &&
                      (evalResult.success ? "bg-green-200" : "bg-red-200"),
                  )}
                  onMouseEnter={() => {
                    setActiveEvalResultId(evalResult.id);
                    audioPlayerRef.current?.setHoveredEvalResult(evalResult.id);
                  }}
                  onMouseLeave={() => {
                    setActiveEvalResultId(null);
                    audioPlayerRef.current?.setHoveredEvalResult(null);
                  }}
                  onClick={() => {
                    audioPlayerRef.current?.setActiveEvalResult(evalResult);
                    play();
                  }}
                >
                  {evalResult.success ? (
                    <CheckCircleIcon className="size-4 shrink-0 text-green-500" />
                  ) : (
                    <XCircleIcon className="size-4 shrink-0 text-red-500" />
                  )}
                  {evalResult.eval.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        {call.status === CallStatus.completed && (
          <AudioPlayer
            ref={audioPlayerRef}
            call={call}
            offsetFromStart={offsetFromStart}
            onEvalResultHover={(evalId) => {
              setActiveEvalResultId(evalId);
            }}
          />
        )}
      </div>

      <div ref={scrollContainerRef} className="-mx-4 flex flex-1 flex-col px-4">
        {messagesFiltered.map((message, index) => {
          return (
            <div key={index} className="flex gap-2">
              <div className="mt-2 w-8 shrink-0 text-xs text-muted-foreground">
                {message.role !== Role.tool_calls &&
                message.role !== Role.tool_call_result
                  ? formatDurationHoursMinutesSeconds(
                      message.secondsFromStart - offsetFromStart,
                    )
                  : ""}
              </div>
              <div className="flex flex-1 flex-col">
                <div
                  onClick={() => {
                    if (
                      message.role === Role.tool_calls ||
                      message.role === Role.tool_call_result
                    ) {
                      return;
                    }
                    seek(message.secondsFromStart - offsetFromStart);
                    play();
                  }}
                  className={cn(
                    "flex-1 cursor-pointer rounded-md p-2 hover:bg-muted/30",
                    (message.role === Role.tool_calls ||
                      message.role === Role.tool_call_result) &&
                      "cursor-[unset] hover:bg-background",
                    activeMessageIndex === index
                      ? "bg-muted hover:bg-muted"
                      : "",
                  )}
                >
                  <div className="text-xs font-medium">
                    {message.role === Role.bot
                      ? call.testAgent?.name
                      : message.role === Role.user
                        ? agent.name
                        : ""}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {splitMessageByEvals(
                      message.message,
                      messageEvalsMap.get(index) ?? [],
                      index,
                    ).map((segment, i) => (
                      <Words
                        key={i}
                        word={segment.word}
                        evalResult={segment.evalResult}
                        activeEvalResultId={activeEvalResultId}
                        setActiveEvalResultId={setActiveEvalResultId}
                        audioPlayerRef={audioPlayerRef}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div className="h-10 shrink-0" />
      </div>

      <EvalResultCard
        evalResult={call.evalResults?.find((e) => e.id === activeEvalResultId)}
      />
    </div>
  );
}

function Words({
  word,
  evalResult,
  activeEvalResultId,
  setActiveEvalResultId,
  audioPlayerRef,
}: {
  word: string;
  evalResult?: EvalResultWithIncludes;
  activeEvalResultId: string | null;
  setActiveEvalResultId: (evalResultId: string | null) => void;
  audioPlayerRef: React.RefObject<AudioPlayerRef>;
}) {
  const { play } = useAudio();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation();
      if (evalResult) {
        audioPlayerRef.current?.setActiveEvalResult(evalResult);
        play();
      }
    },
    [audioPlayerRef, evalResult, play],
  );

  const handleMouseEnter = useCallback(() => {
    if (evalResult) {
      setActiveEvalResultId(evalResult.id);
      audioPlayerRef.current?.setHoveredEvalResult(evalResult.id);
    }
  }, [audioPlayerRef, evalResult, setActiveEvalResultId]);

  const handleMouseLeave = useCallback(() => {
    setActiveEvalResultId(null);
    audioPlayerRef.current?.setHoveredEvalResult(null);
  }, [audioPlayerRef, setActiveEvalResultId]);

  if (!evalResult) {
    return <span>{word} </span>;
  }

  return (
    <span
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "underline decoration-solid decoration-2 underline-offset-4",
        evalResult.success
          ? "bg-green-500/10 text-green-500 decoration-green-500 hover:bg-green-500/20"
          : "bg-red-500/10 text-red-500 decoration-red-500 hover:bg-red-500/20",
        activeEvalResultId === evalResult.id &&
          (evalResult.success ? "bg-green-500/20" : "bg-red-500/20"),
      )}
    >
      <span>{word}</span>{" "}
    </span>
  );
}
