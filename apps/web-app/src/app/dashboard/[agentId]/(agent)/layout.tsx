"use client";

import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import Image from "next/image";

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

  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <div className="sticky top-0 w-full border-b border-input bg-background">
        <div className="flex h-10 items-center">
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex h-full shrink-0 cursor-pointer items-center px-4 hover:bg-muted"
          >
            <Image
              src="/images/logo.png"
              alt="pixa logo"
              width={20}
              height={20}
              className="h-[20px] w-auto"
              style={{
                opacity: Math.min(1, Math.max(0, scrollY / 64)),
              }}
            />
          </div>
          <Tabs
            value={tabValue}
            className="flex-grow"
            style={{
              marginLeft: `${-32 + Math.min(32, Math.max(0, scrollY / 2))}px`,
            }}
          >
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
      </div>
      {children}
    </div>
  );
}
