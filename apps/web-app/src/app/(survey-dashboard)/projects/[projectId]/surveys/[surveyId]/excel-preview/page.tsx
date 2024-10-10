"use client";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { createExcelWorksheet } from "./_components/worksheet";

export default function PDFPreviewPage({
  params,
}: {
  params: { surveyId: string };
}) {
  const router = useRouter();
  const { data: survey } = api.survey.getSurvey.useQuery({
    surveyId: params.surveyId,
  });
  const { data: attributes } = api.survey.getSurveyAttributes.useQuery({
    surveyId: params.surveyId,
  });

  const parsedProperties = survey?.properties.map((property) => {
    return {
      ...property,
      attributes: property.attributes as Record<string, string>,
    };
  });

  const handleDownload = async () => {
    if (!parsedProperties || !attributes) return;

    const workbook = createExcelWorksheet(parsedProperties, attributes);
    const buffer = await workbook.xlsx.writeBuffer();

    console.log("buffer is!", buffer);

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "property-survey.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full">
      <div className="flex flex-row items-center py-2">
        <Button variant={"ghost"} onClick={() => router.back()}>
          <ChevronLeftIcon className="mr-2 h-4 w-4" />
          Back to properties
        </Button>
        <Button onClick={handleDownload}>Download</Button>
      </div>
    </div>
  );
}
