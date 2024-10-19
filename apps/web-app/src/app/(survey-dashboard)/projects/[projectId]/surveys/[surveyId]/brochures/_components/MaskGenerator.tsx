import { useRef, useCallback } from "react";
import { type BrochureRectangles } from "@/lib/property";

export default function MaskGenerator({
  isDrawing,
  setIsDrawing,
  pageIndex,
  rectangles,
  setRectangles,
  tool,
}: {
  isDrawing: boolean;
  setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
  pageIndex: number;
  rectangles: BrochureRectangles;
  setRectangles: React.Dispatch<React.SetStateAction<BrochureRectangles>>;
  tool: "eraser" | "selector";
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
        startPoint.current = {
          x: pixelToPercentage(e.clientX - rect.left, rect.width),
          y: pixelToPercentage(e.clientY - rect.top, rect.height),
        };
        setIsDrawing(true);
        setRectangles((prev) => {
          const newObject = {
            pageIndex,
            x: startPoint.current?.x ?? 0,
            y: startPoint.current?.y ?? 0,
            width: 0,
            height: 0,
          };
          return [...prev, newObject];
        });
      }
    },
    [pageIndex, setRectangles, setIsDrawing, pixelToPercentage],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDrawing || !startPoint.current || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const endX = pixelToPercentage(e.clientX - rect.left, rect.width);
      const endY = pixelToPercentage(e.clientY - rect.top, rect.height);

      setRectangles((prev) => {
        const lastIndex = prev.length - 1;
        const updatedRectangles = [...prev];
        updatedRectangles[lastIndex] = {
          pageIndex: pageIndex,
          x: Math.min(startPoint.current?.x ?? 0, endX),
          y: Math.min(startPoint.current?.y ?? 0, endY),
          width: Math.abs(endX - (startPoint.current?.x ?? 0)),
          height: Math.abs(endY - (startPoint.current?.y ?? 0)),
        };
        return updatedRectangles;
      });
    },
    [isDrawing, setRectangles, pixelToPercentage, pageIndex],
  );

  const handleMouseUp = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    startPoint.current = null;
  }, [isDrawing, setIsDrawing]);

  const currentPageRectangles = rectangles.filter(
    (r) => r.pageIndex === pageIndex,
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
    </div>
  );
}
