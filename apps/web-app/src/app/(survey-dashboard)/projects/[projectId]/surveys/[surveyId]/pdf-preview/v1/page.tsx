"use client";

import PDFViewer from "./_components/PDFViewer";
import { api } from "~/trpc/react";
import { PDFContent } from "./_components/PDFContent";
import { Button } from "~/components/ui/button";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { APIProvider } from "@vis.gl/react-google-maps";
import { env } from "~/env";
import { useEffect, useState } from "react";
import Spinner from "~/components/Spinner";
import { generateStaticMapUrl } from "./_components/CreateMapUrl";

export default function PDFPreviewPage({
  params,
}: {
  params: { projectId: string; surveyId: string };
}) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapUrl, setMapUrl] = useState<string | null>(null);

  const router = useRouter();
  const { data: survey } = api.survey.getSurvey.useQuery(
    { surveyId: params.surveyId },
    {
      refetchOnMount: true,
      staleTime: 0,
    },
  );
  const { data: attributes } = api.survey.getSurveyAttributes.useQuery(
    { surveyId: params.surveyId },
    {
      refetchOnMount: true,
      staleTime: 0,
    },
  );

  const parsedProperties = survey?.properties.map((property) => {
    return {
      ...property,
      attributes: property.attributes as Record<string, string>,
    };
  });

  useEffect(() => {
    const fetchMapUrl = async () => {
      if (parsedProperties) {
        try {
          const url = await generateStaticMapUrl(parsedProperties);
          setMapUrl(url);
        } catch (err) {
          console.error("Failed to generate static map URL:", err);
        }
      }
    };

    void fetchMapUrl();
  }, [parsedProperties]);

  return (
    <APIProvider
      apiKey={env.NEXT_PUBLIC_GOOGLE_API_KEY}
      onLoad={() => {
        console.log("Maps API has loaded.");
        setMapLoaded(true);
      }}
    >
      <div className="flex h-full flex-col">
        {!mapUrl && (
          <div className="flex h-full w-full items-center justify-center">
            <Spinner className="h-10 w-10" />
          </div>
        )}
        <div className={`h-full w-full ${mapUrl ? "" : "hidden"}`}>
          <div className="flex flex-row items-center py-2">
            <Button
              variant={"ghost"}
              onClick={() => {
                console.log("projectId", params.projectId);
                console.log("surveyId", params.surveyId);
                router.push(
                  `/projects/${params.projectId}/surveys/${params.surveyId}`,
                );
              }}
            >
              <ChevronLeftIcon className="mr-2 h-4 w-4" />
              Back to properties
            </Button>
          </div>

          <PDFViewer style={{ width: "100%", height: "90vh" }}>
            <PDFContent
              mapImageData={mapUrl}
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
