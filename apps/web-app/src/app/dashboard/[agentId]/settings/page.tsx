"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
import { env } from "~/env";
import { useUser } from "@clerk/nextjs";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

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

  const handleSave = useCallback(() => {
    if (!agentState) return;
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
  }, [agentState, toast, updateAgentSettings]);

  if (!agentState) return null;

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
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <Label>install slack app</Label>
            <div className="text-xs text-muted-foreground">
              get notified when tests complete
            </div>
          </div>
          <InstallSlackAppButton agentId={params.agentId} />
        </div>
      </div>
    </div>
  );
}

function InstallSlackAppButton({ agentId }: { agentId: string }) {
  const { user } = useUser();

  const slackWebhookUrl = useMemo(
    () => user?.publicMetadata.slackWebhookUrl,
    [user],
  );

  const state = useMemo(() => {
    return JSON.stringify({ agentId });
  }, [agentId]);

  const href = useMemo(() => {
    return `https://slack.com/oauth/v2/authorize?scope=chat%3Awrite%2Cincoming-webhook&user_scope=&redirect_uri=${encodeURIComponent(
      env.NEXT_PUBLIC_SLACK_REDIRECT_URI,
    )}&client_id=${env.NEXT_PUBLIC_SLACK_CLIENT_ID}&state=${encodeURIComponent(
      state,
    )}`;
  }, [state]);

  const [isHovering, setIsHovering] = useState(false);

  return (
    <Button
      variant="outline"
      asChild
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <a href={href} className="flex w-48 items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{
            height: "20px",
            width: "20px",
            marginRight: "12px",
          }}
          viewBox="0 0 122.8 122.8"
        >
          <path
            d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z"
            fill="#e01e5a"
          ></path>
          <path
            d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z"
            fill="#36c5f0"
          ></path>
          <path
            d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z"
            fill="#2eb67d"
          ></path>
          <path
            d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z"
            fill="#ecb22e"
          ></path>
        </svg>
        {slackWebhookUrl ? (
          isHovering ? (
            "re-install"
          ) : (
            <span className="flex items-center gap-2">
              added to slack
              <CheckCircleIcon className="h-4 w-4 text-green-500" />
            </span>
          )
        ) : (
          "add to slack"
        )}
      </a>
    </Button>
  );
}
