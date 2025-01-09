import {
  type CallWithIncludes,
  type EvaluationResultWithIncludes,
} from "@repo/types/src/index";
import { cn, getInterruptionColor, getLatencyBlockColor } from "~/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

interface BaseVisualizationProps {
  duration: number;
  offsetFromStart?: number;
  hoveredEvalResult: string | null;
  onEvalResultHover?: (evalId: string | null) => void;
  onSeek?: (time: number) => void;
  onPlay?: () => void;
}

interface EvaluationResultProps extends BaseVisualizationProps {
  type: "evaluationResult";
  data: EvaluationResultWithIncludes;
  onEvalResultClick?: (evalResult: EvaluationResultWithIncludes) => void;
}

interface LatencyBlockProps extends BaseVisualizationProps {
  type: "latencyBlock";
  data: CallWithIncludes["latencyBlocks"][0];
}

interface InterruptionProps extends BaseVisualizationProps {
  type: "interruption";
  data: CallWithIncludes["interruptions"][0];
}

type AudioVisualizationBlockProps =
  | EvaluationResultProps
  | LatencyBlockProps
  | InterruptionProps;

export function AudioVisualizationBlock({
  type,
  data,
  duration,
  offsetFromStart = 0,
  hoveredEvalResult,
  onEvalResultHover,
  onSeek,
  onPlay,
  ...props
}: AudioVisualizationBlockProps) {
  if (!data.secondsFromStart || !data.duration) return null;

  const startPercentage =
    Math.min(
      1,
      Math.max(
        0,
        (data.secondsFromStart -
          (type === "evaluationResult" ? offsetFromStart : 0)) /
          duration,
      ),
    ) * 100;
  const endPercentage =
    Math.min(
      1,
      Math.max(
        0,
        (data.secondsFromStart +
          data.duration -
          (type === "evaluationResult" ? offsetFromStart : 0)) /
          duration,
      ),
    ) * 100;

  if (type === "evaluationResult") {
    const { onEvalResultClick } = props as EvaluationResultProps;
    return (
      <div
        className="absolute top-0 z-10 h-full"
        style={{
          left: `${startPercentage}%`,
          width: `${endPercentage - startPercentage}%`,
        }}
      >
        <div
          className={cn(
            "size-full cursor-pointer border-l-2",
            data.success
              ? "border-green-500 bg-green-500/20 hover:bg-green-500/50"
              : "border-red-500 bg-red-500/20 hover:bg-red-500/50",
            hoveredEvalResult === data.id &&
              (data.success ? "bg-green-500/50" : "bg-red-500/50"),
          )}
          onMouseEnter={() => onEvalResultHover?.(data.id)}
          onMouseLeave={() => onEvalResultHover?.(null)}
          onClick={(e) => {
            e.stopPropagation();
            onEvalResultClick?.(data);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
        />
      </div>
    );
  }

  if (type === "latencyBlock") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="absolute top-0 z-10 h-full cursor-pointer"
            style={{
              left: `${startPercentage}%`,
              width: `${endPercentage - startPercentage}%`,
              background:
                hoveredEvalResult === data.id
                  ? getLatencyBlockColor(data, 0.5)
                  : getLatencyBlockColor(data),
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSeek?.(data.secondsFromStart);
              onPlay?.();
            }}
          >
            <div
              className="size-full"
              style={{
                border: `1px solid ${getLatencyBlockColor(data, 1)}`,
              }}
              onMouseEnter={() => onEvalResultHover?.(data.id)}
              onMouseLeave={() => onEvalResultHover?.(null)}
            />
            <div className="absolute left-0 top-0 h-full w-1 cursor-col-resize" />
            <div className="absolute right-0 top-0 h-full w-1 cursor-col-resize" />
          </div>
        </TooltipTrigger>
        <TooltipContent
          style={{
            backgroundColor: "white",
            border: `1px solid ${getLatencyBlockColor(data, 1)}`,
            color: getLatencyBlockColor(data, 1),
          }}
        >
          <p>latency: {Math.round(data.duration * 1000)}ms</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  if (type === "interruption") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="absolute top-0 z-10 h-full cursor-pointer"
            style={{
              top: "50%",
              height: "50%",
              left: `${startPercentage}%`,
              width: `${endPercentage - startPercentage}%`,
              background:
                hoveredEvalResult === data.id
                  ? getInterruptionColor(0.5)
                  : getInterruptionColor(),
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSeek?.(data.secondsFromStart);
              onPlay?.();
            }}
          >
            <div
              className="size-full"
              style={{
                border: `1px solid ${getInterruptionColor(1)}`,
              }}
              onMouseEnter={() => onEvalResultHover?.(data.id)}
              onMouseLeave={() => onEvalResultHover?.(null)}
            />
            <div className="absolute left-0 top-0 h-full w-1 cursor-col-resize" />
            <div className="absolute right-0 top-0 h-full w-1 cursor-col-resize" />
          </div>
        </TooltipTrigger>
        <TooltipContent
          style={{
            backgroundColor: "white",
            border: `1px solid ${getInterruptionColor(1)}`,
            color: getInterruptionColor(1),
          }}
        >
          <p>interruption: {Math.round(data.duration * 1000)}ms</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return null;
}
