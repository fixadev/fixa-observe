"use client";

import { SidebarProvider } from "~/components/ui/sidebar";
import DashboardSidebar from "~/components/dashboard/DashboardSidebar";

export default function AgentLayout({
  children,
  params,
}: {
  params: { agentId: string };
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar params={params} />
      <main className="flex-1">{children}</main>
    </SidebarProvider>
  );
}
