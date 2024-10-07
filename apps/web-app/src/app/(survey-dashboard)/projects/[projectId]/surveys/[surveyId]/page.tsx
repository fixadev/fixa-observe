import { PropertiesTable } from "./_components/PropertiesTable";

export default function SurveyPage({
  params,
}: {
  params: { projectId: string; surveyId: string };
}) {
  return (
    <div className="max-w-screen-3xl mx-auto flex w-full flex-col p-4 lg:p-6">
      <PropertiesTable surveyId={params.surveyId} />
    </div>
  );
}
