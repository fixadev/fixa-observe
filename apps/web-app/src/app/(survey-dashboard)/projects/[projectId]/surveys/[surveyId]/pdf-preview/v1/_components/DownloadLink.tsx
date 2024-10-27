"use client";

import { PDFContent } from "./PDFContent";
import { Button } from "~/components/ui/button";
import { APIProvider } from "@vis.gl/react-google-maps";
import { env } from "~/env";
import { useCallback, useEffect, useState } from "react";
import Spinner from "~/components/Spinner";
import { generateStaticMapUrl } from "./CreateMapUrl";
import { usePDF } from "@react-pdf/renderer";
import type { Column, Property } from "../../../_components/PropertiesTable";

export function SurveyDownloadLink({
  buttonText,
  surveyName,
  properties,
  columns,
  propertyOrientation = "columns",
  setErrors,
}: {
  buttonText: string;
  surveyName: string;
  properties: Property[];
  columns: Column[];
  propertyOrientation?: "rows" | "columns";
  setErrors: (errors: { propertyId: string; error: string }[]) => void;
}) {
  const [mapLoaded, setMapLoaded] = useState(false);

  const parsedProperties = properties.map((property) => {
    return {
      ...property,
    };
  });

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

  const handleDownload = useCallback(async () => {
    const { staticMapUrl, errors } =
      await generateStaticMapUrl(parsedProperties);

    if (errors.length > 0) {
      setErrors(errors);
    }
    const propertiesWithoutErrors = parsedProperties?.filter(
      (property) => !errors.some((error) => error.propertyId === property.id),
    );

    updateInstance(
      <PDFContent
        mapImageData={staticMapUrl}
        surveyName={surveyName}
        properties={propertiesWithoutErrors ?? null}
        propertyOrientation={propertyOrientation}
        columns={columns}
      />,
    );
    setPendingDownload(true);
  }, [
    surveyName,
    parsedProperties,
    columns,
    updateInstance,
    propertyOrientation,
    setErrors,
  ]);

  return (
    <APIProvider
      apiKey={env.NEXT_PUBLIC_GOOGLE_API_KEY}
      onLoad={() => {
        setMapLoaded(true);
      }}
    >
      <div className="flex h-full flex-col">
        <Button
          variant="outline"
          disabled={!mapLoaded}
          onClick={handleDownload}
        >
          {instance.loading ? <Spinner /> : buttonText}
        </Button>
      </div>
    </APIProvider>
  );
}
