"use client";
import { PDFEditor } from "./_components/PDFEditor";

export default function Page({ params }: { params: { brochureId: string } }) {
  return <PDFEditor brochureId={params.brochureId} />;
}
