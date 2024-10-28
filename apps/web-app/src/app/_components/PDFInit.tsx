"use client";

import { useEffect } from "react";
import { GlobalWorkerOptions } from "~/lib/pdfx.mjs";

export function PdfWorkerInit() {
  useEffect(() => {
    GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.mjs`;
  }, []);

  return null;
}
