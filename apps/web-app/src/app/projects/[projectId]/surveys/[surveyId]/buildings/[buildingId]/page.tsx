import PageHeader from "~/components/PageHeader";
import { Button } from "~/components/ui/button";
import { Table, TableBody, TableRow, TableCell } from "~/components/ui/table";
import SpaceCard from "./_components/SpaceCard";
import AttachmentCard from "./_components/AttachmentCard";
import Link from "next/link";

export default function BuildingPage({
  params,
}: {
  params: { projectId: string; surveyId: string; buildingId: string };
}) {
  const address = "301 Main St, Palo Alto, CA 94301";

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <PageHeader title="301 Main St" />
          <div className="text-base text-muted-foreground">
            Palo Alto, CA 94301
          </div>
        </div>
        <Link
          href={`/projects/${params.projectId}/surveys/${params.surveyId}/buildings/${params.buildingId}/edit-details`}
        >
          <Button>Edit building details</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <div className="mx-auto aspect-square w-full max-w-xl rounded-md bg-gray-100 p-4">
              <div className="text-lg font-medium">image of building</div>
            </div>
            <div className="mx-auto w-full max-w-xl rounded-md">
              <iframe
                width="100%"
                height="200"
                className="rounded-md"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD53tLz4htKqRBnNh6OH0Rkij07uFYHnKA&q=${encodeURIComponent(
                  address,
                )}`}
              ></iframe>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="text-lg font-medium">Description</div>
              <div className="text-sm text-muted-foreground">
                This is a description of what the building is. It is a very cool
                building. Lorem ipsum dolor sit amet, consectetur adipiscing
                elit. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla
                facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla
                facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla
                facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla
                facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla
                facilisi. Nulla
              </div>
            </div>
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

        <div className="flex flex-col gap-8">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-lg font-medium">Spaces</div>
              <Link
                href={`/projects/${params.projectId}/surveys/${params.surveyId}/buildings/${params.buildingId}/edit-spaces`}
              >
                <Button variant="outline">Add / edit spaces</Button>
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <SpaceCard />
              <SpaceCard />
              <SpaceCard />
            </div>
          </div>
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-lg font-medium">Attachments</div>
              <Button variant="outline">Add an attachment</Button>
            </div>
            <div className="flex flex-col gap-2">
              <AttachmentCard />
              <AttachmentCard />
              <AttachmentCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
