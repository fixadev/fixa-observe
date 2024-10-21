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
import { useEffect, useState } from "react";
import Spinner from "~/components/Spinner";

export default function PDFPreviewPage({
  params,
}: {
  params: { surveyId: string };
}) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapImage, setMapImage] = useState<string | null>(null);
  const [mapCaptured, setMapCaptured] = useState(false);
  const [reactPDFReady, setReactPDFReady] = useState(false);

  // hacky but it works
  useEffect(() => {
    if (mapCaptured) {
      setTimeout(() => {
        setReactPDFReady(true);
      }, 500);
    }
  }, [mapCaptured]);

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
        setMapLoaded(true);
      }}
    >
      <div className="flex h-full flex-col">
        {mapLoaded && (
          <div className="absolute opacity-0">
            <MapRenderer
              properties={parsedProperties ?? []}
              mapLoaded={mapLoaded}
              mapImageData={mapImage}
              onMapImageCapture={setMapImage}
              setMapCaptured={setMapCaptured}
            />
          </div>
        )}
        {!reactPDFReady && (
          <div className="flex h-full w-full items-center justify-center">
            <Spinner className="h-10 w-10" />
          </div>
        )}
        <div
          className={`h-full w-full ${
            mapCaptured && reactPDFReady ? "" : "hidden"
          }`}
        >
          <div className="flex flex-row items-center py-2">
            <Button variant={"ghost"} onClick={() => router.back()}>
              <ChevronLeftIcon className="mr-2 h-4 w-4" />
              Back to properties
            </Button>
          </div>

          <PDFViewer style={{ width: "100%", height: "90vh" }}>
            <PDFContent
              mapImageData={mapImage}
              surveyName={survey?.name ?? null}
              properties={parsedProperties ?? null}
              attributes={
                attributes?.filter((attribute) => attribute.id !== "address") ??
                null
              }
            />
          </PDFViewer>
        </div>
      </div>
    </APIProvider>
  );
}
