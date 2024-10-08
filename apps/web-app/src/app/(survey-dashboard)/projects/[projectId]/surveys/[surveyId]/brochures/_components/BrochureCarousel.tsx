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

export function BrochureCarousel({ brochure }: { brochure: BrochureSchema }) {
  const [numPages, setNumPages] = useState<number>(0);
  const [loaded, setLoaded] = useState<boolean>(false);

  const pdfUrl = `/api/cors-proxy?url=${encodeURIComponent(brochure.url)}`;

  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoaded(true);
  }

  // TODO: fix this styling

  return (
    <div className="w-5/6 flex-col items-center justify-center">
      <Document
        className={loaded ? "" : "hidden" + " flex max-w-full flex-col"}
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Carousel>
          <CarouselContent>
            {Array.from(new Array(numPages), (el, index) => (
              <CarouselItem
                key={`page_${index + 1}`}
                className="flex flex-col items-center justify-center object-contain px-6"
              >
                <Page
                  onLoad={() => setLoaded(true)}
                  className="flex h-[100px] max-w-full"
                  pageNumber={index + 1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
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
