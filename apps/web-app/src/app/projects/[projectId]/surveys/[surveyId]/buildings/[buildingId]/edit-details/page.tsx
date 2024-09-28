import PageHeader from "~/components/PageHeader";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import PhotoItem from "./_components/PhotoItem";
import { Table, TableBody, TableRow, TableCell } from "~/components/ui/table";
import Link from "next/link";

export default function EditDetailsPage({
  params,
}: {
  params: { projectId: string; surveyId: string; buildingId: string };
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between">
        <PageHeader title="Edit building details" />
        <div className="flex gap-2">
          <Link
            href={`/projects/${params.projectId}/surveys/${params.surveyId}/buildings/${params.buildingId}`}
          >
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button>Save</Button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label>Address</Label>
          <Input />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Description</Label>
          <Textarea />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label>Photos</Label>
            <Button variant="outline">Add photos</Button>
          </div>
          <div className="flex gap-2">
            <PhotoItem
              src="https://picsum.photos/1600/900"
              width={200}
              height={200}
            />
            <PhotoItem
              src="https://picsum.photos/1600/900"
              width={200}
              height={200}
            />
            <PhotoItem
              src="https://picsum.photos/1600/900"
              width={200}
              height={200}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label>Additional details</Label>
            <Button variant="outline">Add field</Button>
          </div>
          <div className="flex gap-2">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Floors</TableCell>
                  <TableCell>3</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Amenities</TableCell>
                  <TableCell>Parking, Elevator, Conference Room</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
