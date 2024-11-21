"use client";

import { type CallWithIncludes } from "~/lib/types";
import { cn, didCallSucceed } from "~/lib/utils";
import Image from "next/image";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import Spinner from "../Spinner";
import { type AudioPlayerRef } from "./AudioPlayer";
import { CallStatus } from "@prisma/client";
import { useAudio } from "../hooks/useAudio";

interface CallHeaderProps {
  call: CallWithIncludes;
  avatarUrl: string;
  audioPlayerRef: React.RefObject<AudioPlayerRef>;
  activeEvalResultId: string | null;
  setActiveEvalResultId: (id: string | null) => void;
}

export function TestCallHeader({
  call,
  avatarUrl,
  audioPlayerRef,
  activeEvalResultId,
  setActiveEvalResultId,
}: CallHeaderProps) {
  const { play } = useAudio();

  return (
    <div className="flex items-center gap-4 pb-4">
      <div className="size-[48px] shrink-0">
        <Image
          src={avatarUrl}
          alt="agent avatar"
          width={48}
          height={48}
          className="rounded-full"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">{call.scenario?.name}</div>
          {call.status === CallStatus.completed && call.result && (
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
  );
}

export function LatencyCallHeader({
  call,
  avatarUrl,
  audioPlayerRef,
  activeEvalResultId,
  setActiveEvalResultId,
}: CallHeaderProps) {
  const { play } = useAudio();

  return (
    <div className="flex items-center gap-4 pb-4">
      <div className="size-[48px] shrink-0">
        <Image
          src={avatarUrl}
          alt="agent avatar"
          width={48}
          height={48}
          className="rounded-full"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">{call.scenario?.name}</div>
          {call.status === CallStatus.completed && call.result && (
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
  );
}
