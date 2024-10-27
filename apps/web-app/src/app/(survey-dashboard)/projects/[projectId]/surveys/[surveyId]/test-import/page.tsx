"use client";

import { NDXOutputUploader } from "../_components/NDXOutputUploader";

export default function TestImportPage({
  params,
}: {
  params: { projectId: string; surveyId: string };
}) {
  return (
    <div className="flex flex-col items-stretch gap-2">
      <NDXOutputUploader
        className="w-full"
        surveyId={params.surveyId}
        refetchSurvey={() => {}}
        setUploading={() => {}}
      />
    </div>
  );
}
