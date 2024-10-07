"use client";

import PDFViewer from "./_components/PDFViewer";
import { api } from "~/trpc/react";
import { PDFContent } from "./_components/PDFContent";

export default function PDFPreviewPage({
  params,
}: {
  params: { surveyId: string };
}) {
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
    // <PDFViewer style={{ width: "100%", height: "90vh" }}>
    //   <PDFContent
    //     surveyName={survey?.name ?? null}
    //     properties={parsedProperties ?? null}
    //     attributes={attributes ?? null}
    //   />
    // </PDFViewer>
    <div></div>
  );
}
