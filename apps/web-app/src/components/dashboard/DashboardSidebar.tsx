"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
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
  PlusIcon,
  UsersIcon,
  LifebuoyIcon,
  DocumentCheckIcon,
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
import { useCallback, useEffect, useMemo, useRef } from "react";
import { cn, removeTrailingSlash } from "~/lib/utils";
import { api } from "~/trpc/react";
import { SlackIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { AddAgentModal } from "~/app/dashboard/(agents)/_components/AddAgentModal";
import { useAgent } from "~/app/contexts/UseAgent";
import { useOrganization, UserButton } from "@clerk/nextjs";
import FreeTestsLeft from "./FreeTestsLeft";
import { CustomOrganizationSwitcher } from "../CustomOrganizationSwitcher";

const navItems = [
  { href: "/", icon: CounterClockwiseClockIcon, label: "test history" },
  { href: "/scenarios", icon: ChatBubbleOvalLeftIcon, label: "scenarios" },
  {
    href: "/eval-templates",
    icon: DocumentCheckIcon,
    label: "evaluation templates",
  },
  {
    href: "/test-agents",
    icon: UsersIcon,
    label: "personas",
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

  const agentBaseUrl = useMemo(
    () => `/dashboard/${params.agentId}`,
    [params.agentId],
  );

  const isCurrentPath = useCallback(
    (path: string) => {
      if (path === "/") {
        return (
          removeTrailingSlash(pathname) === agentBaseUrl ||
          pathname.startsWith(`${agentBaseUrl}/tests`)
        );
      }
      return (
        removeTrailingSlash(pathname) ===
        removeTrailingSlash(`${agentBaseUrl}${path}`)
      );
    },
    [pathname, agentBaseUrl],
  );

  const { data: agents } = api.agent.getAll.useQuery();
  const { data: _agent, isFetching: _agentFetching } = api.agent.get.useQuery(
    { id: params.agentId },
    { enabled: params.agentId !== "new" },
  );
  const { agent, setAgent } = useAgent();

  // Set agent when it is loaded
  useEffect(() => {
    if (!_agentFetching && _agent) {
      console.log("setting agent", _agent);
      setAgent(_agent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_agentFetching]);

  // If we're on the new page and agents exist, set the first agent as the current agent
  useEffect(() => {
    if (params.agentId === "new" && agents && agents.length > 0) {
      router.replace(`/dashboard/${agents[0]!.id}`);
    }
  }, [agents, params.agentId, router]);

  // If agent is not found, redirect to new agent page
  useEffect(() => {
    if (
      params.agentId !== "new" &&
      agents &&
      !agents.find((a) => a.id === params.agentId)
    ) {
      router.replace("/dashboard/new");
    }
  }, [agents, params.agentId, router]);

  // Invalidate everything when organization changes
  const utils = api.useUtils();
  const { organization, isLoaded: organizationLoaded } = useOrganization();
  const prevOrganizationId = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (organizationLoaded && organization) {
      if (
        prevOrganizationId.current &&
        prevOrganizationId.current !== organization.id
      ) {
        void utils.invalidate();
      }
      prevOrganizationId.current = organization.id;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization, utils]);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="-m-2 flex h-14 items-center justify-between border-b px-4 lg:h-[60px]">
          <Select
            defaultValue="testing"
            onValueChange={(value) => {
              if (value === "observability") {
                router.push(`/observe/`);
              }
            }}
          >
            <SelectTrigger className="-ml-2 mr-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="testing">testing</SelectItem>
              <SelectItem value="observability">observability</SelectItem>
            </SelectContent>
          </Select>
          <UserButton />
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
                    <div className="w-[140px] cursor-pointer truncate text-left">
                      {agents?.length === 0 ? (
                        <span className="text-muted-foreground/50">
                          no agents yet!
                        </span>
                      ) : !agent ? (
                        <Skeleton className="h-4 w-full" />
                      ) : (
                        agent?.name
                      )}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <div className="flex max-h-[300px] flex-col">
                    <div className="flex-1 overflow-y-auto">
                      {agents?.map((agent) => (
                        <SelectItem
                          className="cursor-pointer truncate"
                          key={agent.id}
                          value={agent.id}
                        >
                          {agent.name}
                        </SelectItem>
                      ))}
                    </div>
                    <div className="border-t">
                      <AddAgentModal>
                        <Button
                          variant="ghost"
                          className="flex w-full items-center justify-start px-2"
                        >
                          <PlusIcon className="mr-2 size-4" />
                          <span>new agent</span>
                        </Button>
                      </AddAgentModal>
                    </div>
                  </div>
                </SelectContent>
              </Select>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={isCurrentPath(item.href)}
                  >
                    <Link
                      href={`${agentBaseUrl}${item.href}`}
                      className={cn(
                        item.href !== "/" &&
                          params.agentId === "new" &&
                          "pointer-events-none opacity-50",
                      )}
                    >
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
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <FreeTestsLeft />
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isCurrentPath("/slack-app")}
                >
                  <Link href={`${agentBaseUrl}/slack-app`}>
                    <SlackIcon />
                    <span>slack app</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isCurrentPath("/api-keys")}
                >
                  <Link href={`${agentBaseUrl}/api-keys`}>
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
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href={`https://join.slack.com/t/fixacommunity/shared_invite/zt-2wbw79829-01HGYT7SxVYPk8t6pTNb9w`}
                    target="_blank"
                  >
                    <LifebuoyIcon />
                    <span>support</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuBadge>
                  <OpenInNewWindowIcon />
                </SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <CustomOrganizationSwitcher />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
