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
import { type IntentWithoutId, type CreateAgentSchema } from "~/lib/agent";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import { IntentCard } from "./IntentCard";
import Spinner from "~/components/Spinner";
import {
  checkForValidPhoneNumber,
  formatPhoneNumber,
  displayPhoneNumberNicely,
} from "~/helpers/phoneNumberUtils";
import { useToast } from "~/hooks/use-toast";
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
  "finalizing intent structure",
];

export function AddAgentModal({ children, refetchAgents }: AddAgentModalProps) {
  const [isGeneratingIntents, setIsGeneratingIntents] = useState(false);
  const [loadingText, setLoadingText] = useState("generating scenarios");
  const [modalOpen, setModalOpen] = useState(false);
  const [numberOfIntents, setNumberOfIntents] = useState(3);
  const { toast } = useToast();

  useEffect(() => {
    if (!isGeneratingIntents) return;

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
  }, [isGeneratingIntents]);

  const [agent, setAgent] = useState<CreateAgentSchema>({
    name: "",
    systemPrompt: "",
    phoneNumber: "+1",
    createdAt: new Date(),
    updatedAt: new Date(),
    githubRepoUrl: "",
    ownerId: "",
    intents: [],
  });

  const addIntent = () => {
    setAgent({
      ...agent,
      intents: [
        ...agent.intents,
        { name: "", instructions: "", successCriteria: "", isNew: true },
      ],
    });
  };

  const { mutate: createAgent, isPending: isCreatingAgent } =
    api.agent.create.useMutation({
      onSuccess: () => {
        setModalOpen(false);
        refetchAgents();
      },
    });

  const { mutate: generateIntents } =
    api.agent.generateIntentsFromPrompt.useMutation({
      onSuccess: (data) => {
        setAgent({ ...agent, intents: [...agent.intents, ...data] });
        setIsGeneratingIntents(false);
      },
    });

  const handleGenerateIntents = (prompt: string) => {
    if (prompt.length > 0) {
      setIsGeneratingIntents(true);
      console.log("generating number of intents", numberOfIntents);
      generateIntents({ prompt, numberOfIntents });
      console.log("setGeneratingIntents to false");
    } else {
      toast({
        title: "Please enter a prompt to generate scenarios",
        variant: "destructive",
      });
    }
  };

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

  const setAgentIntents = (intents: IntentWithoutId[]) => {
    setAgent({ ...agent, intents });
  };

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-[80vh] w-[50vw] min-w-[600px] max-w-screen-sm flex-col p-0">
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
          <TextAreaWithLabel
            label="agent prompt"
            value={agent?.systemPrompt ?? ""}
            onChange={(value) => setAgent({ ...agent, systemPrompt: value })}
          />
          <div className="flex w-full flex-1 flex-grow flex-col gap-2">
            <div className="flex w-full flex-row items-center justify-between gap-2">
              <Label className="text-lg">scenarios</Label>
              <div className="flex gap-2">
                <Select
                  value={numberOfIntents.toString()}
                  onValueChange={(value) => setNumberOfIntents(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="3" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="7">7</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="9">9</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => handleGenerateIntents(agent.systemPrompt)}
                >
                  generate from prompt
                </Button>
              </div>
            </div>
            {isGeneratingIntents ? (
              <div className="flex w-full flex-1 flex-grow flex-col items-center justify-center gap-2 rounded-md bg-gray-100 p-4">
                <Spinner className="size-8" />
                <p className="text-sm text-gray-500">{loadingText}</p>
              </div>
            ) : (
              <div className="flex w-full flex-col gap-2">
                {agent.intents.map((intent, index) => (
                  <IntentCard
                    key={index}
                    intent={intent}
                    index={index}
                    intents={agent.intents}
                    setIntents={setAgentIntents}
                  />
                ))}
                <Button variant="outline" onClick={addIntent}>
                  add scenario
                </Button>
              </div>
            )}
          </div>
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
