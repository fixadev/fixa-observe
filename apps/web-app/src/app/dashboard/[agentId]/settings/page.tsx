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
import Link from "next/link";
import { CopyText } from "~/components/dashboard/CopyText";

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
    <div>
      <div className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-input bg-[#FAFBFC] px-4 lg:h-[60px]">
        <Link href={`/dashboard/${params.agentId}/settings`}>
          <div className="font-medium">settings</div>
        </Link>
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
              <span>saving...</span>
              <Spinner />
            </>
          ) : (
            "save changes"
          )}
        </Button>
      </div>
      <div className="container flex flex-col gap-6 p-4">
        <div className="flex flex-col gap-2">
          <Label>agent id</Label>
          <CopyText text={agentState.id} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>agent name</Label>
          <Input
            value={agentState.name}
            onChange={(e) => {
              setAgentState({ ...agentState, name: e.target.value });
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>agent phone number</Label>
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
