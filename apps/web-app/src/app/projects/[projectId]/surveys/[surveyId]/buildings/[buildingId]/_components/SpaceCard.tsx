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
          This room is really big and can fit a lot of stuff. It&apos;s a really
          big room. Ideal for a lot of things.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
