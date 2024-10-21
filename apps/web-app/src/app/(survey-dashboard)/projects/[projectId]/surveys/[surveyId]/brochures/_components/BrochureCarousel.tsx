"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "~/components/ui/carousel";
import { Skeleton } from "~/components/ui/skeleton";
import { TrashIcon } from "@heroicons/react/24/outline";
import { TrashIcon as TrashIconSolid } from "@heroicons/react/24/solid";
import { cn } from "~/lib/utils";
import {
  type BrochureSchema,
  type BrochureRectangles,
  type Path,
  type TransformedTextContent,
} from "~/lib/property";
import {
  type PDFDocumentProxy,
  getDocument,
  GlobalWorkerOptions,
} from "~/lib/pdfx.mjs";
// import { getDocument } from "~/lib/pdfx.mjs";
import PDFPage, { PDFPageWithControls } from "./PDFPage";
import { Button } from "~/components/ui/button";
import ToolSelector, { type Tool } from "./ToolSelector";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import Spinner from "~/components/Spinner";
import { ConfirmRemovePopup } from "./ConfirmRemovePopup";

export function BrochureCarousel({
  brochure,
  // refetchProperty,
}: {
  brochure: BrochureSchema;
  refetchProperty: () => void;
}) {
  // ------------------
  // #region Load PDF
  // ------------------
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const pdfLoaded = useRef("");
  const pdfUrl = useMemo(
    () => `/api/cors-proxy?url=${encodeURIComponent(brochure.url)}`,
    [brochure.url],
  );
  const [numPages, setNumPages] = useState<number>(0);
  useEffect(() => {
    if (pdfLoaded.current === pdfUrl) return;
    pdfLoaded.current = pdfUrl;

    GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

    getDocument(pdfUrl)
      .promise.then((_pdf: PDFDocumentProxy) => {
        setPdf(_pdf);
        setNumPages(_pdf.numPages);
        setLoaded(true);
      })
      .catch((error: unknown) => {
        console.error("Error loading PDF", error);
      });
  }, [pdfUrl]);
  // #endregion

  const [tool, setTool] = useState<Tool>("selector");
  const [loaded, setLoaded] = useState<boolean>(false);
  // const [isRemoving, setIsRemoving] = useState<boolean>(false); // Previously used for inpainting
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [rectanglesToRemove, setRectanglesToRemove] =
    useState<BrochureRectangles>([]);
  const [textToRemove, setTextToRemove] = useState<TransformedTextContent[]>(
    [],
  );
  const [pathsToRemove, setPathsToRemove] = useState<Path[]>([]);
  const [inpaintedRectangles, setInpaintedRectangles] =
    useState<BrochureRectangles>([]);
  const [deletedPages, setDeletedPages] = useState<Set<number>>(new Set());

  // Load initial state from brochure
  useEffect(() => {
    setTextToRemove((brochure.textToRemove as TransformedTextContent[]) ?? []);
    setPathsToRemove((brochure.pathsToRemove as Path[]) ?? []);
    setInpaintedRectangles(
      (brochure.inpaintedRectangles as BrochureRectangles) ?? [],
    );
    setUndoStack(brochure.undoStack ?? []);
    setDeletedPages(new Set(brochure.deletedPages ?? []));
  }, [brochure]);

  const { mutate: updateDeletedPages } =
    api.brochure.updateDeletedPages.useMutation();
  useEffect(() => {
    updateDeletedPages({
      brochureId: brochure.id,
      deletedPages: Array.from(deletedPages),
    });
  }, [brochure.id, deletedPages, updateDeletedPages]);

  // ------------------
  // #region Undo and Redo
  // ------------------
  // Mutations
  const { mutate: updateUndoStack } =
    api.brochure.updateUndoStack.useMutation();
  const { mutate: updateTextToRemove } =
    api.brochure.updateTextToRemove.useMutation();
  const { mutate: updatePathsToRemove } =
    api.brochure.updatePathsToRemove.useMutation();
  // Undo and redo stacks contain ids of the rectangles or text that were removed
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const undoStackSet = useMemo(() => new Set(undoStack), [undoStack]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const redoStackSet = useMemo(() => new Set(redoStack), [redoStack]);
  const undo = useCallback(() => {
    const newUndo = [...undoStack];
    const last = newUndo.pop();
    if (last) {
      const newRedo = [...redoStack, last];
      setRedoStack(newRedo);
    }
    updateUndoStack({
      brochureId: brochure.id,
      undoStack: newUndo,
    });
    setUndoStack(newUndo);
  }, [undoStack, updateUndoStack, brochure.id, redoStack]);
  const redo = useCallback(() => {
    const newRedo = [...redoStack];
    const last = newRedo.pop();
    if (last) {
      const newUndo = [...undoStack, last];
      updateUndoStack({
        brochureId: brochure.id,
        undoStack: newUndo,
      });
      setUndoStack(newUndo);
    }
    setRedoStack(newRedo);
  }, [undoStack, redoStack, updateUndoStack, brochure.id]);
  const handleDeleteTextPaths = useCallback(
    (textToRemove: TransformedTextContent[], pathsToRemove: Path[]) => {
      const id = crypto.randomUUID();

      const newTextToRemove: TransformedTextContent[] = [];
      for (const text of textToRemove) {
        if (!text.id) {
          newTextToRemove.push({ ...text, id });
        } else if (!redoStackSet.has(text.id)) {
          // Get rid of all text in the redo stack (because we don't need them anymore)
          newTextToRemove.push(text);
        }
      }
      setTextToRemove(newTextToRemove);
      updateTextToRemove({
        brochureId: brochure.id,
        textToRemove: newTextToRemove,
      });

      const newPathsToRemove: Path[] = [];
      for (const path of pathsToRemove) {
        if (!path.id) {
          newPathsToRemove.push({ ...path, id });
        } else if (!redoStackSet.has(path.id)) {
          // Get rid of all paths in the redo stack (because we don't need them anymore)
          newPathsToRemove.push(path);
        }
      }
      setPathsToRemove(newPathsToRemove);
      updatePathsToRemove({
        brochureId: brochure.id,
        pathsToRemove: newPathsToRemove,
      });

      updateUndoStack({
        brochureId: brochure.id,
        undoStack: [...undoStack, id],
      });
      setUndoStack((prev) => [...prev, id]);
      setRedoStack([]);
    },
    [
      brochure.id,
      redoStackSet,
      undoStack,
      updatePathsToRemove,
      updateTextToRemove,
      updateUndoStack,
    ],
  );
  // #endregion

  // ------------------
  // #region Inpainting
  // ------------------
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const { toast } = useToast();

  const { mutate: inpaintRectangles } =
    api.brochure.inpaintRectangles.useMutation({
      onSuccess: ({ newRectangles }) => {
        setInpaintedRectangles((prev) => [...prev, ...newRectangles]);

        const newIds = newRectangles
          .map((rectangle) => rectangle.id)
          .filter((id) => id !== undefined);
        const newUndoStack = [...undoStack, ...newIds];
        updateUndoStack({
          brochureId: brochure.id,
          undoStack: newUndoStack,
        });
        setUndoStack(newUndoStack);
        setRedoStack([]);

        toast({
          title: "Objects removed successfully",
        });
        setIsRemoving(false);
      },
    });

  const handleRemoveObjects = useCallback(() => {
    setIsRemoving(true);
    inpaintRectangles({
      brochureId: brochure.id,
      rectanglesToRemove,
    });
    setRectanglesToRemove([]);
  }, [inpaintRectangles, brochure.id, rectanglesToRemove]);
  // #endregion

  // ------------------
  // #region Carousel
  // ------------------
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const updateCurrentSlide = useCallback((_api: CarouselApi) => {
    const scrollSnap = _api!.selectedScrollSnap();
    setCurrentSlide(scrollSnap);
  }, []);
  const getCarouselIndex = useCallback(
    (pageIndex: number) => {
      return Array.from(deletedPages).reduce((acc, deletedPage) => {
        if (deletedPage < pageIndex) {
          return acc - 1;
        }
        return acc;
      }, pageIndex);
    },
    [deletedPages],
  );
  useEffect(() => {
    if (!carouselApi) return;
    carouselApi.on("select", updateCurrentSlide);
    return () => {
      carouselApi.off("select", updateCurrentSlide);
    };
  }, [carouselApi, updateCurrentSlide]);
  // #endregion

  return (
    <div className="relative h-[655px] min-w-0 flex-1">
      {loaded && pdf && (
        <div className="mx-auto flex max-w-[1160px] flex-col justify-center px-12">
          <Carousel opts={{ watchDrag: false }} setApi={setCarouselApi}>
            <CarouselContent className="h-full">
              {Array.from(
                new Array(numPages),
                (el, index) =>
                  !deletedPages.has(index) && (
                    <CarouselItem
                      key={`page_${index + 1}`}
                      className="flex flex-col items-center justify-center object-contain px-6"
                    >
                      <PDFPageWithControls
                        pdf={pdf}
                        pageIndex={index}
                        tool={tool}
                        isMouseDown={isMouseDown}
                        setIsMouseDown={setIsMouseDown}
                        rectangles={rectanglesToRemove}
                        setRectangles={setRectanglesToRemove}
                        inpaintedRectangles={inpaintedRectangles}
                        idsToShow={undoStackSet}
                        textToRemove={textToRemove}
                        pathsToRemove={pathsToRemove}
                        onDeleteTextPaths={handleDeleteTextPaths}
                        height={500}
                      />
                      {isRemoving && (
                        <div className="absolute z-40 flex h-full w-full items-center justify-center bg-black/50">
                          <Spinner className="h-10 w-10 text-white" />
                        </div>
                      )}
                    </CarouselItem>
                  ),
              )}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            <ToolSelector
              tool={tool}
              onToolChange={setTool}
              onUndo={undo}
              undoEnabled={undoStack.length > 0}
              onRedo={redo}
              redoEnabled={redoStack.length > 0}
              isMouseDown={isMouseDown}
            />
            {/* For inpainting */}
            {rectanglesToRemove.length > 0 && !isRemoving && !isMouseDown && (
              <ConfirmRemovePopup
                onConfirm={handleRemoveObjects}
                onCancel={() => {
                  setRectanglesToRemove([]);
                }}
              />
            )}
          </Carousel>
          <div className="mt-10 flex flex-row gap-2 overflow-x-auto">
            {Array.from(new Array(numPages), (el, index) => {
              return (
                <PDFPage
                  key={`page_${index + 1}`}
                  pdf={pdf}
                  pageIndex={index}
                  inpaintedRectangles={inpaintedRectangles}
                  textToRemove={textToRemove}
                  pathsToRemove={pathsToRemove}
                  idsToShow={undoStackSet}
                  height={100}
                  className={cn(
                    !deletedPages.has(index) &&
                      currentSlide === getCarouselIndex(index)
                      ? "opacity-100 outline outline-[3px] -outline-offset-[3px] outline-primary"
                      : "opacity-60",
                    deletedPages.has(index)
                      ? "opacity-100"
                      : "hover:opacity-100",
                  )}
                >
                  <div
                    className={cn(
                      "group absolute left-0 top-0 z-40 flex h-full w-full items-start justify-end",
                      deletedPages.has(index)
                        ? "bg-black/50"
                        : "bg-transparent hover:cursor-pointer",
                    )}
                    onClick={() => {
                      if (!deletedPages.has(index)) {
                        carouselApi?.scrollTo(getCarouselIndex(index), true);
                      }
                    }}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (deletedPages.has(index)) {
                          setDeletedPages((prev) => {
                            const newSet = new Set(prev);
                            newSet.delete(index);
                            return newSet;
                          });
                        } else {
                          setDeletedPages((prev) => {
                            const newSet = new Set(prev);
                            newSet.add(index);
                            return newSet;
                          });
                        }
                      }}
                      className={cn(
                        "m-1.5 size-7",
                        deletedPages.has(index)
                          ? "visible"
                          : "invisible group-hover:visible",
                      )}
                    >
                      {deletedPages.has(index) ? (
                        <TrashIconSolid className="size-4" />
                      ) : (
                        <TrashIcon className="size-4" />
                      )}
                    </Button>
                  </div>
                </PDFPage>
              );
            })}
          </div>
        </div>
      )}

      {/* Loader */}
      <div
        className={cn(
          "pointer-events-none absolute left-0 top-0 z-40 flex size-full flex-col bg-white transition-opacity duration-500",
          loaded && pdf ? "opacity-0" : "opacity-100",
        )}
      >
        <Skeleton className="size-full" />
      </div>
    </div>
  );
}
