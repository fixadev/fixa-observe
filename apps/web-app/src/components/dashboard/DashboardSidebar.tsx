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
  CheckIcon,
  CreditCardIcon,
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
import { useCallback, useMemo } from "react";
import { removeTrailingSlash } from "~/lib/utils";
import { api } from "~/trpc/react";
import Logo from "../Logo";
import { SlackIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { AddAgentModal } from "~/app/dashboard/(agents)/_components/AddAgentModal";
import { useAgent } from "~/app/contexts/UseAgent";
import { UserButton } from "@clerk/nextjs";

const navItems = [
  { href: "/", icon: CounterClockwiseClockIcon, label: "test history" },
  { href: "/scenarios", icon: ChatBubbleOvalLeftIcon, label: "scenarios" },
  { href: "/evals", icon: CheckIcon, label: "evaluation criteria" },
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

  const { data: agents, refetch: refetchAgents } = api.agent.getAll.useQuery();

  const { agent } = useAgent();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="-m-2 flex h-14 items-center justify-between border-b px-4 lg:h-[60px]">
          <Select
            onValueChange={(value) => {
              if (value === "observe") {
                router.push(`/observe/`);
              }
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="test" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="test">test</SelectItem>
              <SelectItem value="observe">observe</SelectItem>
            </SelectContent>
          </Select>
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Link
                href="/billing"
                label="billing"
                labelIcon={<CreditCardIcon />}
              />
              <UserButton.Action label="manageAccount" />
              <UserButton.Action label="signOut" />
            </UserButton.MenuItems>
          </UserButton>
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
                      {!agent ? (
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
                      <AddAgentModal refetchAgents={refetchAgents}>
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
                    <Link href={`${agentBaseUrl}${item.href}`}>
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
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isCurrentPath("/slack-app")}
                >
                  <Link href={`observe/slack-app`}>
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
                  <Link href={`observe/api-keys`}>
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
                    <SlackIcon />
                    <span>support</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuBadge>
                  <OpenInNewWindowIcon />
                </SidebarMenuBadge>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
