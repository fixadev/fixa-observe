"use client";

import { PlusIcon } from "@heroicons/react/24/solid";
import { Button } from "~/components/ui/button";
import AgentCard from "~/components/dashboard/AgentCard";
import { TEST_AGENT } from "~/lib/test-data";
import { AddAgentModal } from "~/app/_components/AddAgentModal";
import { api } from "~/trpc/react";

export default function DashboardPage() {
  const { data: agents, refetch: refetchAgents } = api.agent.getAll.useQuery();

  return (
    <div className="flex flex-1 flex-col gap-8 overflow-hidden">
      <div className="container flex items-center justify-between">
        <div className="text-2xl font-medium">agents.</div>
        <div>
          <AddAgentModal refetchAgents={refetchAgents}>
            <Button className="flex items-center gap-2">
              <PlusIcon className="size-4" /> create agent
            </Button>
          </AddAgentModal>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pb-8">
        <div className="container grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {agents?.map((agent) => <AgentCard key={agent.id} agent={agent} />)}
        </div>
      </div>
    </div>
  );
}
