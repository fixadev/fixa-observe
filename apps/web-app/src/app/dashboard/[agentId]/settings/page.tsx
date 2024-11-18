"use client";

import { useState, useEffect, useCallback } from "react";
import Spinner from "~/components/Spinner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import { useToast } from "~/components/hooks/use-toast";
import { type Agent } from "~/lib/agent";
import {
  checkForValidPhoneNumber,
  displayPhoneNumberNicely,
  formatPhoneNumber,
} from "~/helpers/phoneNumberUtils";
import { useAgent } from "~/app/contexts/UseAgent";
import Link from "next/link";
import { CopyText } from "~/components/dashboard/CopyText";
import { SidebarTrigger } from "~/components/ui/sidebar";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useRouter } from "next/navigation";

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
      <div className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-input bg-sidebar px-4 lg:h-[60px]">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <Link href={`/dashboard/${params.agentId}/settings`}>
            <div className="font-medium">settings</div>
          </Link>
        </div>
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
      router.push("/dashboard");
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
