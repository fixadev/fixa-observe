import { useRef, useCallback } from "react";
import { type brochureRectangles } from "@/lib/property";
import { type z } from "zod";

type RectanglesToRemoveByPage = z.infer<typeof brochureRectangles>["pageData"];

type PercentageRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

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
  rectangles: RectanglesToRemoveByPage;
  setRectangles: React.Dispatch<React.SetStateAction<RectanglesToRemoveByPage>>;
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
          const newObject: PercentageRect = {
            x: startPoint.current?.x ?? 0,
            y: startPoint.current?.y ?? 0,
            width: 0,
            height: 0,
          };
          const pageIndex = prev.findIndex((p) => p.pageNumber === pageNumber);
          if (pageIndex === -1) {
            return [
              ...prev,
              {
                pageNumber,
                rectangles: [newObject],
              },
            ];
          } else {
            const newRectangles = [...prev];
            newRectangles[pageIndex] = {
              pageNumber,
              rectangles: [
                ...(newRectangles[pageIndex]?.rectangles ?? []),
                newObject,
              ],
            };
            return newRectangles;
          }
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

      const newObject: PercentageRect = {
        x: Math.min(startPoint.current.x, endX),
        y: Math.min(startPoint.current.y, endY),
        width: Math.abs(endX - startPoint.current.x),
        height: Math.abs(endY - startPoint.current.y),
      };

      setRectangles((prev) => {
        const pageIndex = prev.findIndex((p) => p.pageNumber === pageNumber);
        if (pageIndex === -1) {
          return [
            ...prev,
            {
              pageNumber,
              rectangles: [newObject],
            },
          ];
        } else {
          const newRectangles = [...prev];
          newRectangles[pageIndex] = {
            pageNumber,
            rectangles: [
              ...(newRectangles[pageIndex]?.rectangles.slice(0, -1) ?? []),
              newObject,
            ],
          };
          return newRectangles;
        }
      });
    },
    [isDrawing, setRectangles, pageNumber, pixelToPercentage],
  );

  const handleMouseUp = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    startPoint.current = null;
  }, [isDrawing, setIsDrawing]);

  const currentPageRectangles =
    rectangles.find((r) => r.pageNumber === pageNumber)?.rectangles ?? [];

  return (
    <div
      ref={containerRef}
      className="absolute flex h-full w-full cursor-crosshair items-center justify-center bg-transparent"
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
