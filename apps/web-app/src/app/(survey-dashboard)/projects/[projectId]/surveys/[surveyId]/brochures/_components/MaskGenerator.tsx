import { useRef, useCallback } from "react";
import { type BrochureRectangles } from "@/lib/property";

export function MaskGenerator({
  isDrawing,
  setIsDrawing,
  pageNumber,
  rectangles,
  setRectangles,
}: {
  isDrawing: boolean;
  setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
  pageNumber: number;
  rectangles: BrochureRectangles;
  setRectangles: React.Dispatch<React.SetStateAction<BrochureRectangles>>;
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
            pageNumber,
            x: startPoint.current?.x ?? 0,
            y: startPoint.current?.y ?? 0,
            width: 0,
            height: 0,
          };
          return [...prev, newObject];
        });
      }
    },
    [pageNumber, setRectangles, setIsDrawing, pixelToPercentage],
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
          pageNumber,
          x: Math.min(startPoint.current!.x, endX),
          y: Math.min(startPoint.current!.y, endY),
          width: Math.abs(endX - startPoint.current!.x),
          height: Math.abs(endY - startPoint.current!.y),
        };
        return updatedRectangles;
      });
    },
    [isDrawing, setRectangles, pixelToPercentage, pageNumber],
  );

  const handleMouseUp = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    startPoint.current = null;
  }, [isDrawing, setIsDrawing]);

  const currentPageRectangles = rectangles.filter(
    (r) => r.pageNumber === pageNumber,
  );

  return (
    <div
      ref={containerRef}
      className="absolute z-40 flex h-full w-full cursor-crosshair items-center justify-center bg-transparent"
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
            border: "2px solid red",
            backgroundColor: "rgba(255, 0, 0, 0.2)",
          }}
        />
      ))}
    </div>
  );
}
