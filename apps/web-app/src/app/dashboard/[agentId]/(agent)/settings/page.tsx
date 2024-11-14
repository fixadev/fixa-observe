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

export default function AgentSettingsPage({
  params,
}: {
  params: { agentId: string };
}) {
  const { toast } = useToast();
  const [agent, setAgent] = useState<Agent | null>(null);

  const { data: agentData, refetch: refetchAgent } = api.agent.get.useQuery({
    id: params.agentId,
  });

  const { mutate: updateAgentSettings, isPending: isUpdatingSettings } =
    api.agent.updateSettings.useMutation({
      onSuccess: (data) => {
        toast({
          title: "Settings saved",
        });
        void refetchAgent();
      },
    });

  useEffect(() => {
    if (agentData) {
      setAgent(agentData);
    }
  }, [agentData]);

  if (!agent) return null;

  const handleSave = () => {
    if (!checkForValidPhoneNumber(agent.phoneNumber)) {
      toast({
        variant: "destructive",
        title: "Invalid phone number",
      });
      return;
    }
    updateAgentSettings({
      id: agent.id,
      phoneNumber: agent.phoneNumber,
      name: agent.name,
    });
  };

  return (
    <div className="flex flex-col">
      <div className="container flex items-center justify-between py-8">
        <div className="text-2xl font-medium">settings</div>
        <Button
          className="flex w-32 items-center gap-2"
          disabled={
            JSON.stringify(agent) === JSON.stringify(agentData) ||
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
            value={agent.name}
            onChange={(e) => {
              setAgent({ ...agent, name: e.target.value });
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Agent Phone Number</Label>
          <Input
            value={displayPhoneNumberNicely(agent.phoneNumber)}
            onChange={(e) => {
              setAgent({
                ...agent,
                phoneNumber: formatPhoneNumber(e.target.value),
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
