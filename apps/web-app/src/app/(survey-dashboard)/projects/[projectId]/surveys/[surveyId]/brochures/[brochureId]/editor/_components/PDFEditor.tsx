"use client";
import { useEffect, useRef } from "react";
import WebViewer from "@pdftron/webviewer";
import { type WebViewerInstance } from "@pdftron/webviewer";
import { api } from "~/trpc/react";

export function PDFEditor({ brochureId }: { brochureId: string }) {
  const viewer = useRef<HTMLDivElement>(null);

  const { data: brochure } = api.property.getBrochure.useQuery({ brochureId });
  const { mutate: updateBrochure } = api.property.updateBrochure.useMutation();

  useEffect(() => {
    if (!viewer.current || !brochure?.url) return;
    const pdfUrl = `/api/cors-proxy?url=${encodeURIComponent(brochure?.url)}`;
    WebViewer(
      {
        path: "/webviewer",
        licenseKey:
          "demo:1728170968297:7e0ea7650300000000041877ec6052c6844be73caf56f235d46ab9cb3e",
        initialDoc: pdfUrl,
      },
      viewer.current,
    )
      .then((instance: WebViewerInstance) => {
        const { documentViewer, annotationManager } = instance.Core;
        instance.UI.enableFeatures([instance.UI.Feature.ContentEdit]);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        instance.UI.setToolbarGroup(instance.UI.ToolbarGroup.EDIT_TEXT);
        instance.UI.openElements(["leftPanel"]);
        // instance.UI.closeElements(["rightPanel"]);
        // Add header button that will get file data on click
        instance.UI.setHeaderItems((header) => {
          header.push({
            type: "actionButton",
            img: "...",
            onClick: async () => {
              const doc = documentViewer.getDocument();
              const xfdfString = await annotationManager.exportAnnotations();
              const data = await doc.getFileData({
                // saves the document with annotations in it
                xfdfString,
              });
              const arr = new Uint8Array(data);
              const blob = new Blob([arr], { type: "application/pdf" });

              console.log("PDF Blob: ", blob);

              const formData = new FormData();
              // TODO: add title to file
              formData.append("file", blob, "annotated.pdf");

              const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
              });

              const uploadedFile: { url: string; type: string } =
                (await response.json()) as { url: string; type: string };

              if (uploadedFile.url) {
                updateBrochure({
                  ...brochure,
                  url: uploadedFile.url,
                });
              }
            },
          });
          header.push({
            type: "actionButton",
            img: "...",
            onClick: async () => {
              void documentViewer.getContentEditHistoryManager().undo();
              console.log("Undid!");
            },
          });
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [brochure?.url, updateBrochure, brochure]);

  return (
    <div className="h-full">
      <div ref={viewer} style={{ height: "95vh" }}></div>
    </div>
  );
}
