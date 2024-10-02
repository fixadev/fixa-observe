"use client";
import React from "react";
import PDFViewer from "./_components/PDFViewer";
import { api } from "~/trpc/react";
import { PDFContent } from "./_components/PDFContent";

// Assuming MyDocument is defined in a separate file

export default function PDFPreviewPage({
  params,
}: {
  params: { projectId: string; surveyId: string };
}) {
  const { data: survey } = api.survey.getSurvey.useQuery({
    surveyId: params.surveyId,
  });
  const { data: attributes } = api.building.getAttributes.useQuery();

  const parsedBuildings = survey?.buildings.map((building) => {
    return {
      ...building,
      attributes: building.attributes as Record<string, string>,
    };
  });

  return (
    <PDFViewer style={{ width: "100%", height: "90vh" }}>
      <PDFContent
        surveyName={survey?.name ?? null}
        buildings={parsedBuildings ?? null}
        attributes={attributes ?? null}
      />
    </PDFViewer>
  );
}
