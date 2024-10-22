"use client";

import { PDFContent } from "./PDFContent";
import { Button } from "~/components/ui/button";
import { APIProvider } from "@vis.gl/react-google-maps";
import { env } from "~/env";
import { useCallback, useEffect, useRef, useState } from "react";
import Spinner from "~/components/Spinner";
import { generateStaticMapUrl } from "./CreateMapUrl";
import { usePDF } from "@react-pdf/renderer";

import { type PropertySchema, type AttributeSchema } from "~/lib/property";

export function SurveyDownloadLink({
  buttonText,
  surveyName,
  properties,
  attributes,
}: {
  buttonText: string;
  surveyName: string;
  properties: PropertySchema[];
  attributes: AttributeSchema[];
}) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [pendingClick, setPendingClick] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  const parsedProperties = properties.map((property) => {
    return {
      ...property,
      attributes: property.attributes,
    };
  });

  useEffect(() => {
    const fetchMapUrl = async () => {
      if (parsedProperties && mapLoaded) {
        try {
          const url = await generateStaticMapUrl(parsedProperties);
          setMapUrl(url);
        } catch (err) {
          console.error("Failed to generate static map URL:", err);
        }
      }
    };

    void fetchMapUrl();
  }, [parsedProperties, mapLoaded]);

  const pdfDocument = (
    <PDFContent
      mapImageData={mapUrl}
      surveyName={surveyName}
      properties={parsedProperties ?? null}
      attributes={
        attributes?.filter((attribute) => attribute.id !== "address") ?? null
      }
    />
  );

  const [instance, updateInstance] = usePDF({ document: pdfDocument });

  const handleDownload = useCallback(() => {
    if (instance.url) {
      const link = document.createElement("a");
      link.href = instance.url;
      link.download = `${surveyName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [instance.url, surveyName]);

  return (
    <APIProvider
      apiKey={env.NEXT_PUBLIC_GOOGLE_API_KEY}
      onLoad={() => {
        console.log("Maps API has loaded.");
        setMapLoaded(true);
      }}
    >
      <div className="flex h-full flex-col">
        <Button onClick={handleDownload}>Download PDF</Button>
      </div>
    </APIProvider>
  );
}

{
  /* <PDFDownloadLink
  document={<PDFPreviewPage params={{ projectId, surveyId }} />}
  fileName="survey.pdf"
>
  Download PDF
</PDFDownloadLink>; */
}
