"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "../ui/sidebar";
import {
  CounterClockwiseClockIcon,
  OpenInNewWindowIcon,
} from "@radix-ui/react-icons";
import {
  ChatBubbleOvalLeftIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  KeyIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useCallback } from "react";
import { removeTrailingSlash } from "~/lib/utils";
import { api } from "~/trpc/react";
import { type Agent } from "prisma/generated/zod";
import Logo from "../Logo";

const navItems = [
  { href: "/", icon: CounterClockwiseClockIcon, label: "test history" },
  { href: "/scenarios", icon: ChatBubbleOvalLeftIcon, label: "scenarios" },
  {
    href: "/test-agents",
    icon: UsersIcon,
    label: "test agents",
  },
  { href: "/settings", icon: Cog6ToothIcon, label: "settings" },
];

export default function DashboardSidebar({
  params,
}: {
  params: { agentId: string };
}) {
  const router = useRouter();

  const pathname = usePathname();

  const isCurrentPath = useCallback(
    (path: string) => {
      return (
        removeTrailingSlash(pathname) ===
        removeTrailingSlash(`/dashboard/${params.agentId}${path}`)
      );
    },
    [pathname, params.agentId],
  );

  const { data: agents } = api.agent.getAll.useQuery();
  const agentsMap = useMemo(() => {
    return agents?.reduce(
      (acc, agent) => {
        acc[agent.id] = agent;
        return acc;
      },
      {} as Record<string, Agent>,
    );
  }, [agents]);

  return (
    <Sidebar>
      {/* <SidebarHeader /> */}
      <SidebarHeader>
        <div className="-m-2 flex h-14 items-center border-b px-4 lg:h-[60px]">
          <Logo href="/dashboard" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <Select
                value={params.agentId}
                onValueChange={(value) => {
                  router.push(`/dashboard/${value}`);
                }}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select an agent" asChild>
                    <div className="w-[120px] cursor-pointer truncate text-left">
                      {agentsMap?.[params.agentId]?.name}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {agents?.map((agent) => (
                    <SelectItem
                      className="cursor-pointer truncate"
                      key={agent.id}
                      value={agent.id}
                    >
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={isCurrentPath(item.href)}
                  >
                    <Link href={`/dashboard/${params.agentId}${item.href}`}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>API</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/dashboard/${params.agentId}/api-keys`}>
                    <KeyIcon />
                    <span>API keys</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`https://docs.fixa.dev`} target="_blank">
                    <DocumentTextIcon />
                    <span>documentation</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuBadge>
                  <OpenInNewWindowIcon />
                </SidebarMenuBadge>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* <SidebarFooter /> */}
      <SidebarRail />
    </Sidebar>
  );
}
