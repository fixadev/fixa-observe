"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { useState } from "react";
import { type Agent } from "@repo/types/src/index";
import { api } from "~/trpc/react";
import Spinner from "~/components/Spinner";
import {
  checkForValidPhoneNumber,
  displayPhoneNumberNicely,
} from "~/helpers/phoneNumberUtils";
import { useToast } from "~/components/hooks/use-toast";
import { useRouter } from "next/navigation";
import { generateTempId } from "~/lib/utils";
import Link from "next/link";

export function AddAgentModal({
  children,
  defaultOpen = false,
  unescapable = false,
}: {
  children?: React.ReactNode;
  defaultOpen?: boolean;
  unescapable?: boolean;
}) {
  const [modalOpen, setModalOpen] = useState(defaultOpen);
  const { toast } = useToast();
  const router = useRouter();
  const utils = api.useUtils();
  const [agent, setAgent] = useState<Agent>({
    id: generateTempId(),
    name: "",
    systemPrompt: "",
    phoneNumber: "+1",
    createdAt: new Date(),
    updatedAt: new Date(),
    customerAgentId: "",
    githubRepoUrl: "",
    ownerId: "",
    enableSlackNotifications: false,
    extraProperties: {},
  });

  const { mutate: createAgent, isPending: isCreatingAgent } =
    api.agent.create.useMutation({
      onSuccess: (newAgent) => {
        setModalOpen(false);
        void utils.agent.getAll.invalidate();
        router.push(`/dashboard/${newAgent.id}/scenarios`);
      },
    });

  const handleCreateAgent = () => {
    if (!checkForValidPhoneNumber(agent.phoneNumber)) {
      toast({
        title: "Invalid phone number",
        variant: "destructive",
        description: "Please enter a valid phone number",
      });
      return;
    } else {
      createAgent(agent);
    }
  };

  return (
    <Dialog
      open={modalOpen}
      onOpenChange={unescapable ? undefined : setModalOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="h-100 flex w-[50vw] flex-col p-0">
        <DialogTitle className="p-6 pb-2">
          {unescapable ? "add an agent to get started" : "new agent"}
        </DialogTitle>
        <div className="flex flex-1 flex-col space-y-4 overflow-y-auto p-6 pt-2">
          <div className="flex flex-col gap-2">
            <div>
              <Label>agent name</Label>
              <div className="text-xs text-muted-foreground">
                name of your agent, to help you identify it
              </div>
            </div>
            <Input
              placeholder="my agent"
              value={agent?.name ?? ""}
              onChange={(e) => setAgent({ ...agent, name: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <div className="mb-1 flex items-baseline gap-2">
                <Label>internal agent ID</Label>
                <span className="text-xs text-muted-foreground">
                  (optional)
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                the ID of this agent in your database, used to associate
                production calls with the agent created in fixa.
              </div>
            </div>
            <Input
              placeholder="agent_123456"
              value={agent?.customerAgentId ?? ""}
              onChange={(e) =>
                setAgent({ ...agent, customerAgentId: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <Label>phone number</Label>
              <div className="text-xs text-muted-foreground">
                the phone number we call to test your agent
              </div>
            </div>
            <Input
              value={displayPhoneNumberNicely(agent?.phoneNumber ?? "")}
              onChange={(e) =>
                setAgent({ ...agent, phoneNumber: e.target.value })
              }
            />
          </div>
        </div>
        <div className="flex justify-between border-t p-4">
          <div className="flex flex-col gap-1 text-xs">
            <p className="font-medium">have a web-based agent?</p>
            <p className="text-muted-foreground">
              <Link
                href="https://cal.com/team/fixa/implementation-meeting"
                target="_blank"
                className="hover:underline"
              >
                we&apos;ll connect it for you
              </Link>
            </p>
          </div>
          <Button
            className="flex w-32 items-center gap-2"
            onClick={handleCreateAgent}
            disabled={isCreatingAgent}
          >
            {isCreatingAgent ? (
              <>
                creating...
                <Spinner className="size-4" />
              </>
            ) : (
              "create agent"
            )}
          </Button>
        </div>
      </DialogContent>
      <DialogFooter></DialogFooter>
    </Dialog>
  );
}
