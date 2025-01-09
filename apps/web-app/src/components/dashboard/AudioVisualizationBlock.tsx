import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  onEditBlock?: (
    blockId: string,
    secondsFromStart: number,
    duration: number,
  ) => void;
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

interface DragState {
  isDragging: boolean;
  initialX: number;
  edge: "left" | "right" | "center" | null;
}

export function AudioVisualizationBlock({
  type,
  data,
  duration,
  offsetFromStart = 0,
  hoveredEvalResult,
  onEvalResultHover,
  onEditBlock,
  ...props
}: AudioVisualizationBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    initialX: 0,
    edge: null,
  });
  const [startPercentage, setStartPercentage] = useState<number>(0);
  const [endPercentage, setEndPercentage] = useState<number>(0);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  // Update start and end percentages when data changes
  const resetStartPercentage = useCallback(() => {
    setStartPercentage(
      Math.min(
        1,
        Math.max(
          0,
          ((data.secondsFromStart ?? 0) -
            (type === "evaluationResult" ? offsetFromStart : 0)) /
            duration,
        ),
      ) * 100,
    );
  }, [data.secondsFromStart, offsetFromStart, duration, type]);
  const resetEndPercentage = useCallback(() => {
    setEndPercentage(
      Math.min(
        1,
        Math.max(
          0,
          ((data.secondsFromStart ?? 0) +
            (data.duration ?? 0) -
            (type === "evaluationResult" ? offsetFromStart : 0)) /
            duration,
        ),
      ) * 100,
    );
  }, [data.duration, data.secondsFromStart, duration, offsetFromStart, type]);
  useEffect(() => {
    resetStartPercentage();
  }, [resetStartPercentage]);
  useEffect(() => {
    resetEndPercentage();
  }, [resetEndPercentage]);

  const currentSecondsFromStart = useMemo(() => {
    return (startPercentage / 100) * duration;
  }, [startPercentage, duration]);
  const currentDuration = useMemo(() => {
    return ((endPercentage - startPercentage) / 100) * duration;
  }, [endPercentage, startPercentage, duration]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, edge: "left" | "right" | "center") => {
      e.stopPropagation();
      setDragState({
        isDragging: true,
        initialX: e.clientX,
        edge,
      });
    },
    [],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.isDragging || !containerRef.current) return;

      const parentRect =
        containerRef.current.parentElement?.getBoundingClientRect();
      if (!parentRect) return;

      const deltaX = e.clientX - dragState.initialX;
      const deltaPercentage = (deltaX / parentRect.width) * 100;

      if (dragState.edge === "center") {
        const blockWidth = endPercentage - startPercentage;
        const newStart = Math.max(
          0,
          Math.min(100 - blockWidth, startPercentage + deltaPercentage),
        );
        const newEnd = newStart + blockWidth;
        setStartPercentage(newStart);
        setEndPercentage(newEnd);
      } else if (dragState.edge === "left") {
        const newStart = Math.max(
          0,
          Math.min(endPercentage - 1, startPercentage + deltaPercentage),
        );
        setStartPercentage(newStart);
      } else if (dragState.edge === "right") {
        const newEnd = Math.min(
          100,
          Math.max(startPercentage + 1, endPercentage + deltaPercentage),
        );
        setEndPercentage(newEnd);
      }

      setDragState((prev) => ({
        ...prev,
        initialX: e.clientX,
      }));
    },
    [dragState, containerRef, endPercentage, startPercentage],
  );

  const handleMouseUp = useCallback(() => {
    if (dragState.isDragging) {
      onEditBlock?.(data.id, currentSecondsFromStart, currentDuration);
      setTimeout(() => {
        setDragState({ isDragging: false, initialX: 0, edge: null });
      }, 0);
    }
  }, [
    dragState.isDragging,
    onEditBlock,
    data.id,
    currentSecondsFromStart,
    currentDuration,
  ]);

  useEffect(() => {
    if (dragState.isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragState.isDragging]);

  if (!data.secondsFromStart || !data.duration) return null;

  if (type === "evaluationResult") {
    const { onEvalResultClick } = props as EvaluationResultProps;
    return (
      <div
        ref={containerRef}
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
      <Tooltip
        open={tooltipOpen || dragState.isDragging}
        onOpenChange={setTooltipOpen}
      >
        <TooltipTrigger asChild>
          <div
            ref={containerRef}
            className={cn(
              "absolute top-0 z-10 h-full cursor-pointer",
              dragState.isDragging &&
                (dragState.edge === "center"
                  ? "cursor-grabbing"
                  : "cursor-col-resize"),
              !dragState.isDragging && "cursor-grab",
            )}
            style={{
              left: `${startPercentage}%`,
              width: `${endPercentage - startPercentage}%`,
              background:
                hoveredEvalResult === data.id
                  ? getLatencyBlockColor(data, 0.5)
                  : getLatencyBlockColor(data),
            }}
            onMouseDown={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const leftEdge = e.clientX - rect.left < 8;
              const rightEdge = rect.right - e.clientX < 8;
              if (!leftEdge && !rightEdge) {
                handleMouseDown(e, "center");
              }
            }}
          >
            <div
              className="size-full"
              style={{
                border: `1px solid ${getLatencyBlockColor(data, 1)}`,
              }}
              onMouseEnter={() =>
                !dragState.isDragging && onEvalResultHover?.(data.id)
              }
              onMouseLeave={() =>
                !dragState.isDragging && onEvalResultHover?.(null)
              }
            />
            <div
              className="absolute left-0 top-0 h-full w-1 cursor-col-resize"
              onMouseDown={(e) => handleMouseDown(e, "left")}
            />
            <div
              className="absolute right-0 top-0 h-full w-1 cursor-col-resize"
              onMouseDown={(e) => handleMouseDown(e, "right")}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent
          style={{
            backgroundColor: "white",
            border: `1px solid ${getLatencyBlockColor(data, 1)}`,
            color: getLatencyBlockColor(data, 1),
          }}
        >
          <p>latency: {Math.round(currentDuration * 1000)}ms</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  if (type === "interruption") {
    return (
      <Tooltip
        open={tooltipOpen || dragState.isDragging}
        onOpenChange={setTooltipOpen}
      >
        <TooltipTrigger asChild>
          <div
            ref={containerRef}
            className={cn(
              "absolute top-0 z-10 h-full cursor-pointer",
              dragState.isDragging &&
                (dragState.edge === "center"
                  ? "cursor-grabbing"
                  : "cursor-col-resize"),
              !dragState.isDragging && "cursor-grab",
            )}
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
            onMouseDown={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const leftEdge = e.clientX - rect.left < 8;
              const rightEdge = rect.right - e.clientX < 8;
              if (!leftEdge && !rightEdge) {
                handleMouseDown(e, "center");
              }
            }}
          >
            <div
              className="size-full"
              style={{
                border: `1px solid ${getInterruptionColor(1)}`,
              }}
              onMouseEnter={() =>
                !dragState.isDragging && onEvalResultHover?.(data.id)
              }
              onMouseLeave={() =>
                !dragState.isDragging && onEvalResultHover?.(null)
              }
            />
            <div
              className="absolute left-0 top-0 h-full w-1 cursor-col-resize"
              onMouseDown={(e) => handleMouseDown(e, "left")}
            />
            <div
              className="absolute right-0 top-0 h-full w-1 cursor-col-resize"
              onMouseDown={(e) => handleMouseDown(e, "right")}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent
          style={{
            backgroundColor: "white",
            border: `1px solid ${getInterruptionColor(1)}`,
            color: getInterruptionColor(1),
          }}
        >
          <p>interruption: {Math.round(currentDuration * 1000)}ms</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return null;
}
