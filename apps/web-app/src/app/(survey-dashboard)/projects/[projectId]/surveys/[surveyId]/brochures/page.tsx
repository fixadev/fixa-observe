"use client";
import { api } from "~/trpc/react";
import { BrochureCard } from "./_components/BrochureCard";
import Spinner from "~/components/Spinner";
import Link from "next/link";

export default function BrochuresPage({
  params,
}: {
  params: { projectId: string; surveyId: string };
}) {
  const { data: survey, isLoading } = api.survey.getSurvey.useQuery({
    surveyId: params.surveyId,
  });

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <Spinner className="h-10 w-10 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-10 overflow-y-auto p-6">
      {survey?.properties && survey?.properties.length > 0 ? (
        survey?.properties.map((property) => {
          return <BrochureCard key={property.id} propertyId={property.id} />;
        })
      ) : (
        <div className="items-center justify-center">
          No properties in this survey. Head over to the{" "}
          <Link className="underline" href="./">
            properties tab
          </Link>{" "}
          to add some.
        </div>
      )}
    </div>
  );
}
