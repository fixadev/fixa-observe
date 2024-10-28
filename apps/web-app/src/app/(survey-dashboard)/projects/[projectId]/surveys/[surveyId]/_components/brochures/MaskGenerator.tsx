import { useRef, useCallback, useMemo } from "react";
import { type BrochureRectangles } from "@/lib/property";
import { type Tool } from "./ToolSelector";

export default function MaskGenerator({
  isDrawing,
  setIsDrawing,
  pageIndex,
  rectangles,
  setRectangles,
  curRectangle,
  setCurRectangle,
  tool,
}: {
  isDrawing: boolean;
  setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
  pageIndex: number;
  rectangles: BrochureRectangles;
  setRectangles: React.Dispatch<React.SetStateAction<BrochureRectangles>>;
  curRectangle: BrochureRectangles[0] | null;
  setCurRectangle: React.Dispatch<
    React.SetStateAction<BrochureRectangles[0] | null>
  >;
  tool: Tool;
}) {
  const startPoint = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const pixelToPercentage = useCallback(
    (pixel: number, total: number): number => {
      return pixel / total;
    },
    [],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = pixelToPercentage(e.clientX - rect.left, rect.width);
        const y = pixelToPercentage(e.clientY - rect.top, rect.height);
        startPoint.current = { x, y };
        setIsDrawing(true);
        setCurRectangle({
          pageIndex,
          x,
          y,
          width: 0,
          height: 0,
        });
      }
    },
    [pageIndex, setIsDrawing, pixelToPercentage, setCurRectangle],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDrawing || !startPoint.current || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const endX = pixelToPercentage(e.clientX - rect.left, rect.width);
      const endY = pixelToPercentage(e.clientY - rect.top, rect.height);

      setCurRectangle({
        pageIndex: pageIndex,
        x: Math.min(startPoint.current.x, endX),
        y: Math.min(startPoint.current.y, endY),
        width: Math.abs(endX - startPoint.current.x),
        height: Math.abs(endY - startPoint.current.y),
      });
    },
    [isDrawing, pageIndex, pixelToPercentage, setCurRectangle],
  );

  const handleMouseUp = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (curRectangle) {
      setRectangles((prev) => [...prev, curRectangle]);
    }
    setCurRectangle(null);
    startPoint.current = null;
  }, [isDrawing, curRectangle, setCurRectangle, setIsDrawing, setRectangles]);

  const currentPageRectangles = useMemo(
    () => rectangles.filter((r) => r.pageIndex === pageIndex),
    [rectangles, pageIndex],
  );

  return (
    <div
      ref={containerRef}
      className="absolute left-0 top-0 z-40 flex h-full w-full cursor-crosshair items-center justify-center bg-transparent"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {currentPageRectangles.map((rect, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: `${rect.x * 100}%`,
            top: `${rect.y * 100}%`,
            width: `${rect.width * 100}%`,
            height: `${rect.height * 100}%`,
            border: tool === "eraser" ? "2px solid red" : "2px solid lightblue",
            backgroundColor:
              tool === "eraser"
                ? "rgba(255, 0, 0, 0.2)"
                : "rgba(178, 216, 254, 0.3)",
          }}
        />
      ))}
      {curRectangle && (
        <div
          style={{
            position: "absolute",
            left: `${curRectangle.x * 100}%`,
            top: `${curRectangle.y * 100}%`,
            width: `${curRectangle.width * 100}%`,
            height: `${curRectangle.height * 100}%`,
            border: tool === "eraser" ? "2px solid red" : "2px solid lightblue",
            backgroundColor:
              tool === "eraser"
                ? "rgba(255, 0, 0, 0.2)"
                : "rgba(178, 216, 254, 0.3)",
          }}
        />
      )}
    </div>
  );
}
