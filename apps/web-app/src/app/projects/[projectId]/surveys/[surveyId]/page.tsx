import PageHeader from "~/components/PageHeader";

export default function SurveyPage({
  params,
}: {
  params: { projectId: string; surveyId: string };
}) {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Survey Name" />
    </div>
  );
}
