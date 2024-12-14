"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Spinner from "~/components/Spinner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import { useToast } from "~/components/hooks/use-toast";
import {
  checkForValidPhoneNumber,
  displayPhoneNumberNicely,
  formatPhoneNumber,
} from "~/helpers/phoneNumberUtils";
import { useAgent } from "~/app/contexts/UseAgent";
import Link from "next/link";
import { CopyText } from "~/components/CopyText";
import { SidebarTrigger } from "~/components/ui/sidebar";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Switch } from "~/components/ui/switch";
import { useUser } from "@clerk/nextjs";
import { cn } from "~/lib/utils";
import {
  type ExtraProperties,
  type AgentWithIncludes,
} from "@repo/types/src/index";
import { OfOneKioskSettings } from "./_components/OfOneKioskSettings";

export default function AgentSettingsPage({
  params,
}: {
  params: { agentId: string };
}) {
  const [agentState, setAgentState] = useState<AgentWithIncludes | null>(null);
  const originalAgentState = useRef<AgentWithIncludes | null>(null);

  const { toast } = useToast();
  const { agent, refetch, setAgent } = useAgent(params.agentId);
  const { user } = useUser();

  const isSlackAppInstalled = useMemo(
    () => Boolean(user?.publicMetadata.slackWebhookUrl),
    [user],
  );

  const { mutate: updateAgent, isPending: isUpdatingSettings } =
    api.agent.updateAgent.useMutation({
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
      originalAgentState.current = agent;
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
    updateAgent({
      id: agentState.id,
      agent: {
        phoneNumber: agentState.phoneNumber,
        name: agentState.name,
        enableSlackNotifications: agentState.enableSlackNotifications,
        customerAgentId: agentState.customerAgentId,
        extraProperties: agentState.extraProperties,
      },
    });
    setAgent(agentState);
  }, [agentState, toast, updateAgent, setAgent]);

  const handleDiscardChanges = useCallback(() => {
    setAgentState(originalAgentState.current);
  }, [originalAgentState]);

  if (!agentState) return null;

  return (
    <div>
      <div className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-input bg-sidebar px-4 lg:h-[60px]">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <Link href={`/dashboard/${params.agentId}/settings`}>
            <div className="font-medium">settings</div>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {!(
            JSON.stringify(agent) === JSON.stringify(agentState) ||
            isUpdatingSettings
          ) && (
            <Button variant="outline" onClick={handleDiscardChanges}>
              discard
            </Button>
          )}
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
      </div>
      <div className="container flex flex-col gap-6 p-4">
        <div className="flex flex-col gap-2">
          <div>
            <Label>agent id</Label>
            <div className="text-xs text-muted-foreground">
              agent ID to be used with fixa API requests
            </div>
          </div>
          <CopyText text={agentState.id} />
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <Label>agent name</Label>
            <div className="text-xs text-muted-foreground">
              name of your agent, to help you identify it
            </div>
          </div>
          <Input
            placeholder="my agent"
            value={agentState.name}
            onChange={(e) => {
              setAgentState({ ...agentState, name: e.target.value });
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <Label>internal agent ID</Label>
            <div className="text-xs text-muted-foreground">
              the ID of this agent in your database, used to associate
              production calls with the agent created in fixa.
            </div>
          </div>
          <Input
            placeholder="agent_123456"
            value={agentState.customerAgentId ?? ""}
            onChange={(e) => {
              setAgentState({
                ...agentState,
                customerAgentId: e.target.value,
              });
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <Label>agent phone number</Label>
            <div className="text-xs text-muted-foreground">
              the phone number we call to test your agent
            </div>
          </div>
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
        <div className="flex items-baseline gap-2">
          <Label>have a web-based agent?</Label>
          <p className="text-sm text-muted-foreground">
            <Link
              href="https://cal.com/team/fixa/implementation-meeting"
              target="_blank"
              className="underline"
            >
              we&apos;ll connect it for you
            </Link>
          </p>
        </div>
        {(agentState?.extraProperties as ExtraProperties)?.type ===
          "ofone-kiosk" && (
          <OfOneKioskSettings
            agentState={agentState}
            setAgentState={setAgentState}
          />
        )}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Label>slack app</Label>
            {!isSlackAppInstalled && (
              <Link
                className="text-sm text-muted-foreground underline"
                href={`/dashboard/${params.agentId}/slack-app`}
              >
                install now
              </Link>
            )}
          </div>
          <div
            className={cn(
              "flex items-center gap-2",
              !isSlackAppInstalled && "pointer-events-none opacity-50",
            )}
          >
            <Switch
              id="enableSlackNotifications"
              checked={
                isSlackAppInstalled && agentState.enableSlackNotifications
              }
              onCheckedChange={(checked) => {
                setAgentState({
                  ...agentState,
                  enableSlackNotifications: checked,
                });
              }}
            />
            <Label className="font-normal" htmlFor="enableSlackNotifications">
              enable slack notifications
            </Label>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <Label>danger zone</Label>
          </div>
          <DeleteAgentDialog agentId={params.agentId} />
        </div>
      </div>
    </div>
  );
}

function DeleteAgentDialog({ agentId }: { agentId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const utils = api.useUtils();

  const { mutate: deleteAgent, isPending } = api.agent.delete.useMutation({
    onSuccess: () => {
      console.log("invalidating agents");
      void utils.agent.getAll.invalidate();
      router.push("/dashboard/new");
      toast({
        title: "Agent deleted",
        description: "Agent has been deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete agent",
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-fit text-destructive hover:text-destructive"
          variant="outline"
        >
          delete agent
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>delete agent</DialogTitle>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            are you sure you want to delete this agent? this action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteAgent({ id: agentId })}
              disabled={isPending}
            >
              {isPending ? <Spinner /> : "delete"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
