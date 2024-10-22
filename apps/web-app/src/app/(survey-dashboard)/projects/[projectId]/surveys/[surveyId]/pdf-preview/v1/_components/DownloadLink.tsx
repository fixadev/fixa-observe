"use client";

import { PDFContent } from "./PDFContent";
import { Button } from "~/components/ui/button";
import { APIProvider } from "@vis.gl/react-google-maps";
import { env } from "~/env";
import { useEffect, useRef, useState } from "react";
import Spinner from "~/components/Spinner";
import { generateStaticMapUrl } from "./CreateMapUrl";
import { PDFDownloadLink } from "@react-pdf/renderer";

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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  useEffect(() => {
    if (!isPdfGenerating && pendingClick && buttonRef.current && mapUrl) {
      setPendingClick(false);
      console.log("programmatically clicking button");
      console.log("button ref is ", buttonRef.current);
      buttonRef.current.click();
    }
  }, [isPdfGenerating, pendingClick, mapUrl]);

  const parsedProperties = properties.map((property) => {
    return {
      ...property,
      attributes: property.attributes,
    };
  });

  useEffect(() => {
    const fetchMapUrl = async () => {
      console.log("fetching map url");
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

  if (!properties) {
    return <Spinner />;
  }

  return (
    <APIProvider
      apiKey={env.NEXT_PUBLIC_GOOGLE_API_KEY}
      onLoad={() => {
        console.log("Maps API has loaded.");
        setMapLoaded(true);
      }}
    >
      <div className="flex h-full flex-col">
        <PDFDownloadLink
          fileName={`${surveyName}.pdf`}
          document={
            <PDFContent
              mapImageData={mapUrl}
              surveyName={surveyName}
              properties={parsedProperties ?? null}
              attributes={
                attributes?.filter((attribute) => attribute.id !== "address") ??
                null
              }
            />
          }
        >
          {/* @ts-expect-error this is a bug in the @react-pdf/renderer library */}
          {({ loading }: { loading: boolean }) => {
            setIsPdfGenerating(loading);
            return (
              <Button
                ref={buttonRef}
                className="w-full"
                variant="outline"
                disabled={pendingClick}
                onClick={() => {
                  console.log("inside onClick");
                  if (isPdfGenerating) {
                    console.log("setting pending click");
                    setPendingClick(true);
                  } else {
                    console.log("hit the button");
                  }
                }}
              >
                {pendingClick ? <Spinner /> : buttonText}
              </Button>
            );
          }}
        </PDFDownloadLink>
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
