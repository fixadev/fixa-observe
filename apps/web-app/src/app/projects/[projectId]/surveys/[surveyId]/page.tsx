"use client";
import PageHeader from "~/components/PageHeader";
import { Button } from "~/components/ui/button";
import BuildingsTable from "./_components/BuildingsTable";
import { api } from "~/trpc/react";
import { useEffect } from "react";

export default function SurveyPage({
  params,
}: {
  params: { projectId: string; surveyId: string };
}) {
  const {
    data: survey,
    isLoading,
    error,
  } = api.survey.getSurvey.useQuery({
    surveyId: params.surveyId,
  });

  useEffect(() => {
    console.log(error);
  }, [error]);

  console.log(error);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <PageHeader title={survey?.name ?? ""} />
        <Button variant="outline">Export PDF</Button>
      </div>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="text-lg font-medium">Buildings</div>
          <div className="flex items-center gap-2">
            <Button>Add building</Button>
            <Button>Upload CSV</Button>
          </div>
        </div>
        <BuildingsTable
          buildings={survey?.buildings ?? []}
          projectId={params.projectId}
          surveyId={params.surveyId}
        />
      </div>
    </div>
  );
}
