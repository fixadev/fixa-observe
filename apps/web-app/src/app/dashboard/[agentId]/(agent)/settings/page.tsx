"use client";

import { useState, useEffect } from "react";
import { IntentCard } from "~/app/_components/IntentCard";
import { Button } from "~/components/ui/button";
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
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-xl font-bold">Scenarios</h1>
        <Button
          disabled={JSON.stringify(agent) === JSON.stringify(agentData)}
          onClick={() => {
            updateAgentIntents({ id: agent.id, intents: agent.intents });
          }}
        >
          Save Changes
        </Button>
      </div>
      {agent.intents.map((intent, index) => (
        <IntentCard
          index={index}
          key={intent.id}
          intent={intent}
          agent={agent}
          setAgent={(updatedAgent) =>
            setAgent(updatedAgent as AgentWithIncludes)
          }
          modalOpen={false}
        />
      ))}
      <div className="flex flex-row justify-end">
        <Button variant="outline">Add Scenario</Button>
      </div>
    </div>
  );
}
