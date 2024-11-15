"use client";

import { useMemo } from "react";
import LayoutHeader from "~/components/dashboard/LayoutHeader";

export default function TestLayout({
  params,
  children,
}: {
  params: { agentId: string; testId: string };
  children: React.ReactNode;
}) {
  // const pathname = usePathname();
  const tabValue = useMemo(() => {
    return "test";
  }, []);
  const tabs = useMemo(() => {
    return [
      {
        value: "test",
        label: "test",
        href: `/dashboard/${params.agentId}/tests/${params.testId}`,
      },
    ];
  }, [params.agentId, params.testId]);

  return (
    <div>
      {/* <LayoutHeader
        tabValue={tabValue}
        tabs={tabs}
        agentId={params.agentId}
        testId={params.testId}
      /> */}
      {children}
    </div>
  );
}
