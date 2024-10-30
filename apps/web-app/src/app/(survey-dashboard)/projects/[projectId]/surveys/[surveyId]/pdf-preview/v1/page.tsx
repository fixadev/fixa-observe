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
import { generateStaticMapboxUrl } from "./_components/CreateMapboxUrl";
import { type PropertyWithIncludes } from "~/hooks/useSurvey";

export default function PDFPreviewPage({
  params,
}: {
  params: { projectId: string; surveyId: string };
}) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [propertiesWithStreetAddresses, setPropertiesWithStreetAddresses] =
    useState<(PropertyWithIncludes & { streetAddress: string })[] | null>(null);

  const router = useRouter();
  const { data: survey } = api.survey.get.useQuery(
    { surveyId: params.surveyId },
    {
      refetchOnMount: true,
      staleTime: 0,
    },
  );

  const { mutateAsync: extractStreetAddresses } =
    api.property.extractStreetAddresses.useMutation();

  useEffect(() => {
    const fetchMapUrl = async () => {
      if (survey?.properties && mapLoaded) {
        try {
          const { staticMapUrl } = await generateStaticMapboxUrl(
            survey.properties,
          );
          setMapUrl(staticMapUrl);
          const streetAddresses = await extractStreetAddresses({
            properties: survey?.properties ?? [],
          });

          const updatedProperties = survey?.properties?.map(
            (property, index) => ({
              ...property,
              streetAddress: streetAddresses[index] ?? "",
            }),
          );
          setPropertiesWithStreetAddresses(updatedProperties);
        } catch (err) {
          console.error("Failed to generate static map URL:", err);
        }
      }
    };

    void fetchMapUrl();
  }, [survey?.properties, mapLoaded, extractStreetAddresses]);

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
              propertyOrientation="columns"
              surveyName={survey?.name ?? null}
              properties={propertiesWithStreetAddresses ?? null}
              columns={survey?.columns ?? null}
            />
          </PDFViewer>
        </div>
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
