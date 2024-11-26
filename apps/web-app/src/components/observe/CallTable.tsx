import { DataTable } from "./call-table/CallsDataTable";
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
      // onRowClick={onRowClick ?? undefined}
      initialSorting={[{ id: "startedAt", desc: true }]}
      columns={columns}
      data={calls}
    />
  );
}
