import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "~/components/ui/table";
import { type BuildingSchema } from "~/lib/building";
import { api } from "~/trpc/react";

export default function BuildingsTable({
  buildings,
  projectId,
  surveyId,
}: {
  buildings: BuildingSchema[];
  projectId: string;
  surveyId: string;
}) {
  const { data: attributes } = api.building.getAttributes.useQuery();

  const populatedAttributes = attributes?.filter((attribute) =>
    buildings.some((building) => building.attributes[attribute.id]),
  );

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            {populatedAttributes?.map((attribute) => (
              <TableHead key={attribute.id}>{attribute.label}</TableHead>
            ))}
            <TableHead />
          </TableRow>
          {buildings.map((building) => (
            <TableRow key={building.id}>
              {populatedAttributes?.map((attribute) => (
                <TableCell key={attribute.id}>
                  {building.attributes[attribute.id]}
                </TableCell>
              ))}
              <TableCell>
                <Link
                  href={`/projects/${projectId}/surveys/${surveyId}/buildings/${building.id}`}
                >
                  <Button variant="ghost">Edit</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableHeader>
      </Table>
    </div>
  );
}
