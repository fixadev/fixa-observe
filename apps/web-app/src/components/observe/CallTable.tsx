import { DataTable } from "../DataTable";
import { columns } from "./call-table/columns";
import { type CallWithIncludes } from "~/lib/types";

export default function CallTable({
  calls,
  onRowClick,
}: {
  calls: CallWithIncludes[];
  onRowClick?: (call: CallWithIncludes) => void;
}) {
  return (
    <DataTable
      onRowClick={onRowClick ?? undefined}
      columns={columns}
      data={calls}
    />
  );
}
