"use client";

import { useState, useEffect } from "react";
import { IntentCard } from "~/app/_components/IntentCard";
import { useAgent } from "~/app/contexts/UseAgent";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { type IntentWithoutId, type Intent } from "~/lib/agent";
import { api } from "~/trpc/react";

export default function AgentScenariosPage({
  params,
}: {
  params: { agentId: string };
}) {
  const [intents, setIntents] = useState<Intent[]>([]);
  const { agent, setAgent, refetch } = useAgent(params.agentId);
  const { toast } = useToast();
  useEffect(() => {
    if (agent) {
      setIntents(agent.intents);
    }
  }, [agent]);

  const { mutate: updateAgentIntents } = api.agent.updateIntents.useMutation({
    onSuccess: (data) => {
      setIntents(data.intents);
      if (data) {
        void refetch();
        toast({
          title: "Scenarios updated!",
          duration: 2000,
        });
      }
    },
  });

  if (!agent) return null;

  const addScenario = () => {
    setIntents([
      ...intents,
      {
        id: "new",
        name: "",
        instructions: "",
        successCriteria: "",
        agentId: agent.id,
        isNew: true,
      },
    ]);
  };

  const saveIntents = (intents: Array<Intent | IntentWithoutId>) => {
    toast({
      title: "Updating scenarios...",
      duration: 3000,
    });
    setIntents(
      intents.map((intent) => ({
        ...intent,
        id: "id" in intent ? intent.id : "temp",
        agentId: agent.id,
      })),
    );
    updateAgentIntents({ id: agent.id, intents });
  };

  return (
    <div className="flex flex-col">
      <div className="container flex items-center justify-between py-8">
        <div className="text-2xl font-medium">scenarios</div>
      </div>
      <div className="h-px w-full bg-input" />
      <div className="container flex flex-col gap-4 p-8">
        {intents.map((intent, index) => (
          <IntentCard
            index={index}
            key={intent.id}
            intent={intent}
            intentId={intent.id}
            intents={intents}
            setIntents={saveIntents}
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
