"use client";

import { PDFContent } from "./PDFContent";
import { Button } from "~/components/ui/button";
import { APIProvider } from "@vis.gl/react-google-maps";
import { env } from "~/env";
import { useCallback, useEffect, useState } from "react";
import Spinner from "~/components/Spinner";
import { generateStaticMapUrl } from "./CreateMapUrl";
import { usePDF } from "@react-pdf/renderer";

import { type PropertySchema, type AttributeSchema } from "~/lib/property";

export function SurveyDownloadLink({
  buttonText,
  surveyName,
  properties,
  attributes,
  propertyOrientation = "rows",
}: {
  buttonText: string;
  surveyName: string;
  properties: PropertySchema[];
  attributes: AttributeSchema[];
  propertyOrientation?: "rows" | "columns";
}) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapUrl, setMapUrl] = useState<string | null>(null);

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

  const [instance, updateInstance] = usePDF({ document: undefined });
  const [pendingDownload, setPendingDownload] = useState(false);

  useEffect(() => {
    if (instance.url && !instance.loading && pendingDownload) {
      const link = document.createElement("a");
      link.href = instance.url;
      link.download = `${surveyName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setPendingDownload(false);
    }
  }, [instance.url, instance.loading, pendingDownload, surveyName]);

  const handleDownload = useCallback(() => {
    updateInstance(
      <PDFContent
        mapImageData={mapUrl}
        surveyName={surveyName}
        properties={parsedProperties ?? null}
        attributes={
          attributes?.filter((attribute) => attribute.id !== "address") ?? null
        }
      />,
    );
    setPendingDownload(true);
  }, [surveyName, parsedProperties, attributes, mapUrl, updateInstance]);

  return (
    <APIProvider
      apiKey={env.NEXT_PUBLIC_GOOGLE_API_KEY}
      onLoad={() => {
        console.log("Maps API has loaded.");
        setMapLoaded(true);
      }}
    >
      <div className="flex h-full flex-col">
        <Button variant="outline" onClick={handleDownload}>
          {instance.loading ? <Spinner /> : buttonText}
        </Button>
      </div>
    </APIProvider>
  );
}
