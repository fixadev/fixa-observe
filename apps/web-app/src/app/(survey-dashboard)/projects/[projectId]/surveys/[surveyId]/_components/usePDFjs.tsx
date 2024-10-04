"use client";
import { useEffect, useState, useCallback } from "react";
import type * as PDFJS from "pdfjs-dist/types/src/pdf";

export const usePDFJS = (
  onLoad: (pdfjs: typeof PDFJS) => Promise<void> | void,
  deps: React.DependencyList = [],
) => {
  const [pdfjs, setPDFJS] = useState<typeof PDFJS | null>(null);

  // load the library once on mount (the webpack import automatically sets-up the worker)
  useEffect(() => {
    void import("pdfjs-dist/webpack.mjs").then((module) =>
      setPDFJS(module as typeof PDFJS),
    );
  }, []);

  // memoize the onLoad callback
  const memoizedOnLoad = useCallback(onLoad, deps);

  // execute the callback function whenever PDFJS loads (or a custom dependency-array updates)
  useEffect(() => {
    if (!pdfjs) return;

    const loadPDFJS = async () => {
      try {
        await memoizedOnLoad(pdfjs);
      } catch (error) {
        console.error("Error in PDFJS onLoad callback:", error);
      }
    };

    void loadPDFJS();
  }, [pdfjs, memoizedOnLoad]);

  return pdfjs;
};
