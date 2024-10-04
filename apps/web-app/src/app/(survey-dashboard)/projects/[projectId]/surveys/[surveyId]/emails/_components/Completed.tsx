import { Separator } from "~/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Table, TableRow, TableCell } from "~/components/ui/table";
import BuildingFacade from "./BuildingFacade";
import { EmailCardWithDialog } from "./EmailCard";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function Completed() {
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
        <EmailCardWithDialog />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div>Property data edited</div>
              <CheckCircleIcon className="size-5 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="max-w-[300px]">
              <TableRow>
                <TableCell className="w-[1%] font-medium">Price</TableCell>
                <TableCell>$12.50/sqft</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-[1%] font-medium">Available</TableCell>
                <TableCell>Yes</TableCell>
              </TableRow>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
