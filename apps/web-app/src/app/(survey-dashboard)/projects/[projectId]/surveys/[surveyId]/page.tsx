import { PropertiesTable } from "./_components/PropertiesTable";

export default function SurveyPage({
  params,
}: {
  params: { projectId: string; surveyId: string };
}) {
  return (
    <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col overflow-y-auto p-4 lg:p-6">
      <PropertiesTable surveyId={params.surveyId} />
    </div>
  );
}
