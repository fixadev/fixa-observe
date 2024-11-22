import { DataTable } from "../DataTable";
import { columns } from "./call-table/columns";
import { type CallWithIncludes } from "~/lib/types";
import { TEST_OBSERVE_CALLS } from "~/lib/test-data";

const calls = TEST_OBSERVE_CALLS;

export default function CallTable({
  onRowClick,
}: {
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
