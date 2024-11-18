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
import {
  type CreateScenarioSchema,
  type CreateAgentSchema,
  type ScenarioWithEvals,
} from "~/lib/agent";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import { ScenarioCard } from "../../../_components/ScenarioCard";
import Spinner from "~/components/Spinner";
import {
  checkForValidPhoneNumber,
  formatPhoneNumber,
  displayPhoneNumberNicely,
} from "~/helpers/phoneNumberUtils";
import { useToast } from "~/components/hooks/use-toast";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";

interface AddAgentModalProps {
  children: React.ReactNode;
  refetchAgents: () => void;
}

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

function TextAreaWithLabel({
  label,
  value,
  onChange,
  onBlur,
}: InputWithLabelProps) {
  return (
    <div className="flex h-48 flex-col gap-2">
      <Label className="text-md">{label}</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-full"
        onBlur={onBlur}
      />
    </div>
  );
}

const loadingMessages = [
  "generating scenarios",
  "analyzing system prompt",
  "crafting agent behaviors",
  "finalizing scenario structure",
];

export function AddAgentModal({ children, refetchAgents }: AddAgentModalProps) {
  const [isGeneratingScenarios, setIsGeneratingScenarios] = useState(false);
  const [loadingText, setLoadingText] = useState("generating scenarios");
  const [modalOpen, setModalOpen] = useState(false);
  const [numberOfScenarios, setNumberOfScenarios] = useState(3);
  const { toast } = useToast();

  useEffect(() => {
    if (!isGeneratingScenarios) return;

    let messageIndex = 0;
    let dotCount = 0;

    const interval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;

      if (dotCount === 0) {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
      }

      const dots = ".".repeat(dotCount);
      setLoadingText(`${loadingMessages[messageIndex]}${dots}`);
    }, 500); // Dots animate every 500ms

    return () => clearInterval(interval);
  }, [isGeneratingScenarios]);

  const [agent, setAgent] = useState<CreateAgentSchema>({
    name: "",
    systemPrompt: "",
    phoneNumber: "+1",
    createdAt: new Date(),
    updatedAt: new Date(),
    githubRepoUrl: "",
    ownerId: "",
    scenarios: [],
  });

  const { mutate: createAgent, isPending: isCreatingAgent } =
    api.agent.create.useMutation({
      onSuccess: () => {
        setModalOpen(false);
        refetchAgents();
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
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="h-100 flex w-[50vw] flex-col p-0">
        <DialogTitle className="p-6 pb-2">new agent</DialogTitle>
        <div className="flex flex-1 flex-col space-y-4 overflow-y-auto p-6 pt-2">
          <InputWithLabel
            label="name"
            value={agent?.name ?? ""}
            onChange={(value) => setAgent({ ...agent, name: value })}
          />
          <InputWithLabel
            label="phone number"
            value={displayPhoneNumberNicely(agent?.phoneNumber ?? "")}
            onChange={(value) =>
              setAgent({ ...agent, phoneNumber: formatPhoneNumber(value) })
            }
          />
        </div>
        <div className="flex justify-end border-t p-4">
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
