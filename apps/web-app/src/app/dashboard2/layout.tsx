import { AudioProvider } from "../../hooks/useAudio";
import { ReactFlowProvider } from "@xyflow/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactFlowProvider>
      <AudioProvider>{children}</AudioProvider>
    </ReactFlowProvider>
  );
}
