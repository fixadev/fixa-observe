"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import MaskGenerator from "./MaskGenerator";
import type { BrochureRectangles } from "~/lib/property";
import { RectangleRenderer } from "./RectangleRenderer";
import type { PageViewport, PDFDocumentProxy } from "pdfjs-dist";
import type {
  PDFOperatorList,
  RenderParameters,
  TextContent,
  TextItem,
} from "pdfjs-dist/types/src/display/api";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { type Tool } from "./ToolSelector";

export type TransformedTextContent = {
  id?: string;
  pageIndex: number;
  str: string;
  x: number;
  y: number;
  left: number;
  bottom: number;
  width: number;
  height: number;
};
export type Path = {
  id?: string;
  pageIndex: number;
  minMax: number[];
  x: number;
  y: number;
  width: number;
  height: number;
};
type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};
const OPS = {
  save: 10,
  restore: 11,
  transform: 12,
  constructPath: 91,
};

export default function PDFPage({
  pdf,
  pageIndex,
  inpaintedRectangles,
  textToRemove,
  pathsToRemove,
  onViewportChange,
  onTextContentChange,
  onOperatorListChange,
  idsToShow,
  height,
  children,
  className,
  ...props
}: {
  pdf: PDFDocumentProxy;
  pageIndex: number;
  inpaintedRectangles: BrochureRectangles;
  textToRemove: TransformedTextContent[];
  pathsToRemove: Path[];
  onViewportChange?: (viewport: PageViewport) => void;
  onTextContentChange?: (textContent: TextContent) => void;
  onOperatorListChange?: (operatorList: PDFOperatorList) => void;
  idsToShow?: Set<string>;
  height?: number;
  children?: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isLoading = useRef(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  const filteredTextToRemove = useMemo(() => {
    return textToRemove.filter((item) =>
      idsToShow
        ? idsToShow.has(item.id ?? "") && item.pageIndex === pageIndex
        : item.pageIndex === pageIndex,
    );
  }, [textToRemove, pageIndex, idsToShow]);

  const filteredPathsToRemove = useMemo(() => {
    return pathsToRemove.filter((item) =>
      idsToShow
        ? idsToShow.has(item.id ?? "") && item.pageIndex === pageIndex
        : item.pageIndex === pageIndex,
    );
  }, [pathsToRemove, pageIndex, idsToShow]);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (isLoading.current) return;
    isLoading.current = true;

    void pdf.getPage(pageIndex + 1).then((page) => {
      let _viewport = page.getViewport({ scale: 1.0 });
      if (height) {
        const scale = height / _viewport.height;
        _viewport = page.getViewport({ scale });
      }
      onViewportChange?.(_viewport);
      const canvas = canvasRef.current!;
      const context = canvas.getContext("2d");
      canvas.height = _viewport.height;
      canvas.width = _viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: _viewport,
        textToRemove: filteredTextToRemove,
        pathsToRemove: filteredPathsToRemove,
      };
      const renderTask = page.render(renderContext as RenderParameters);
      void renderTask.promise.then(() => {
        // console.log("Rendered page");
        isLoading.current = false;
        setPageLoaded(true);
      });

      void page.getTextContent().then((_textContent) => {
        onTextContentChange?.(_textContent);
      });
      void page.getOperatorList().then((_operatorList) => {
        onOperatorListChange?.(_operatorList);
      });
    });
  }, [
    pageIndex,
    pdf,
    filteredTextToRemove,
    filteredPathsToRemove,
    onViewportChange,
    onTextContentChange,
    height,
    onOperatorListChange,
  ]);

  const filteredInpaintedRectangles = useMemo(() => {
    return inpaintedRectangles.filter((rectangle) =>
      idsToShow ? idsToShow.has(rectangle.id ?? "") : true,
    );
  }, [inpaintedRectangles, idsToShow]);

  return (
    <div className={cn("relative inline-block", className)} {...props}>
      <canvas ref={canvasRef} />
      <RectangleRenderer
        pageNumber={pageIndex}
        rectangles={filteredInpaintedRectangles}
      />
      {children}
      <div
        className={cn(
          "pointer-events-none absolute left-0 top-0 z-40 size-full bg-white transition-opacity",
          pageLoaded ? "opacity-0" : "opacity-100",
        )}
      >
        <Skeleton className="size-full" />
      </div>
    </div>
  );
}

