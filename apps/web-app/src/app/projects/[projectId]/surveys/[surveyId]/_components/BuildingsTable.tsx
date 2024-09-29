import Link from "next/link";
import { Button } from "~/components/ui/button";
import { type Building } from "@prisma/client";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "~/components/ui/table";

export default function BuildingsTable({
  buildings,
  projectId,
  surveyId,
}: {
  buildings: Building[];
  projectId: string;
  surveyId: string;
}) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead>Building size</TableHead>
            <TableHead>Price / sqft</TableHead>
            <TableHead />
          </TableRow>
          {buildings.map((building) => (
            <TableRow key={building.id}>
              <TableCell>{building.address}</TableCell>
              <TableCell>{building.sqFt} sqft.</TableCell>
              <TableCell>${building.pricePerSqft} / sqft.</TableCell>
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
