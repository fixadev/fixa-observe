import { useState, useRef, useCallback, useEffect } from "react";
import { type removeObjectsInput } from "@/lib/property";
import { type z } from "zod";

type ObjectsToRemoveByPage = z.infer<
  typeof removeObjectsInput
>["objectsToRemoveByPage"];

export function MaskGenerator({
  pageNumber,
  rectangles,
  setRectangles,
}: {
  pageNumber: number;
  rectangles: ObjectsToRemoveByPage;
  setRectangles: React.Dispatch<React.SetStateAction<ObjectsToRemoveByPage>>;
}) {
  const [isDrawing, setIsDrawing] = useState(false);
  const startPoint = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize(); // Initial size calculation
    window.addEventListener("resize", updateSize); // Update on window resize

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      startPoint.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setIsDrawing(true);
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDrawing || !startPoint.current || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const endX = e.clientX - rect.left;
      const endY = e.clientY - rect.top;

      const newObject = {
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
              containerWidth: containerSize.width,
              containerHeight: containerSize.height,
              objects: [newObject],
            },
          ];
        } else {
          const newRectangles = [...prev];
          newRectangles[pageIndex] = {
            ...newRectangles[pageIndex],
            objects: [
              ...newRectangles[pageIndex].objects.slice(0, -1),
              newObject,
            ],
          };
          return newRectangles;
        }
      });
    },
    [isDrawing, setRectangles, pageNumber, containerSize],
  );

  const handleMouseUp = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setRectangles((prev) => {
      const pageIndex = prev.findIndex((p) => p.pageNumber === pageNumber);
      if (pageIndex === -1) {
        return [
          ...prev,
          {
            pageNumber,
            containerWidth: containerSize.width,
            containerHeight: containerSize.height,
            objects: [],
          },
        ];
      } else {
        return prev;
      }
    });
    startPoint.current = null;
  }, [setRectangles, isDrawing, pageNumber, containerSize]);

  const currentPageRectangles =
    rectangles.find((r) => r.pageNumber === pageNumber)?.objects || [];

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
            left: `${rect.x}px`,
            top: `${rect.y}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            border: "2px solid red",
            backgroundColor: "rgba(255, 0, 0, 0.2)",
          }}
        />
      ))}
    </div>
  );
}
