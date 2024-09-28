import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Table, TableBody, TableRow, TableCell } from "~/components/ui/table";

export default function SpaceCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Big room</CardTitle>
        <CardDescription>
          This room is really big... just like something else... if you know
          what I mean 😏
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Square Feet</div>
          <div className="text-sm font-medium">10,000</div>
        </div> */}
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
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
