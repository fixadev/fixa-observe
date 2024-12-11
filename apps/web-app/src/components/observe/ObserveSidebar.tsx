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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChartBarIcon, CheckIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from "react";
import { removeTrailingSlash } from "~/lib/utils";
import Logo from "../Logo";
import { ChevronDownIcon, DocumentIcon } from "@heroicons/react/24/solid";
import { api } from "~/trpc/react";

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

  const { data: savedSearches } = api.search.getAll.useQuery();

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
                <SidebarMenuButton asChild isActive={isCurrentPath("/")}>
                  <Link href={`/observe`}>
                    <ChartBarIcon />
                    <span>dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton isActive={isCurrentPath("/saved")}>
                      <DocumentIcon className="h-4 w-4" />
                      <span>saved searches</span>
                      <div className="flex-1" />
                      <ChevronDownIcon className="h-4 w-4 transition-transform duration-200 group-data-[state=closed]/collapsible:rotate-[-90deg]" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {savedSearches?.map((search) => (
                        <SidebarMenuSubItem key={search.id}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isCurrentPath(`/saved/${search.id}`)}
                          >
                            <Link href={`/observe/saved/${search.id}`}>
                              {search.name}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
