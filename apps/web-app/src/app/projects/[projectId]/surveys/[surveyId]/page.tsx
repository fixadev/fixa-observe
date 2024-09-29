"use client";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import PageHeader from "~/components/PageHeader";
import { Button } from "~/components/ui/button";
import BuildingsTable from "./_components/BuildingsTable";
import { UploadModal } from "./_components/UploadModal";
import { CSVUploader } from "./_components/CSVUploader";
import {
  type ImportBuildingsInput,
  type HeaderMappingSchema,
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
    error,
  } = api.survey.getSurvey.useQuery({
    surveyId: params.surveyId,
  });

  useEffect(() => {
    console.log(error);
  }, [error]);

  const { mutate: uploadBuildings } =
    api.building.createOrUpdateBuildings.useMutation({
      onSuccess: () => {
        console.log("success");
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
    const updatedData: ImportBuildingsInput = csvData.map((row) => {
      const mappedRow = Object.keys(row).reduce<
        Partial<ImportBuildingsInput[number]>
      >((acc, key) => {
        const header = mappedHeaders[key];
        if (header?.isCustomProperty) {
          acc.customProperties = acc.customProperties ?? {};
          acc.customProperties[makeCamelCase(header.target)] = String(row[key]);
        } else {
          acc[makeCamelCase(header?.target ?? key)] = row[key];
        }
        return acc;
      }, {});

      return {
        ...mappedRow,
        createdAt: mappedRow.createdAt ?? new Date(),
        updatedAt: mappedRow.updatedAt ?? new Date(),
        ownerId: mappedRow.ownerId ?? "",
        name: mappedRow.name ?? "",
        description: mappedRow.description ?? "",
        photoUrls: mappedRow.photoUrls ?? [],
        sqFt: mappedRow.sqFt ? Number(mappedRow.sqFt) : 0,
        pricePerSqft: mappedRow.pricePerSqft
          ? convertCurrencyToFloat(mappedRow.pricePerSqft)
          : 0,
        address: mappedRow.address ?? "",
        zipCode: mappedRow.zipCode ?? "",
        yearBuilt: mappedRow.yearBuilt ? Number(mappedRow.yearBuilt) : 0,
        propertyType: mappedRow.propertyType ?? "",
        occupancyRate: mappedRow.occupancyRate
          ? convertPercentageToFloat(mappedRow.occupancyRate)
          : 0,
        annualRevenue: mappedRow.annualRevenue
          ? convertCurrencyToFloat(mappedRow.annualRevenue)
          : 0,
        energyRating: mappedRow.energyRating ?? "",
        customProperties: mappedRow.customProperties ?? {},
        attachmentIds: mappedRow.attachmentIds ?? [],
        surveyIds: mappedRow.surveyIds ?? [],
      } as ImportBuildingsInput[number];
    });

    console.log("updatedData", updatedData);
    console.log("COMMENTED OUT SUBMIT");
    uploadBuildings(updatedData);
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
          buildings={survey?.buildings ?? []}
          projectId={params.projectId}
          surveyId={params.surveyId}
        />
      </div>
    </div>
  );
}
