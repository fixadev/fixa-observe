"use client";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import PageHeader from "~/components/PageHeader";
import { Button } from "~/components/ui/button";
import BuildingsTable from "./_components/BuildingsTable";
import { UploadModal } from "./_components/UploadModal";
import { CSVUploader } from "./_components/CSVUploader";
import {
  type HeaderMappingSchema,
  type CreateBuildingSchema,
} from "~/lib/building";
export default function SurveyPage({
  params,
}: {
  params: { projectId: string; surveyId: string };
}) {
  const [csvData, setCsvData] = useState<Array<Record<string, string>>>([]);
  const [isMappingOpen, setIsMappingOpen] = useState(false);

  const {
    data: survey,
    isLoading,
    refetch: refetchSurvey,
    error,
  } = api.survey.getSurvey.useQuery({
    surveyId: params.surveyId,
  });

  useEffect(() => {
    console.log("survey", survey);
    console.log(error);
  }, [error, survey]);

  const { mutate: uploadBuildings } =
    api.survey.addBuildingsToSurvey.useMutation({
      onSuccess: () => {
        setIsMappingOpen(false);
        void refetchSurvey();
      },
      onError: (error) => {
        console.log("error", error);
      },
    });

  function makeCamelCase(str: string) {
    // console.log("MAKING CAMEL CASE", str);
    return str
      .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
      })
      .replace(/\s+/g, "");
  }

  function convertPercentageToFloat(value: string) {
    return Number(value.replace("%", "")) / 100;
  }

  function convertCurrencyToFloat(value: string) {
    return Number(value.replace("$", ""));
  }

  const submitMapping = (mappedHeaders: HeaderMappingSchema) => {
    const updatedData: Array<CreateBuildingSchema> = csvData.map((row) => {
      const mappedRow = Object.keys(row).reduce<CreateBuildingSchema>(
        (acc, key) => {
          const header = mappedHeaders[key];
          if (header?.target && header.target !== "address") {
            acc.attributes = acc.attributes ?? {};
            acc.attributes[header.target] = row[key] ?? "";
          } else if (header?.target === "address") {
            acc.address = row[key] ?? "";
          }
          return acc;
        },
        {} as CreateBuildingSchema,
      );

      return {
        ...mappedRow,
        createdAt: mappedRow.createdAt ?? new Date(),
        updatedAt: mappedRow.updatedAt ?? new Date(),
        address: mappedRow.address ?? "",
        photoUrls: [],
        attachmentIds: [],
        surveyIds: [],
        spaceIds: [],
        attributes: mappedRow.attributes ?? {},
      } as CreateBuildingSchema;
    });
    uploadBuildings({ buildings: updatedData, surveyId: params.surveyId });
  };

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
            <CSVUploader
              dataHandler={setCsvData}
              openMapping={() => setIsMappingOpen(true)}
            />
            <UploadModal
              open={isMappingOpen}
              csvData={csvData}
              setOpen={setIsMappingOpen}
              submitHandler={submitMapping}
            />
          </div>
        </div>
        <BuildingsTable
          buildings={
            survey?.buildings.map((building) => ({
              ...building,
              attributes: building.attributes as Record<string, string | null>,
            })) ?? []
          }
          projectId={params.projectId}
          surveyId={params.surveyId}
        />
      </div>
    </div>
  );
}
