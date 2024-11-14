"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import LayoutHeader from "~/components/dashboard/LayoutHeader";

export default function AgentLayout({
  params,
  children,
}: {
  params: { agentId: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const tabValue = useMemo(() => {
    if (pathname.endsWith("/settings")) return "settings";
    if (pathname.endsWith("/scenarios")) return "scenarios";
    return "tests";
  }, [pathname]);
  const tabs = useMemo(() => {
    return [
      { value: "tests", label: "tests", href: `/dashboard/${params.agentId}` },
      {
        value: "scenarios",
        label: "scenarios",
        href: `/dashboard/${params.agentId}/scenarios`,
      },
      {
        value: "settings",
        label: "settings",
        href: `/dashboard/${params.agentId}/settings`,
      },
    ];
  }, [params.agentId]);

  return (
    <div>
      <LayoutHeader tabValue={tabValue} tabs={tabs} agentId={params.agentId} />
      {children}
    </div>
  );
}
