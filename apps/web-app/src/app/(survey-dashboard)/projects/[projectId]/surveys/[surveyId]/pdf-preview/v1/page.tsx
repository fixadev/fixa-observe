"use client";

import PDFViewer from "./_components/PDFViewer";
import { api } from "~/trpc/react";
import { PDFContent } from "./_components/PDFContent";
import { Button } from "~/components/ui/button";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { MapRenderer } from "./_components/MapRenderer";
import { APIProvider } from "@vis.gl/react-google-maps";
import { env } from "~/env";
import { useState } from "react";

export default function PDFPreviewPage({
  params,
}: {
  params: { surveyId: string };
}) {
  const [showMap, setShowMap] = useState(false);
  const [mapImage, setMapImage] = useState<string | null>(null);
  const router = useRouter();
  const { data: survey } = api.survey.getSurvey.useQuery({
    surveyId: params.surveyId,
  });
  const { data: attributes } = api.survey.getSurveyAttributes.useQuery({
    surveyId: params.surveyId,
  });

  const parsedProperties = survey?.properties.map((property) => {
    return {
      ...property,
      attributes: property.attributes as Record<string, string>,
    };
  });

  return (
    <APIProvider
      apiKey={env.NEXT_PUBLIC_GOOGLE_API_KEY}
      onLoad={() => {
        console.log("Maps API has loaded.");
        setShowMap(true);
      }}
    >
      <div className="h-full overflow-y-hidden">
        <div className="flex flex-row items-center py-2">
          <Button variant={"ghost"} onClick={() => router.back()}>
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Back to properties
          </Button>
          <Button variant={"ghost"} onClick={() => setShowMap(!showMap)}>
            toggle map
          </Button>
        </div>

        <PDFViewer style={{ width: "100%", height: "90vh" }}>
          <PDFContent
            mapImageData={mapImage}
            surveyName={survey?.name ?? null}
            properties={parsedProperties ?? null}
            attributes={attributes ?? null}
          />
        </PDFViewer>
        {showMap && (
          <div className="mt-50%">
            <MapRenderer
              properties={parsedProperties ?? []}
              mapLoaded={showMap}
              mapImageData={mapImage}
              onMapImageCapture={setMapImage}
            />
          </div>
        )}
      </div>
    </APIProvider>
  );
}
