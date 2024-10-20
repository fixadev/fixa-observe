"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import MaskGenerator from "./MaskGenerator";
import type { BrochureRectangles } from "~/lib/property";
import { RectangleRenderer } from "./RectangleRenderer";
import type { PageViewport, PDFDocumentProxy } from "pdfjs-dist";
import type {
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
type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function PDFPage({
  pdf,
  pageIndex,
  inpaintedRectangles,
  textToRemove,
  onViewportChange,
  onTextContentChange,
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
  onViewportChange?: (viewport: PageViewport) => void;
  onTextContentChange?: (textContent: TextContent) => void;
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
    });
  }, [
    pageIndex,
    pdf,
    filteredTextToRemove,
    onViewportChange,
    onTextContentChange,
    height,
  ]);

  return (
    <div className={cn("relative inline-block", className)} {...props}>
      <canvas ref={canvasRef} />
      <RectangleRenderer
        pageNumber={pageIndex}
        rectangles={inpaintedRectangles}
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
  setTextToRemove,
  idsToShow,
  height,
}: {
  pdf: PDFDocumentProxy;
  pageIndex: number;
  tool: Tool;
  isMouseDown: boolean;
  setIsMouseDown: React.Dispatch<React.SetStateAction<boolean>>;
  rectangles: BrochureRectangles;
  setRectangles: React.Dispatch<React.SetStateAction<BrochureRectangles>>;
  inpaintedRectangles: BrochureRectangles;
  textToRemove: TransformedTextContent[];
  setTextToRemove: (textToRemove: TransformedTextContent[]) => void;
  idsToShow?: Set<string>;
  height?: number;
}) {
  const [viewport, setViewport] = useState<PageViewport | null>(null);
  const [textContent, setTextContent] = useState<TextContent | null>(null);
  const [curRectangle, setCurRectangle] = useState<
    BrochureRectangles[0] | null
  >(null);

  // Contains the indices of the text content that is selected
  const [textContentSelected, setTextContentSelected] = useState<Set<number>>(
    new Set(),
  );
  const filteredTextToRemove = useMemo(() => {
    return textToRemove.filter((item) => item.pageIndex === pageIndex);
  }, [textToRemove, pageIndex]);
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

  useEffect(() => {
    if (tool === "selector" && rectangles.length > 0 && !isMouseDown) {
      setRectangles([]);
    }
  }, [tool, rectangles, isMouseDown, pageIndex, setRectangles]);

  const handleRemoveText = useCallback(() => {
    console.log("handleRemoveText", textContentSelected);
    const newTextToRemove = [...textToRemove];
    for (const index of Array.from(textContentSelected)) {
      if (textContentFormatted[index]) {
        newTextToRemove.push(textContentFormatted[index]);
      }
    }
    setTextToRemove(newTextToRemove);
    setTextContentSelected(new Set());
  }, [
    textContentSelected,
    textToRemove,
    setTextToRemove,
    textContentFormatted,
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

  useEffect(() => {
    if (
      tool === "selector" &&
      curRectangle &&
      isMouseDown &&
      textContentFormatted.length > 0
    ) {
      const selected = new Set<number>();
      for (let i = 0; i < textContentFormatted.length; i++) {
        if (intersect(curRectangle, textContentFormatted[i]!)) {
          selected.add(i);
        }
      }
      setTextContentSelected(selected);
    }
  }, [intersect, isMouseDown, curRectangle, textContentFormatted, tool]);

  return (
    <PDFPage
      pdf={pdf}
      pageIndex={pageIndex}
      inpaintedRectangles={inpaintedRectangles}
      textToRemove={textToRemove}
      onViewportChange={setViewport}
      onTextContentChange={setTextContent}
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
        {textContentFormatted.map((item, i) => {
          if (!textContentSelected.has(i)) {
            return null;
          }
          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${item.x * 100}%`,
                top: `${item.y * 100}%`,
                width: `${item.width * 100}%`,
                height: `${item.height * 100}%`,
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
