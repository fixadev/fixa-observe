"use client";

import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function AgentLayout({
  params,
  children,
}: {
  params: { agentId: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSettings = pathname.endsWith("/settings");

  return (
    <div>
      <div className="w-full border-b border-input">
        <Tabs value={isSettings ? "settings" : "tests"}>
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
