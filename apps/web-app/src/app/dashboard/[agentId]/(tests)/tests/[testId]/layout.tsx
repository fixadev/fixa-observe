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
    <div>
      <div className="sticky top-0 z-20 w-full border-b border-input bg-background">
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
