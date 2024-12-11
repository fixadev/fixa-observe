"use client";

import {
  type EvalResultWithIncludes,
  type CallWithIncludes,
  type AggregateEvalResult,
} from "@repo/types/src/index";
import { cn, didCallSucceed, getLatencyColor } from "~/lib/utils";
import Image from "next/image";
import Spinner from "../Spinner";
import { type AudioPlayerRef } from "./AudioPlayer";
import { CallStatus } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { useCallback, useMemo } from "react";
import { CopyText } from "../CopyText";
import EvalResultChip from "./EvalResultChip";

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

  const aggregateEvalResults = useMemo<AggregateEvalResult[]>(() => {
    if (!call.evalResults) return [];

    const evalIdToResults = new Map<string, EvalResultWithIncludes[]>();
    for (const evalResult of call.evalResults) {
      if (!evalIdToResults.has(evalResult.evalId)) {
        evalIdToResults.set(evalResult.evalId, [evalResult]);
      } else {
        evalIdToResults.get(evalResult.evalId)?.push(evalResult);
      }
    }

    return Array.from(evalIdToResults.values()).map((results) => {
      const details = results.reduce(
        (acc, curr) => {
          acc.numSucceeded += curr.success ? 1 : 0;
          acc.total++;
          return acc;
        },
        { numSucceeded: 0, total: 0 },
      );
      return {
        ...results[0]!,
        ...details,
      };
    });
  }, [call.evalResults]);

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
              : call.status === CallStatus.in_progress
                ? "call in progress..."
                : "call queued..."}
          </div>
        )}
        <div className="flex w-fit flex-row flex-wrap gap-2">
          {aggregateEvalResults.map((evalResult) => (
            <EvalResultChip
              key={evalResult.id}
              aggregateEvalResult={evalResult}
              isActive={activeEvalResultId === evalResult.id}
              editHref={`/dashboard/${agentId}/scenarios?scenarioId=${call.scenarioId}&evalId=${evalResult.eval.id}`}
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
            />
          ))}
        </div>
        {call.ofOneDeviceId && (
          <div className="flex flex-row items-center gap-2 text-xs text-muted-foreground">
            <div className="shrink-0 text-sm">device ID: </div>
            <CopyText
              className="w-fit p-1"
              size="xs"
              text={call.ofOneDeviceId}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function LatencyCallHeader({
  call,
  audioPlayerRef,
  activeEvalResultId,
  setActiveEvalResultId,
}: CallHeaderProps) {
  const play = useCallback(() => {
    audioPlayerRef.current?.play();
  }, [audioPlayerRef]);

  const aggregateEvalResults = useMemo<AggregateEvalResult[]>(() => {
    if (!call.evalResults) return [];

    const evalIdToResults = new Map<string, EvalResultWithIncludes[]>();
    for (const evalResult of call.evalResults) {
      if (!evalIdToResults.has(evalResult.evalId)) {
        evalIdToResults.set(evalResult.evalId, [evalResult]);
      } else {
        evalIdToResults.get(evalResult.evalId)?.push(evalResult);
      }
    }

    return Array.from(evalIdToResults.values()).map((results) => {
      const details = results.reduce(
        (acc, curr) => {
          acc.numSucceeded += curr.success ? 1 : 0;
          acc.total++;
          return acc;
        },
        { numSucceeded: 0, total: 0 },
      );
      return {
        ...results[0]!,
        ...details,
      };
    });
  }, [call.evalResults]);

  return (
    <div className="flex items-center gap-4 pb-4">
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex flex-1 flex-col gap-2">
          <div className="text-sm font-medium">{call.customerCallId}</div>
          <div className="flex w-fit flex-row flex-wrap gap-2">
            {aggregateEvalResults.map((evalResult) => (
              <EvalResultChip
                key={evalResult.id}
                aggregateEvalResult={evalResult}
                isActive={activeEvalResultId === evalResult.id}
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
              />
            ))}
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center gap-4 text-muted-foreground">
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
        <div className="flex flex-1 justify-end text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(), { addSuffix: true })}
        </div>
      </div>
    </div>
  );
}
