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

export function BrochureCarousel({ brochure }: { brochure: BrochureSchema }) {
  const [numPages, setNumPages] = useState<number>(0);

  const pdfUrl = `/api/cors-proxy?url=${encodeURIComponent(brochure.url)}`;

  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="h-full w-3/4 items-center justify-center">
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Carousel>
          <CarouselContent>
            {Array.from(new Array(numPages), (el, index) => (
              <CarouselItem
                key={`page_${index + 1}`}
                className="flex h-[600px] flex-col items-center justify-center"
              >
                <Page
                  className="max-h-full w-auto object-contain"
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
    </div>
  );
}
