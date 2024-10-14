"use client";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "~/components/ui/carousel";
import { type BrochureSchema } from "~/lib/property";
import { Document, Page, pdfjs } from "react-pdf";
import Spinner from "~/components/Spinner";
import { MaskGenerator } from "./MaskGenerator";
import { ConfirmRemovePopup } from "./ConfirmRemovePopup";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";
import { TrashIcon } from "@heroicons/react/24/outline";

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
  const [rectangles, setRectangles] = useState<
    Array<{
      pageNumber: number;
      containerWidth: number;
      containerHeight: number;
      objects: Array<{ x: number; y: number; width: number; height: number }>;
    }>
  >([]);

  const [deletedPages, setDeletedPages] = useState<Array<number>>([]);

  const { toast } = useToast();

  const pdfUrl = `/api/cors-proxy?url=${encodeURIComponent(brochure.url)}`;

  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoaded(true);
  }

  const { mutate: removeObjects } = api.property.removeObjects.useMutation({
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
    removeObjects({
      brochureId: brochure.id,
      objectsToRemoveByPage: rectangles,
    });
    setRectangles([]);
  }

  // TODO: fix this styling

  return (
    <div className="w-5/6 flex-col items-center justify-center">
      <Document
        className={loaded ? "" : "hidden" + " flex max-w-full flex-col"}
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Carousel opts={{ watchDrag: false }}>
          <CarouselContent>
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
                        rectangles={rectangles}
                        setRectangles={setRectangles}
                      />
                      {isRemoving && (
                        <div className="absolute flex h-full w-full items-center justify-center bg-white/50">
                          <Spinner className="h-10 w-10 text-gray-500" />
                        </div>
                      )}
                    </Page>
                  </CarouselItem>
                ),
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
          {rectangles.some((page) => page.objects.length > 0) &&
            !isRemoving &&
            !isMouseDown && (
              <ConfirmRemovePopup
                onConfirm={handleRemoveObjects}
                onCancel={() => {
                  setRectangles([]);
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
        className={
          loaded
            ? "hidden"
            : "flex h-[600px] w-full flex-col items-center justify-center bg-gray-100"
        }
      >
        <Spinner className="h-10 w-10 text-gray-500" />
      </div>
    </div>
  );
}
