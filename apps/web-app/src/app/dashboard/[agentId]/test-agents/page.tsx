"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAgent } from "~/app/contexts/UseAgent";
import { Switch } from "~/components/ui/switch";
import { api } from "~/trpc/react";
import Image from "next/image";
import { CopyText } from "~/components/CopyText";
import { SidebarTrigger } from "~/components/ui/sidebar";

export default function TestAgentsPage({
  params,
}: {
  params: { agentId: string };
}) {
  const { agent, setAgent } = useAgent();

  const { data: testAgents } = api.agent.getTestAgents.useQuery();
  const { mutate: toggleTestAgentEnabled } =
    api.agent.toggleTestAgentEnabled.useMutation();
  const [enabledAgents, setEnabledAgents] = useState<Set<string>>(
    new Set(agent?.enabledTestAgents.map((agent) => agent.id) ?? []),
  );

  useEffect(() => {
    setEnabledAgents(
      new Set(agent?.enabledTestAgents.map((agent) => agent.id) ?? []),
    );
  }, [agent]);

  const toggleAgent = useCallback(
    (testAgentId: string) => {
      toggleTestAgentEnabled({
        agentId: agent?.id ?? "",
        testAgentId,
        enabled: !enabledAgents.has(testAgentId),
      });

      const newEnabledAgents = new Set(enabledAgents);
      if (newEnabledAgents.has(testAgentId)) {
        newEnabledAgents.delete(testAgentId);
      } else {
        newEnabledAgents.add(testAgentId);
      }
      setEnabledAgents(newEnabledAgents);
      if (agent && testAgents) {
        const updatedTestAgents = testAgents.filter((testAgent) =>
          newEnabledAgents.has(testAgent.id),
        );
        setAgent((prev) => ({
          ...prev!,
          enabledTestAgents: updatedTestAgents,
        }));
      }
    },
    [agent, enabledAgents, setAgent, testAgents, toggleTestAgentEnabled],
  );

  if (!agent) return null;

  return (
    <div>
      <div className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-input bg-sidebar px-4 lg:h-[60px]">
        <div className="flex flex-1 items-center gap-2">
          <SidebarTrigger />
          <Link href={`/dashboard/${params.agentId}/test-agents`}>
            <div className="font-medium">personas</div>
          </Link>
        </div>
      </div>
      <div className="container flex flex-col gap-4 p-4">
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
          {testAgents?.map((agent) => (
            <div
              key={agent.id}
              onClick={() => toggleAgent(agent.id)}
              className="flex cursor-pointer items-center gap-4 rounded-md border border-input p-4 hover:bg-muted/40"
            >
              <div className="shrink-0">
                <Image
                  src={agent.headshotUrl}
                  alt={agent.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="text-sm font-medium">{agent.name}</div>
                <div className="text-xs text-muted-foreground">
                  {agent.description}
                </div>
                <CopyText size="xs" className="mt-2" text={agent.id} />
              </div>
              <Switch checked={enabledAgents.has(agent.id)} />
            </div>
          ))}
          {/* <div className="flex h-full cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-muted/50 p-4 text-sm text-muted-foreground hover:bg-muted">
            <PlusIcon className="size-4" />
            <span>create custom test agent</span>
          </div> */}
        </div>
      </div>
    </div>
  );
}
