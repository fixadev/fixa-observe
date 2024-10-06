"use client";
import { useState, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "~/components/ui/carousel";
import { type BrochureSchema } from "~/lib/property";
import { usePDFJS } from "../../_components/usePDFjs";
import { type PDFDocumentProxy } from "pdfjs-dist";

export function BrochureCarousel({ brochure }: { brochure: BrochureSchema }) {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const pdfUrl = `/api/cors-proxy?url=${encodeURIComponent(brochure.url)}`;

  usePDFJS(
    async (pdfjs) => {
      const loadedPdf = await pdfjs.getDocument(pdfUrl).promise;
      setPdf(loadedPdf);
      setNumPages(loadedPdf.numPages);
    },
    [brochure.url],
  );

  const renderPage = async (pageNum: number) => {
    if (!pdf || !canvasRef.current) return;

    const page = await pdf.getPage(pageNum);
    const scale = 1.5;
    const viewport = page.getViewport({ scale });
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render({ canvasContext: context!, viewport }).promise;
  };

  return (
    <div className="h-[300px] w-[300px]">
      <Carousel>
        <CarouselContent>
          {Array.from({ length: numPages }, (_, index) => (
            <CarouselItem key={`page_${index + 1}`}>
              <canvas
                ref={canvasRef}
                className="h-full w-full"
                onLoad={() => renderPage(index + 1)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
