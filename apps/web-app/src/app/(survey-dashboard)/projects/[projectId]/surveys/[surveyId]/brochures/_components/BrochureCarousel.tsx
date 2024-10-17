"use client";
import { useEffect, useState } from "react";
import { type z } from "zod";
import { api } from "~/trpc/react";
import { Document, Page, pdfjs } from "react-pdf";

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

import { MaskGenerator } from "./MaskGenerator";
import { RectangleRenderer } from "./RectangleRenderer";
import { ConfirmRemovePopup } from "./ConfirmRemovePopup";

export function BrochureCarousel({
  brochure,
  refetchProperty,
}: {
  brochure: BrochureSchema;
  refetchProperty: () => void;
}) {
  const [numPages, setNumPages] = useState<number>(0);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [rectanglesToRemove, setRectanglesToRemove] =
    useState<BrochureRectangles>([]);

  useEffect(() => {
    console.log("rectanglesToRemove", rectanglesToRemove);
  }, [rectanglesToRemove]);

  const [deletedPages, setDeletedPages] = useState<Array<number>>([]);

  const { toast } = useToast();

  const pdfUrl = `/api/cors-proxy?url=${encodeURIComponent(brochure.url)}`;

  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setTimeout(() => {
      setLoaded(true);
    }, 500);
  }

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

  function handleRemoveObjects() {
    setIsRemoving(true);
    inpaintRectangles({
      brochureId: brochure.id,
      rectanglesToRemove,
    });
    setRectanglesToRemove([]);
  }

  // TODO: fix this styling

  return (
    <div className="relative w-5/6 flex-col">
      <Document
        className="flex h-[740px] max-w-full flex-col justify-center"
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
      >
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
                    <Page
                      onLoad={() => setLoaded(true)}
                      className="flex max-w-full"
                      height={600}
                      pageNumber={index + 1}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    >
                      <MaskGenerator
                        isDrawing={isMouseDown}
                        setIsDrawing={setIsMouseDown}
                        pageNumber={index}
                        rectangles={rectanglesToRemove}
                        setRectangles={setRectanglesToRemove}
                      />
                      <RectangleRenderer
                        pageNumber={index}
                        rectangles={brochure.inpaintedRectangles}
                      />
                      {isRemoving && (
                        <div className="absolute flex h-full w-full items-center justify-center bg-black/50">
                          <Spinner className="h-10 w-10 text-white" />
                        </div>
                      )}
                    </Page>
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
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              onLoad={() => setLoaded(true)}
              className="flex max-w-full"
              height={100}
              pageNumber={index + 1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            >
              <div
                className={`group absolute flex h-full w-full items-center justify-center ${
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
            </Page>
          ))}
        </div>
      </Document>
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
