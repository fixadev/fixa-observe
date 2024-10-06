"use client";
import { api } from "~/trpc/react";
import { BrochureCard } from "./_components/BrochureCard";
export default function BrochuresPage({
  params,
}: {
  params: { projectId: string; surveyId: string };
}) {
  const { data: survey } = api.survey.getSurvey.useQuery({
    surveyId: params.surveyId,
  });
  return (
    <div className="flex flex-col gap-4 p-6">
      {survey?.properties.map((property) => {
        return (
          <div key={property.id}>
            <BrochureCard propertyId={property.id} />
          </div>
        );
      })}
    </div>
  );
}
