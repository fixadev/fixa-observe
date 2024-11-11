"use client";

import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function LayoutHeader({
  tabValue,
  tabs,
}: {
  tabValue: string;
  tabs: {
    value: string;
    label: string;
    href: string;
  }[];
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
  );
}
