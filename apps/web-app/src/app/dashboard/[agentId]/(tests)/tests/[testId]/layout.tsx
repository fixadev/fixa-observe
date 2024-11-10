"use client";

import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
// import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";

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

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="w-full border-b border-input">
        <Tabs value={tabValue}>
          <TabsList variant="outline" className="h-10">
            <TabsTrigger
              variant="outline"
              value="test"
              className="w-32 hover:bg-muted"
              asChild
            >
              <Link
                href={`/dashboard/${params.agentId}/tests/${params.testId}`}
              >
                test
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {children}
    </div>
  );
}
