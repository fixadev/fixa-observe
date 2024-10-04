import { Button } from "~/components/ui/button";
import { PDFUploader } from "./_components/NDXOutputUploader";
import PropertiesTable from "./_components/PropertiesTable";

export default function SurveyPage({}: {
  params: { projectId: string; surveyId: string };
}) {
  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-col">
      <PropertiesTable surveyId={params.surveyId} />
    </div>
  );
}
