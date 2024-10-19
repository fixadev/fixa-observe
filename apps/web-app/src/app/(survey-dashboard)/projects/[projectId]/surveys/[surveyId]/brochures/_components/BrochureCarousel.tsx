"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "~/trpc/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "~/components/ui/carousel";
import Spinner from "~/components/Spinner";
import { Skeleton } from "~/components/ui/skeleton";
import { useToast } from "~/hooks/use-toast";
import { TrashIcon } from "@heroicons/react/24/outline";
import { cn } from "~/lib/utils";
import { type BrochureSchema, type BrochureRectangles } from "~/lib/property";
import { ConfirmRemovePopup } from "./ConfirmRemovePopup";
import * as pdfjsLib from "~/lib/pdfx.mjs";
// import { getDocument } from "~/lib/pdfx.mjs";
import PDFPage, {
  PDFPageWithControls,
  type TransformedTextContent,
} from "./PDFPage";
import { type PDFDocumentProxy } from "pdfjs-dist";

export function BrochureCarousel({
  brochure,
  refetchProperty,
}: {
  brochure: BrochureSchema;
  refetchProperty: () => void;
}) {
  // Load PDF
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    pdfjsLib
      .getDocument(pdfUrl)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .promise.then((_pdf: PDFDocumentProxy) => {
        setPdf(_pdf);
        setNumPages(_pdf.numPages);
        setLoaded(true);
      })
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .catch((error: unknown) => {
        console.error("Error loading PDF", error);
      });
  }, [pdfUrl]);

  const [tool, setTool] = useState<"eraser" | "selector">("eraser");
  const [loaded, setLoaded] = useState<boolean>(false);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [rectanglesToRemove, setRectanglesToRemove] =
    useState<BrochureRectangles>([]);
  const [textToRemove, setTextToRemove] = useState<TransformedTextContent[]>(
    [],
  );

  const [deletedPages, setDeletedPages] = useState<Array<number>>([]);
  const { toast } = useToast();

  const { mutate: inpaintRectangles } =
    api.property.inpaintRectangles.useMutation({
      onSuccess: () => {
        toast({
          title: "Objects removed successfully",
        });
        void refetchProperty();
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

  return (
    <div className="relative w-5/6 flex-col">
      <div className="flex h-[740px] max-w-full flex-col justify-center">
        <Carousel opts={{ watchDrag: false }}>
          <CarouselContent className="h-full">
            {Array.from(
              new Array(numPages),
              (el, index) =>
                !deletedPages.includes(index) && (
                  <CarouselItem
                    key={`page_${index + 1}`}
                    className="flex flex-col items-center justify-center object-contain px-6"
                  >
                    {pdf && (
                      <PDFPageWithControls
                        pdf={pdf}
                        pageIndex={index}
                        tool={tool}
                        isMouseDown={isMouseDown}
                        setIsMouseDown={setIsMouseDown}
                        rectangles={rectanglesToRemove}
                        setRectangles={setRectanglesToRemove}
                        inpaintedRectangles={
                          brochure.inpaintedRectangles as BrochureRectangles
                        }
                        textToRemove={textToRemove}
                        setTextToRemove={setTextToRemove}
                      />
                    )}
                    {isRemoving && (
                      <div className="absolute flex h-full w-full items-center justify-center bg-black/50">
                        <Spinner className="h-10 w-10 text-white" />
                      </div>
                    )}
                  </CarouselItem>
                ),
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
          {rectanglesToRemove.length > 0 && !isRemoving && !isMouseDown && (
            <ConfirmRemovePopup
              onConfirm={handleRemoveObjects}
              onCancel={() => {
                setRectanglesToRemove([]);
              }}
            />
          )}
        </Carousel>
        <div className="mt-10 flex h-[100px] flex-row gap-2">
          {Array.from(new Array(numPages), (el, index) => {
            if (!pdf) return null;
            return (
              <PDFPage
                key={`page_${index + 1}`}
                pdf={pdf}
                pageIndex={index}
                inpaintedRectangles={
                  brochure.inpaintedRectangles as BrochureRectangles
                }
                textToRemove={textToRemove}
                onLoad={() => setLoaded(true)}
                height={100}
                // className="h-[100px]"
                // height={100}
              >
                <div
                  className={`group absolute left-0 top-0 flex h-full w-full items-center justify-center ${
                    deletedPages.includes(index)
                      ? "bg-black/50"
                      : "bg-transparent"
                  } hover:cursor-pointer hover:bg-black/50`}
                  onClick={() => {
                    if (deletedPages.includes(index)) {
                      setDeletedPages((prev) =>
                        prev.filter((page) => page !== index),
                      );
                    } else {
                      setDeletedPages((prev) => [...prev, index]);
                    }
                  }}
                >
                  <TrashIcon
                    className={`h-6 w-6 text-white group-hover:opacity-100 ${
                      deletedPages.includes(index) ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {/* <Switch
                  checked={deletedPages.includes(index)}
                  className="data-[state=checked]:bg-red-500"
                  onCheckedChange={(checked) => {}}
                /> */}
                </div>
              </PDFPage>
            );
          })}
        </div>
      </div>

      {/* Loader */}
      <div
        className={cn(
          "pointer-events-none absolute left-0 top-0 flex size-full flex-col bg-white transition-opacity",
          loaded ? "opacity-0" : "opacity-100",
        )}
      >
        <Skeleton className="h-[600px] w-full" />
        <div className="h-10" />
        <div className="flex flex-row gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-[100px] w-[129px]" />
          ))}
        </div>
        {/* <Spinner className="h-10 w-10 text-gray-500" /> */}
      </div>
    </div>
  );
}
