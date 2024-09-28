import PageHeader from "~/components/PageHeader";
import { Button } from "~/components/ui/button";
import BuildingsTable from "./_components/BuildingsTable";
import { type Building } from "./_components/BuildingsTable";

const buildings: Building[] = [
  {
    id: "1",
    address: "123 Main St, Palo Alto, CA 94301",
    buildingSize: "10,000 sqft",
    pricePerSqft: "$100 / sqft",
  },
];

export default function SurveyPage({
  params,
}: {
  params: { projectId: string; surveyId: string };
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <PageHeader title="Survey Name" />
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
          buildings={buildings}
          projectId={params.projectId}
          surveyId={params.surveyId}
        />
      </div>
    </div>
  );
}
