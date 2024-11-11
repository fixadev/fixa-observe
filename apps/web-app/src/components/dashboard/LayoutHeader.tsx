"use client";

import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import Logo from "../Logo";
import { ChevronUpDownIcon, SlashIcon } from "@heroicons/react/24/solid";
import { Button } from "../ui/button";
import { TEST_AGENT } from "~/lib/test-data";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "~/lib/utils";

export default function LayoutHeader({
  tabValue,
  tabs,
  agentId,
  testId,
}: {
  tabValue?: string;
  tabs?: {
    value: string;
    label: string;
    href: string;
  }[];
  agentId?: string;
  testId?: string;
}) {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="flex w-full items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Logo className="mb-1" href="/dashboard" />
          {agentId && (
            <>
              <SlashIcon className="size-4 text-muted-foreground" />
              <div className="flex items-center gap-px">
                {/* <Button variant="link" asChild className="px-0"> */}
                <Link
                  className="text-sm font-medium"
                  href={`/dashboard/${agentId}`}
                >
                  {TEST_AGENT.name}
                </Link>
                {/* </Button> */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" className="w-6">
                      <ChevronUpDownIcon className="size-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link href={`/dashboard/${agentId}`}>
                        {TEST_AGENT.name}
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
          {testId && (
            <>
              <SlashIcon className="size-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">{testId}</div>
            </>
          )}
        </div>
        <UserButton />
      </div>
      {tabs && (
        <div className="sticky top-0 z-30 w-full border-b border-input bg-background">
          <div className="flex h-10 items-center">
            <div
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className={cn(
                "flex h-full shrink-0 cursor-pointer items-center px-4 hover:bg-muted",
                scrollY < 64 && "pointer-events-none",
              )}
            >
              {/* <div
                className="text-sm font-medium"
                style={{
                  opacity: Math.min(1, Math.max(0, scrollY / 64)),
                }}
              >
                pixa.
              </div> */}
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
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    variant="outline"
                    value={tab.value}
                    className="w-32 hover:bg-muted"
                    asChild
                  >
                    <Link href={tab.href}>{tab.label}</Link>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      )}
    </>
  );
}
