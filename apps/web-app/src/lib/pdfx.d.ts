import { type PDFDocumentProxy } from "pdfjs-dist";

declare module "./pdfx.mjs" {
  export { PDFDocumentProxy };

  export interface GlobalWorkerOptions {
    workerSrc: string;
  }

  export function getDocument(url: string | Uint8Array): {
    promise: Promise<PDFDocumentProxy>;
  };

  export const GlobalWorkerOptions: GlobalWorkerOptions;
}
