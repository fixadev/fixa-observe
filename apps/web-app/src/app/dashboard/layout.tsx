import { ReactFlowProvider } from "@xyflow/react";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <ReactFlowProvider>{children}</ReactFlowProvider>;
}
