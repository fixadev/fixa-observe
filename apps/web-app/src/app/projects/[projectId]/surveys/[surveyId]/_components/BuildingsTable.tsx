"use client";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const { data: attributes } = api.building.getAttributes.useQuery();

  const populatedAttributes = attributes?.filter((attribute) =>
    buildings.some((building) => building.attributes[attribute.id]),
  );

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            {populatedAttributes?.map((attribute) => (
              <TableHead key={attribute.id}>{attribute.label}</TableHead>
            ))}
            <TableHead />
          </TableRow>
          {buildings.map((building) => (
            <TableRow
              className="cursor-pointer"
              key={building.id}
              onClick={() => {
                router.push(
                  `/projects/${projectId}/surveys/${surveyId}/buildings/${building.id}`,
                );
              }}
            >
              <TableCell>{building.address}</TableCell>
              {populatedAttributes?.map((attribute) => (
                <TableCell key={attribute.id}>
                  {building.attributes[attribute.id]}
                </TableCell>
              ))}
              <TableCell>
                <Button variant="ghost"></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableHeader>
      </Table>
    </div>
  );
}
