import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PDFPage from "./PDFPage";
import jsPDF from "jspdf";
import { type Brochure } from "prisma/generated/zod";
import { type PDFDocumentProxy } from "pdfjs-dist";
import { getDocument, GlobalWorkerOptions } from "~/lib/pdfx.mjs";
import {
  type BrochureRectangles,
  type Path,
  type TransformedTextContent,
} from "~/lib/property";

interface BrochurePDFRendererProps {
  brochure: Brochure;
  onPDFGenerated: (pdfBlob: Blob) => void;
}

export function BrochurePDFRenderer({
  brochure,
  onPDFGenerated,
}: BrochurePDFRendererProps) {
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
        setPagesLoaded(0);
        // setLoaded(true);
      })
      .catch((error: unknown) => {
        console.error("Error loading PDF", error);
      });
  }, [brochure.deletedPages.length, pdfUrl]);
  // #endregion

  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const [pagesLoaded, setPagesLoaded] = useState(0);
  const deletedPages = useMemo(() => {
    return new Set(brochure.deletedPages);
  }, [brochure.deletedPages]);
  const inpaintedRectangles = useMemo(() => {
    return (brochure.inpaintedRectangles as BrochureRectangles) ?? [];
  }, [brochure.inpaintedRectangles]);
  const textToRemove = useMemo(() => {
    return (brochure.textToRemove as TransformedTextContent[]) ?? [];
  }, [brochure.textToRemove]);
  const pathsToRemove = useMemo(() => {
    return (brochure.pathsToRemove as Path[]) ?? [];
  }, [brochure.pathsToRemove]);
  const idsToShow = useMemo(() => {
    return new Set(brochure.undoStack);
  }, [brochure.undoStack]);

  const generatePDF = useCallback(() => {
    if (!canvasRefs.current[0]) return;
    const canvas = canvasRefs.current[0];
    const orientation = canvas.width > canvas.height ? "landscape" : "portrait";
    const pdf = new jsPDF({
      format: [canvas.width, canvas.height],
      orientation: orientation,
    });

    let isFirstPage = true;
    for (let i = 0; i < numPages; i++) {
      if (deletedPages.has(i)) continue;
      const canvas = canvasRefs.current[i];
      if (canvas) {
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        if (!isFirstPage) {
          pdf.addPage(
            [canvas.width, canvas.height],
            canvas.width > canvas.height ? "l" : "p",
          );
        }
        pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);

        isFirstPage = false;
      }
    }

    const pdfBlob = pdf.output("blob");
    onPDFGenerated(pdfBlob);
  }, [onPDFGenerated, numPages, deletedPages]);

  useEffect(() => {
    if (pagesLoaded === numPages - brochure.deletedPages.length) {
      generatePDF();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagesLoaded]);

  if (!pdf) return null;
  return (
    <div className="hidden">
      {Array.from(new Array(numPages), (el, index) => {
        if (deletedPages.has(index)) {
          return null;
        }
        return (
          <PDFPage
            key={`page_${index + 1}`}
            onCanvasRef={(el) => (canvasRefs.current[index] = el)}
            pdf={pdf}
            pageIndex={index}
            inpaintedRectangles={inpaintedRectangles}
            textToRemove={textToRemove}
            pathsToRemove={pathsToRemove}
            idsToShow={idsToShow}
            onPageLoaded={() => setPagesLoaded((prev) => prev + 1)}
          />
        );
      })}
    </div>
  );
}
