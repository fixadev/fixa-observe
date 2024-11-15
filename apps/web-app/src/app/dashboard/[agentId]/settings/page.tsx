"use client";

import { useState, useEffect } from "react";
import Spinner from "~/components/Spinner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";
import { type Agent } from "~/lib/agent";
import {
  checkForValidPhoneNumber,
  displayPhoneNumberNicely,
  formatPhoneNumber,
} from "~/helpers/phoneNumberUtils";
import { useAgent } from "~/app/contexts/UseAgent";

export default function AgentSettingsPage({
  params,
}: {
  params: { agentId: string };
}) {
  const [agentState, setAgentState] = useState<Agent | null>(null);

  const { toast } = useToast();
  const { agent, refetch } = useAgent(params.agentId);

  const { mutate: updateAgentSettings, isPending: isUpdatingSettings } =
    api.agent.updateSettings.useMutation({
      onSuccess: () => {
        toast({
          title: "Settings saved",
        });
        void refetch();
      },
    });

  useEffect(() => {
    if (agent) {
      setAgentState(agent);
    }
  }, [agent]);

  if (!agentState) return null;

  const handleSave = () => {
    if (!checkForValidPhoneNumber(agentState.phoneNumber)) {
      toast({
        variant: "destructive",
        title: "Invalid phone number",
      });
      return;
    }
    updateAgentSettings({
      id: agentState.id,
      phoneNumber: agentState.phoneNumber,
      name: agentState.name,
    });
  };

  return (
    <div className="flex flex-col">
      <div className="container flex items-center justify-between py-8">
        <div className="text-2xl font-medium">settings</div>
        <Button
          className="flex w-32 items-center gap-2"
          disabled={
            JSON.stringify(agent) === JSON.stringify(agentState) ||
            isUpdatingSettings
          }
          onClick={handleSave}
        >
          {isUpdatingSettings ? (
            <>
              <span>Saving...</span>
              <Spinner />
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
      <div className="h-px w-full bg-input" />
      <div className="container flex flex-col gap-6 p-8">
        <div className="flex flex-col gap-2">
          <Label>Agent Name</Label>
          <Input
            value={agentState.name}
            onChange={(e) => {
              setAgentState({ ...agentState, name: e.target.value });
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Agent Phone Number</Label>
          <Input
            value={displayPhoneNumberNicely(agentState.phoneNumber)}
            onChange={(e) => {
              setAgentState({
                ...agentState,
                phoneNumber: formatPhoneNumber(e.target.value),
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
