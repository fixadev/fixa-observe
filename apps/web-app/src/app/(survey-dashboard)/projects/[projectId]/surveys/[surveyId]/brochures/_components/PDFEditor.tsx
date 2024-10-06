"use client";
import { useEffect, useRef } from "react";
import WebViewer from "@pdftron/webviewer";
import { type WebViewerInstance } from "@pdftron/webviewer";
export default function PDFEditor({}: {
  brochureUrl: string;
  propertyId: string;
}) {
  const viewer = useRef<WebViewerInstance | null>(null);

  useEffect(() => {
    WebViewer(
      {
        path: "/webviewer",
        licenseKey:
          "demo:1728170968297:7e0ea7650300000000041877ec6052c6844be73caf56f235d46ab9cb3e",
        initialDoc:
          "https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf",
      },
      viewer.current,
    )
      .then((instance: WebViewerInstance) => {
        const { documentViewer, annotationManager } = instance.Core;
        instance.UI.enableFeatures([instance.UI.Feature.ContentEdit]);
        instance.UI.setToolbarGroup(instance.UI.ToolbarGroup.EDIT_TEXT);
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

              // Add code for handling Blob here
            },
          });
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="MyComponent">
      <div className="webviewer" ref={viewer} style={{ height: "100vh" }}></div>
    </div>
  );
}
