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
import {
  ChartBarIcon,
  ChevronDownIcon,
  DocumentIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from "react";
import { removeTrailingSlash } from "~/lib/utils";
import Logo from "../Logo";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";

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
                            className="group/saved-search-item relative"
                          >
                            <Link
                              href={`/observe/saved/${search.id}`}
                              // className="group relative"
                            >
                              {search.name}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 size-6 opacity-0 transition-opacity duration-200 hover:bg-gray-300 group-hover/saved-search-item:opacity-100"
                                onClick={(e) => {
                                  e.preventDefault();
                                  console.log("DELETE", search.id);
                                  // deleteSearch(search.id);
                                }}
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </Button>
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
