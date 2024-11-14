"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { type AgentWithIncludes } from "~/lib/types";
import { api } from "~/trpc/react";

export default function AgentSettingsPage({
  params,
}: {
  params: { agentId: string };
}) {
  const [agent, setAgent] = useState<AgentWithIncludes | null>(null);
  const { data: agentData } = api.agent.get.useQuery({ id: params.agentId });
  const { mutate: updateAgentIntents } = api.agent.updateIntents.useMutation();

  useEffect(() => {
    if (agentData) {
      setAgent(agentData);
    }
  }, [agentData]);

  if (!agent) return null;

  return (
    <div className="flex flex-col">
      <div className="container flex items-center justify-between py-8">
        <div className="text-2xl font-medium">settings</div>
        <Button
          disabled={JSON.stringify(agent) === JSON.stringify(agentData)}
          onClick={() => {
            updateAgentIntents({ id: agent.id, intents: agent.intents });
          }}
        >
          Save Changes
        </Button>
      </div>
      <div className="h-px w-full bg-input" />
      <div className="container flex flex-col gap-6 p-8">
        <div className="flex flex-col gap-2">
          <Label>Agent Name</Label>
          <Input value={agent.name} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Agent Phone Number</Label>
          <Input value={agent.phoneNumber} />
        </div>
      </div>
    </div>
  );
}
