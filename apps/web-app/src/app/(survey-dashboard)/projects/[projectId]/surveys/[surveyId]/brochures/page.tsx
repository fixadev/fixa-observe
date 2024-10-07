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
    <div className="flex h-full flex-col gap-10 overflow-y-auto p-6">
      {survey?.properties && survey?.properties.length > 0 ? (
        survey?.properties.map((property) => {
          return <BrochureCard key={property.id} propertyId={property.id} />;
        })
      ) : (
        <div className="items-center justify-center">
          No properties in this survey. Head over to the{" "}
          <a className="underline" href="./">
            properties tab
          </a>{" "}
          to add some.
        </div>
      )}
    </div>
  );
}
