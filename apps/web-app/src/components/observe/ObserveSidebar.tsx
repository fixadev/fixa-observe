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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import { ChartBarIcon, CheckIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from "react";
import { removeTrailingSlash } from "~/lib/utils";
import Logo from "../Logo";
import { DocumentIcon } from "@heroicons/react/24/solid";

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

  const savedSearchNames = [
    "saved",
    "saved-1",
    "saved-2",
    "saved-3",
    "saved-4",
  ];

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
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isCurrentPath("/observe")}>
                  <Link href={`/observe`}>
                    <ChartBarIcon />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuButton isActive={isCurrentPath("/saved")}>
                  <DocumentIcon className="h-4 w-4" />
                  <span>Saved</span>
                </SidebarMenuButton>
                <SidebarMenuSub className="border-l-0">
                  {savedSearchNames.map((name) => (
                    <SidebarMenuSubItem key={name}>
                      <SidebarMenuSubButton>{name}</SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
