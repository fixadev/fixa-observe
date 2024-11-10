"use client";

import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";

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
    return "tests";
  }, [pathname]);

  return (
    <div>
      <div className="w-full border-b border-input">
        <Tabs value={tabValue}>
          <TabsList variant="outline" className="h-10">
            <TabsTrigger
              variant="outline"
              value="tests"
              className="w-32 hover:bg-muted"
              asChild
            >
              <Link href={`/dashboard/${params.agentId}`}>tests</Link>
            </TabsTrigger>
            <TabsTrigger
              variant="outline"
              value="settings"
              className="w-32 hover:bg-muted"
              asChild
            >
              <Link href={`/dashboard/${params.agentId}/settings`}>
                settings
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {children}
    </div>
  );
}
