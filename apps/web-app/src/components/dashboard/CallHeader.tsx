"use client";

import { type CallWithIncludes } from "~/lib/types";
import { cn, didCallSucceed, getLatencyColor } from "~/lib/utils";
import Image from "next/image";
import {
  CheckCircleIcon,
  PencilIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import Spinner from "../Spinner";
import { type AudioPlayerRef } from "./AudioPlayer";
import { CallStatus } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useCallback } from "react";

interface CallHeaderProps {
  call: CallWithIncludes;
  avatarUrl: string;
  audioPlayerRef: React.RefObject<AudioPlayerRef>;
  activeEvalResultId: string | null;
  setActiveEvalResultId: (id: string | null) => void;
  agentId?: string;
}

export function TestCallHeader({
  call,
  avatarUrl,
  audioPlayerRef,
  activeEvalResultId,
  setActiveEvalResultId,
  agentId,
}: CallHeaderProps) {
  const play = useCallback(() => {
    audioPlayerRef.current?.play();
  }, [audioPlayerRef]);

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
                "group flex cursor-pointer items-start gap-1 border-l-2 p-1 pl-1 text-xs",
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
              <Link
                href={`/dashboard/${agentId}/scenarios?scenarioId=${call.scenarioId}&evalId=${evalResult.eval.id}`}
              >
                <PencilIcon
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                  }}
                  onMouseLeave={(e) => {
                    e.stopPropagation();
                  }}
                  className="size-4 shrink-0 cursor-pointer text-muted-foreground/70 opacity-0 transition-opacity hover:text-muted-foreground group-hover:opacity-100"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LatencyCallHeader({ call, avatarUrl }: CallHeaderProps) {
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
      <div className="flex w-full items-center justify-between gap-2">
        <div className="text-sm font-medium">{call.customerCallId}</div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <div>
            <div className="text-xs font-medium">50%</div>
            <div
              className={cn(
                "text-base font-medium",
                getLatencyColor(call.latencyP50 ?? 0),
              )}
            >
              {Math.round(call.latencyP50 ?? 0)}ms
            </div>
          </div>
          <div>
            <div className="text-xs font-medium">90%</div>
            <div
              className={cn(
                "text-base font-medium",
                getLatencyColor(call.latencyP90 ?? 0),
              )}
            >
              {Math.round(call.latencyP90 ?? 0)}ms
            </div>
          </div>
          <div>
            <div className="text-xs font-medium">95%</div>
            <div
              className={cn(
                "text-base font-medium",
                getLatencyColor(call.latencyP95 ?? 0),
              )}
            >
              {Math.round(call.latencyP95 ?? 0)}ms
            </div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(), { addSuffix: true })}
        </div>
      </div>
    </div>
  );
}
