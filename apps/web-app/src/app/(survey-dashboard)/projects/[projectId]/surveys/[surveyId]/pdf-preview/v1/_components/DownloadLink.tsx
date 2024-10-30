"use client";

import { PDFContent } from "./PDFContent";
import { Button } from "~/components/ui/button";
import { APIProvider } from "@vis.gl/react-google-maps";
import { env } from "~/env";
import { useCallback, useEffect, useState } from "react";
import Spinner from "~/components/Spinner";
import { usePDF } from "@react-pdf/renderer";
import type { Column, Property } from "../../../_components/PropertiesTable";
import { api } from "~/trpc/react";
import { generateStaticMapboxUrl } from "./CreateMapboxUrl";

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
  const [instance, updateInstance] = usePDF({ document: undefined });
  const [pendingDownload, setPendingDownload] = useState(false);
  const [creatingPdf, setCreatingPdf] = useState(false);

  const { mutateAsync: extractStreetAddresses } =
    api.property.extractStreetAddresses.useMutation();

  useEffect(() => {
    if (instance.url && !instance.loading && pendingDownload) {
      const link = document.createElement("a");
      link.href = instance.url;
      link.download = `${surveyName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setPendingDownload(false);
      setCreatingPdf(false);
    }
  }, [instance.url, instance.loading, pendingDownload, surveyName]);

  const handleDownload = useCallback(async () => {
    setCreatingPdf(true);
    const { staticMapUrl, errors } = await generateStaticMapboxUrl(properties);

    const streetAddresses = await extractStreetAddresses({ properties });

    if (errors.length > 0) {
      setErrors(errors);
    }
    const propertiesWithoutErrors = properties
      ?.filter(
        (property) => !errors.some((error) => error.propertyId === property.id),
      )
      .map((property, index) => ({
        ...property,
        streetAddress: streetAddresses[index] ?? "",
      }));

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
    properties,
    columns,
    updateInstance,
    propertyOrientation,
    setErrors,
    extractStreetAddresses,
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
          {instance.loading || creatingPdf ? <Spinner /> : buttonText}
        </Button>
      </div>
    </APIProvider>
  );
}