export function PDFPageWithControls({
  pdf,
  pageIndex,
  tool,
  isMouseDown,
  setIsMouseDown,
  rectangles,
  setRectangles,
  inpaintedRectangles,
  textToRemove,
  pathsToRemove,
  onDeleteTextPaths,
  idsToShow,
  height,
}: {
  pdf: PDFDocumentProxy;
  pageIndex: number;
  tool: Tool;
  isMouseDown: boolean;
  setIsMouseDown: React.Dispatch<React.SetStateAction<boolean>>;
  rectangles: BrochureRectangles;
  setRectangles: (rectangles: BrochureRectangles) => void;
  inpaintedRectangles: BrochureRectangles;
  textToRemove: TransformedTextContent[];
  pathsToRemove: Path[];
  onDeleteTextPaths: (
    textToRemove: TransformedTextContent[],
    pathsToRemove: Path[],
  ) => void;
  idsToShow?: Set<string>;
  height?: number;
}) {
  const [viewport, setViewport] = useState<PageViewport | null>(null);
  const [textContent, setTextContent] = useState<TextContent | null>(null);
  const [operatorList, setOperatorList] = useState<PDFOperatorList | null>(
    null,
  );
  const [curRectangle, setCurRectangle] = useState<
    BrochureRectangles[0] | null
  >(null);

  // Contains the indices of the text content that is selected
  const [textContentSelected, setTextContentSelected] = useState<Set<number>>(
    new Set(),
  );
  const [pathsSelected, setPathsSelected] = useState<Set<number>>(new Set());
  const filteredTextToRemove = useMemo(() => {
    return textToRemove.filter((item) =>
      idsToShow
        ? idsToShow.has(item.id ?? "") && item.pageIndex === pageIndex
        : item.pageIndex === pageIndex,
    );
  }, [textToRemove, pageIndex, idsToShow]);
  const filteredPathsToRemove = useMemo(() => {
    return pathsToRemove.filter((item) =>
      idsToShow
        ? idsToShow.has(item.id ?? "") && item.pageIndex === pageIndex
        : item.pageIndex === pageIndex,
    );
  }, [pathsToRemove, pageIndex, idsToShow]);
  const textContentFormatted = useMemo<TransformedTextContent[]>(() => {
    if (viewport === null || textContent === null) return [];

    const fullWidth = viewport.viewBox[2]!;
    const fullHeight = viewport.viewBox[3]!;

    return (textContent.items as TextItem[])
      .filter((item) => item.str.length > 0)
      .map((item) => {
        const origX = item.transform[4]! as number;
        const origY = item.transform[5]! as number;
        const x = origX / fullWidth;
        const y = (fullHeight - origY - item.height) / fullHeight;
        const left = x;
        const bottom = (fullHeight - origY) / fullHeight;
        const width = item.width / fullWidth;
        const height = item.height / fullHeight;
        return {
          pageIndex,
          str: item.str,
          x,
          y,
          left,
          bottom,
          width,
          height,
        } as TransformedTextContent;
      })
      .filter(
        (item) =>
          !filteredTextToRemove.some((removedItem) => {
            return (
              removedItem.str === item.str &&
              removedItem.x === item.x &&
              removedItem.y === item.y &&
              removedItem.width === item.width &&
              removedItem.height === item.height
            );
          }),
      );
  }, [textContent, filteredTextToRemove, viewport, pageIndex]);
  const pathsFormatted = useMemo(() => {
    if (operatorList === null || viewport === null) return [];

    const _paths: Path[] = [];
    let transform: number[] = [1, 0, 0, 1, 0, 0];
    const savedTransform: number[][] = [];
    const fullWidth = viewport.viewBox[2]!;
    const fullHeight = viewport.viewBox[3]!;
    operatorList.fnArray.forEach((op, index: number) => {
      switch (op) {
        case OPS.save:
          savedTransform.push(transform);
          break;
        case OPS.restore:
          transform = savedTransform.pop()!;
          break;
        case OPS.transform:
          // transform
          transform = operatorList.argsArray[index]! as number[];
          break;
        case OPS.constructPath:
          // construct path
          const minMax = (operatorList.argsArray[index]! as number[][])[2]!;
          if (
            filteredPathsToRemove.some(
              (path) => JSON.stringify(path.minMax) === JSON.stringify(minMax),
            )
          ) {
            break;
          }

          if (
            transform[0] === undefined ||
            transform[1] === undefined ||
            transform[2] === undefined ||
            transform[3] === undefined ||
            transform[4] === undefined ||
            transform[5] === undefined ||
            minMax[0] === undefined ||
            minMax[1] === undefined ||
            minMax[2] === undefined ||
            minMax[3] === undefined
          ) {
            break;
          }

          const [x1, y1, x2, y2] = [
            (transform[0] * minMax[0] +
              transform[2] * minMax[1] +
              transform[4]) /
              fullWidth,
            (transform[1] * minMax[0] +
              transform[3] * minMax[1] +
              transform[5]) /
              fullHeight,
            (transform[0] * minMax[2] +
              transform[2] * minMax[3] +
              transform[4]) /
              fullWidth,
            (transform[1] * minMax[2] +
              transform[3] * minMax[3] +
              transform[5]) /
              fullHeight,
          ];
          const w = x2 - x1;
          const h = y2 - y1;
          const formattedPath = {
            pageIndex,
            minMax,
            x: x1,
            y: 1 - y1 - h,
            width: w,
            height: h,
          };
          _paths.push(formattedPath);

          break;
      }
    });
    return _paths;
  }, [operatorList, filteredPathsToRemove, viewport, pageIndex]);

  useEffect(() => {
    if (tool === "selector" && rectangles.length > 0 && !isMouseDown) {
      setRectangles([]);
    }
  }, [tool, rectangles, isMouseDown, pageIndex, setRectangles]);

  const handleRemoveText = useCallback(() => {
    const newTextToRemove = [...textToRemove];
    for (const index of Array.from(textContentSelected)) {
      if (textContentFormatted[index]) {
        newTextToRemove.push(textContentFormatted[index]);
      }
    }
    setTextContentSelected(new Set());

    const newPathsToRemove = [...pathsToRemove];
    for (const index of Array.from(pathsSelected)) {
      if (pathsFormatted[index]) {
        newPathsToRemove.push(pathsFormatted[index]);
      }
    }
    setPathsSelected(new Set());

    onDeleteTextPaths(newTextToRemove, newPathsToRemove);
  }, [
    textToRemove,
    pathsToRemove,
    onDeleteTextPaths,
    textContentSelected,
    textContentFormatted,
    pathsSelected,
    pathsFormatted,
  ]);

  const intersect = useCallback((rect1: Rectangle, rect2: Rectangle) => {
    const left1 = rect1.x;
    const right1 = rect1.x + rect1.width;
    const top1 = rect1.y;
    const bottom1 = rect1.y + rect1.height;

    const left2 = rect2.x;
    const right2 = rect2.x + rect2.width;
    const top2 = rect2.y;
    const bottom2 = rect2.y + rect2.height;

    // Check if one rectangle is to the left of the other
    if (right1 < left2 || right2 < left1) {
      return false;
    }

    // Check if one rectangle is above the other
    if (bottom1 < top2 || bottom2 < top1) {
      return false;
    }

    // If we've made it here, the rectangles must intersect
    return true;
  }, []);
  // Check if rect1 contains rect2
  const contains = useCallback((rect1: Rectangle, rect2: Rectangle) => {
    return (
      rect1.x <= rect2.x &&
      rect1.y <= rect2.y &&
      rect1.x + rect1.width >= rect2.x + rect2.width &&
      rect1.y + rect1.height >= rect2.y + rect2.height
    );
  }, []);

  useEffect(() => {
    if (
      tool === "selector" &&
      curRectangle &&
      isMouseDown &&
      (textContentFormatted.length > 0 || pathsFormatted.length > 0)
    ) {
      const selectedText = new Set<number>();
      for (let i = 0; i < textContentFormatted.length; i++) {
        if (intersect(curRectangle, textContentFormatted[i]!)) {
          selectedText.add(i);
        }
      }
      setTextContentSelected(selectedText);

      const selectedPaths = new Set<number>();
      for (let i = 0; i < pathsFormatted.length; i++) {
        const path = pathsFormatted[i];
        if (
          path &&
          intersect(curRectangle, path) &&
          !contains(path, curRectangle)
        ) {
          selectedPaths.add(i);
        }
      }
      setPathsSelected(selectedPaths);
    }
  }, [
    intersect,
    isMouseDown,
    curRectangle,
    textContentFormatted,
    tool,
    pathsFormatted,
    contains,
  ]);

  return (
    <PDFPage
      pdf={pdf}
      pageIndex={pageIndex}
      inpaintedRectangles={inpaintedRectangles}
      textToRemove={textToRemove}
      pathsToRemove={pathsToRemove}
      onViewportChange={setViewport}
      onTextContentChange={setTextContent}
      onOperatorListChange={setOperatorList}
      idsToShow={idsToShow}
      height={height}
      onKeyDown={(e) => {
        if (e.key === "Delete" || e.key === "Backspace") {
          handleRemoveText();
        }
      }}
      tabIndex={0}
    >
      <MaskGenerator
        pageIndex={pageIndex}
        isDrawing={isMouseDown}
        setIsDrawing={setIsMouseDown}
        rectangles={rectangles}
        setRectangles={setRectangles}
        curRectangle={curRectangle}
        setCurRectangle={setCurRectangle}
        tool={tool}
      />
      <div className="absolute left-0 top-0 h-full w-full">
        {textContentFormatted.map((text, i) => {
          if (!textContentSelected.has(i)) {
            return null;
          }
          return (
            <div
              key={`text-${i}`}
              className="absolute"
              style={{
                left: `${text.x * 100}%`,
                top: `${text.y * 100}%`,
                width: `${text.width * 100}%`,
                height: `${text.height * 100}%`,
                border: "2px dashed lightblue",
                backgroundColor: "rgba(178, 216, 254, 0.3)",
                overflow: "hidden",
                whiteSpace: "nowrap",
                fontSize: "12px",
              }}
            ></div>
          );
        })}
        {pathsFormatted.map((path, i) => {
          if (!pathsSelected.has(i)) {
            return null;
          }
          return (
            <div
              key={`path-${i}`}
              className="absolute"
              style={{
                left: `${path.x * 100}%`,
                top: `${path.y * 100}%`,
                width: `${path.width * 100}%`,
                height: `${path.height * 100}%`,
                border: "2px dashed lightblue",
                backgroundColor: "rgba(178, 216, 254, 0.3)",
                overflow: "hidden",
                whiteSpace: "nowrap",
                fontSize: "12px",
              }}
            ></div>
          );
        })}
      </div>
    </PDFPage>
  );
}
