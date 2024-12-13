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

import { useEffect, useState } from "react";
import { type Agent } from "@repo/types/src/index";
import { api } from "~/trpc/react";
import Spinner from "~/components/Spinner";
import {
  checkForValidPhoneNumber,
  formatPhoneNumber,
  displayPhoneNumberNicely,
} from "~/helpers/phoneNumberUtils";
import { useToast } from "~/components/hooks/use-toast";
import { useRouter } from "next/navigation";
import { generateTempId } from "~/lib/utils";
import Link from "next/link";

interface InputWithLabelProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

function InputWithLabel({ label, value, onChange }: InputWithLabelProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-md">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function AddAgentModal({
  children,
  refetchAgents,
  defaultOpen = false,
  unescapable = false,
}: {
  children?: React.ReactNode;
  refetchAgents: () => void;
  defaultOpen?: boolean;
  unescapable?: boolean;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setModalOpen(defaultOpen);
    }, 500);
  }, [defaultOpen]);

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
        // refetchAgents();
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
          <InputWithLabel
            label="agent name"
            value={agent?.name ?? ""}
            onChange={(value) => setAgent({ ...agent, name: value })}
          />
          <InputWithLabel
            label="agent_id (optional)"
            value={agent?.customerAgentId ?? ""}
            onChange={(value) => setAgent({ ...agent, customerAgentId: value })}
          />
          <InputWithLabel
            label="phone number"
            value={displayPhoneNumberNicely(agent?.phoneNumber ?? "")}
            onChange={(value) =>
              setAgent({ ...agent, phoneNumber: formatPhoneNumber(value) })
            }
          />
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
