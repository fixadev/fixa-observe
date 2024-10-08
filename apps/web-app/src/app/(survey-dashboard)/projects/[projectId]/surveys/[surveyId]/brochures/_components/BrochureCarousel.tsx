"use client";
import { useState, useRef, useEffect } from "react";
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

  return (
    <div className="h-full w-3/4 items-center justify-center">
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        {loaded ? (
          <Carousel>
            <CarouselContent>
              {Array.from(new Array(numPages), (el, index) => (
                <CarouselItem
                  key={`page_${index + 1}`}
                  className="flex h-[600px] flex-col items-center justify-center object-contain"
                >
                  <Page
                    className="max-h-full w-auto"
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
        ) : (
          <div className="flex h-[600px] flex-col items-center justify-center bg-gray-100">
            <Spinner className="h-10 w-10 text-gray-500" />
          </div>
        )}
      </Document>
    </div>
  );
}
