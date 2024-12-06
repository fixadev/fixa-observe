"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { ChartBarIcon, CheckIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from "react";
import { removeTrailingSlash } from "~/lib/utils";
import Logo from "../Logo";

const navItems = [
  { href: "/", icon: ChartBarIcon, label: "dashboard" },
  { href: "/evals", icon: CheckIcon, label: "evaluation criteria" },
];

export default function ObserveSidebar() {
  const pathname = usePathname();

  const isCurrentPath = useCallback(
    (path: string) => {
      if (path === "/") {
        return removeTrailingSlash(pathname) === `/observe`;
      }
      return (
        removeTrailingSlash(pathname) === removeTrailingSlash(`/observe${path}`)
      );
    },
    [pathname],
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="-m-2 flex h-14 items-center justify-between border-b px-4">
          <Logo href="/observe" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={isCurrentPath(item.href)}
                  >
                    <Link href={`/observe${item.href}`}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
