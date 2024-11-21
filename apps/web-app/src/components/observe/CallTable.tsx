import { DataTable } from "../DataTable";
import { columns } from "./call-table/columns";

const calls = [
  {
    id: "1",
    createdAt: new Date(1716268800000),
    callId: "call.2mLTbvbnQZ785c96meHH1p",
    name: "airtable inbound",
    p50: 700,
    p95: 800,
    p99: 5000,
  },
  {
    id: "1",
    createdAt: new Date(1716268800000),
    callId: "call.2mLTbvbnQZ785c96meHH1p",
    name: "airtable inbound",
    p50: 700,
    p95: 800,
    p99: 5000,
  },
  {
    id: "1",
    createdAt: new Date(1716268800000),
    callId: "call.2mLTbvbnQZ785c96meHH1p",
    name: "airtable inbound",
    p50: 700,
    p95: 800,
    p99: 5000,
  },
  {
    id: "1",
    createdAt: new Date(1716268800000),
    callId: "call.2mLTbvbnQZ785c96meHH1p",
    name: "airtable inbound",
    p50: 700,
    p95: 800,
    p99: 5000,
  },
  {
    id: "1",
    createdAt: new Date(1716268800000),
    callId: "call.2mLTbvbnQZ785c96meHH1p",
    name: "airtable inbound",
    p50: 700,
    p95: 800,
    p99: 5000,
  },
  {
    id: "1",
    createdAt: new Date(1716268800000),
    callId: "call.2mLTbvbnQZ785c96meHH1p",
    name: "airtable inbound",
    p50: 700,
    p95: 800,
    p99: 5000,
  },
  {
    id: "1",
    createdAt: new Date(1716268800000),
    callId: "call.2mLTbvbnQZ785c96meHH1p",
    name: "airtable inbound",
    p50: 700,
    p95: 800,
    p99: 5000,
  },
  {
    id: "1",
    createdAt: new Date(1716268800000),
    callId: "call.2mLTbvbnQZ785c96meHH1p",
    name: "airtable inbound",
    p50: 700,
    p95: 800,
    p99: 5000,
  },
  {
    id: "1",
    createdAt: new Date(1716268800000),
    callId: "call.2mLTbvbnQZ785c96meHH1p",
    name: "airtable inbound",
    p50: 700,
    p95: 800,
    p99: 5000,
  },
];

export default function CallTable() {
  return <DataTable columns={columns} data={calls} />;
}
