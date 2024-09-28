import Link from "next/link";
import PageHeader from "~/components/PageHeader";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
} from "~/components/ui/table";

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
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Suite 101</TableCell>
            <TableCell>Suite 102</TableCell>
            <TableCell>Suite 103</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Floors</TableCell>
            <TableCell>3</TableCell>
            <TableCell>3</TableCell>
            <TableCell>3</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Amenities</TableCell>
            <TableCell>Parking, Elevator, Conference Room</TableCell>
            <TableCell>Parking, Elevator, Conference Room</TableCell>
            <TableCell>Parking, Elevator, Conference Room</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
