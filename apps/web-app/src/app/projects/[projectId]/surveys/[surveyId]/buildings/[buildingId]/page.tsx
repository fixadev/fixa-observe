import PageHeader from "~/components/PageHeader";
import { Button } from "~/components/ui/button";
import { Table, TableBody, TableRow, TableCell } from "~/components/ui/table";

export default function BuildingPage({
  params,
}: {
  params: { projectId: string; surveyId: string; buildingId: string };
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <PageHeader title="301 Main St" />
          <div className="text-base text-muted-foreground">
            Palo Alto, CA 94301
          </div>
        </div>
        <Button variant="outline">Edit building details</Button>
      </div>
      <div className="flex flex-col gap-2">
        <div className="mx-auto aspect-square w-full max-w-xl rounded-md bg-gray-100 p-4">
          <div className="text-lg font-medium">image of building</div>
        </div>
        <div className="mx-auto w-full max-w-xl rounded-md bg-gray-100 p-4">
          <div className="text-lg font-medium">location info</div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-lg font-medium">Description</div>
        <div className="text-sm text-muted-foreground">
          This is a description of what the building is. It is a very cool
          building. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla
          facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla
          facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla
          facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla
          facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla
        </div>
        <div className="mt-4">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Square Feet</TableCell>
                <TableCell>10,000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Price/Square Feet</TableCell>
                <TableCell>$100</TableCell>
              </TableRow>
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
  );
}
