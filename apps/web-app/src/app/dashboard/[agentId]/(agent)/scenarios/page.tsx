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

  const addScenario = () => {
    setAgent({
      ...agent,
      intents: [
        ...agent.intents,
        {
          id: "new",
          name: "",
          instructions: "",
          successCriteria: "",
          agentId: agent.id,
          isNew: true,
        },
      ],
    });
  };

  return (
    <div className="flex flex-col">
      <div className="container flex items-center justify-between py-8">
        <div className="text-2xl font-medium">scenarios</div>
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
      <div className="container flex flex-col gap-4 p-8">
        {agent.intents.map((intent, index) => (
          <IntentCard
            index={index}
            key={intent.id}
            intent={intent}
            agent={agent}
            setAgent={(updatedAgent) =>
              setAgent(updatedAgent as AgentWithIncludes)
            }
          />
        ))}
        <div className="flex flex-row justify-end">
          <Button variant="outline" onClick={addScenario}>
            Add Scenario
          </Button>
        </div>
      </div>
    </div>
  );
}
