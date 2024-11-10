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
import { cn } from "~/lib/utils";
import { type Agent, type CreateAgentSchema } from "~/lib/agent";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import { IntentCard } from "./IntentCard";
import Spinner from "~/components/Spinner";

interface AddAgentModalProps {
  children: React.ReactNode;
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
      <Label>{label}</Label>
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
      <Label>{label}</Label>
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
  "generating intents",
  "analyzing system prompt",
  "crafting agent behaviors",
  "finalizing intent structure",
];

export function AddAgentModal({ children }: AddAgentModalProps) {
  const [isGeneratingIntents, setIsGeneratingIntents] = useState(false);
  const [loadingText, setLoadingText] = useState("generating intents");
  const [modalOpen, setModalOpen] = useState(false);

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
    phoneNumber: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    githubRepoUrl: "",
    ownerId: "",
    intents: [
      {
        name: "",
        instructions: "",
      },
    ],
  });

  const addIntent = () => {
    setAgent({
      ...agent,
      intents: [...agent.intents, { name: "", instructions: "" }],
    });
  };

  const { mutate: createAgent } = api.agent.create.useMutation({
    onSuccess: () => {
      setModalOpen(false);
    },
  });

  const { mutate: generateIntents } =
    api.agent.generateIntentsFromPrompt.useMutation({
      onSuccess: (data) => {
        setAgent({ ...agent, intents: data });
        setIsGeneratingIntents(false);
      },
    });

  const handleGenerateIntents = (prompt: string) => {
    if (prompt.length > 0 && agent.intents.length === 1) {
      setIsGeneratingIntents(true);
      console.log("setGeneratingIntents to true");
      generateIntents({ prompt });
      console.log("setGeneratingIntents to false");
    }
  };

  useEffect(() => {
    console.log("isGeneratingIntents", isGeneratingIntents);
  }, [isGeneratingIntents]);

  useEffect(() => {
    console.log("modalOpen", modalOpen);
  }, [modalOpen]);

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-[80vh] w-[50vw] min-w-[600px] max-w-screen-xl flex-col p-0">
        <DialogTitle className="p-6 pb-2">new agent</DialogTitle>
        <div className="flex-1 space-y-4 overflow-y-auto p-6 pt-2">
          <InputWithLabel
            label="name"
            value={agent?.name ?? ""}
            onChange={(value) => setAgent({ ...agent, name: value })}
          />
          <InputWithLabel
            label="phone number"
            value={agent?.phoneNumber ?? ""}
            onChange={(value) => setAgent({ ...agent, phoneNumber: value })}
          />
          <InputWithLabel
            label="github repo url"
            value={agent?.githubRepoUrl ?? ""}
            onChange={(value) => setAgent({ ...agent, githubRepoUrl: value })}
          />
          <TextAreaWithLabel
            label="system prompt"
            value={agent?.systemPrompt ?? ""}
            onChange={(value) => setAgent({ ...agent, systemPrompt: value })}
            onBlur={() => handleGenerateIntents(agent.systemPrompt)}
          />
          <div className="flex flex-col gap-2">
            <Label>intents</Label>
            {isGeneratingIntents ? (
              <div className="flex h-[150px] w-full flex-col items-center justify-center gap-2 rounded-md bg-gray-100 p-4">
                <Spinner className="size-8" />
                <p className="text-sm text-gray-500">{loadingText}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {agent.intents.map((intent, index) => (
                  <IntentCard
                    key={index}
                    intent={intent}
                    index={index}
                    agent={agent}
                    setAgent={setAgent}
                    modalOpen={modalOpen}
                  />
                ))}
                <Button variant="outline" onClick={addIntent}>
                  add intent
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end border-t p-4">
          <Button onClick={() => createAgent(agent)}>create agent</Button>
        </div>
      </DialogContent>
      <DialogFooter></DialogFooter>
    </Dialog>
  );
}
