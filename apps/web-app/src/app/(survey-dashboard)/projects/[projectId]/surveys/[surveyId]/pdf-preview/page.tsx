"use client";

import PDFViewer from "./_components/PDFViewer";
import { api } from "~/trpc/react";
import { PDFContent } from "./_components/PDFContent";
import { Button } from "~/components/ui/button";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function PDFPreviewPage({
  params,
}: {
  params: { surveyId: string };
}) {
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
    <div className="h-full">
      <div className="flex flex-row items-center py-2">
        <Button variant={"ghost"} onClick={() => router.back()}>
          <ChevronLeftIcon className="mr-2 h-4 w-4" />
          Back to properties
        </Button>
      </div>

      <PDFViewer style={{ width: "100%", height: "90vh" }}>
        <PDFContent
          surveyName={survey?.name ?? null}
          properties={parsedProperties ?? null}
          attributes={attributes ?? null}
        />
      </PDFViewer>
    </div>
  );
}
