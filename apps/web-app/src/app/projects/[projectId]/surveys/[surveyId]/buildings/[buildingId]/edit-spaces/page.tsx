import Link from "next/link";
import PageHeader from "~/components/PageHeader";
import { Button } from "~/components/ui/button";
import SpacesTable from "./_components/SpacesTable";

export default function EditSpacesPage({
  params,
}: {
  params: { projectId: string; surveyId: string; buildingId: string };
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <PageHeader title="Add/edit spaces" />
        <div className="flex items-center gap-2">
          <Link
            href={`/projects/${params.projectId}/surveys/${params.surveyId}/buildings/${params.buildingId}`}
          >
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button>Save</Button>
        </div>
      </div>
      <SpacesTable />
    </div>
  );
}
