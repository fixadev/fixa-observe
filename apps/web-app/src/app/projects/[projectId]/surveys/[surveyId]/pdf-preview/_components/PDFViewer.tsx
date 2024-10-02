"use client";

import dynamic from "next/dynamic";
import { PDFViewer as ReactPDFViewer } from "@react-pdf/renderer";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
  },
) as typeof ReactPDFViewer;

export default PDFViewer;
