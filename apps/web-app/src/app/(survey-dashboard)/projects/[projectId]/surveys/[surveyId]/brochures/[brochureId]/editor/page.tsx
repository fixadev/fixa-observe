"use client";
import { PDFEditor } from "./_components/PDFEditor";

export default function Page({ params }: { params: { brochureId: string } }) {
  return (
    <div>
      <PDFEditor brochureId={params.brochureId} />
    </div>
  );
}
