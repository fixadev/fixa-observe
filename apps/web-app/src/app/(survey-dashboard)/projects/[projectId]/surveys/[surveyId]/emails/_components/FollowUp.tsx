import { Separator } from "~/components/ui/separator";
import EmailCard from "./EmailCard";
import BuildingFacade from "./BuildingFacade";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Table, TableCell, TableRow } from "~/components/ui/table";

export default function FollowUp() {
  return (
    <div className="space-y-10 pt-12">
      <EmailSection />
      <Separator />
      <EmailSection />
    </div>
  );
}

function EmailSection() {
  return (
    <div className="flex items-start gap-8 overflow-hidden">
      <BuildingFacade />
      <div className="flex flex-col gap-2 overflow-hidden">
        <EmailCard />
        <Card>
          <CardHeader>
            <CardTitle>Incomplete data</CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="max-w-[300px]">
              <TableRow>
                <TableCell className="w-[1%] font-medium">Price</TableCell>
                <TableCell>$12.50/sqft</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-[1%] font-medium">Available</TableCell>
                <TableCell>???</TableCell>
              </TableRow>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
