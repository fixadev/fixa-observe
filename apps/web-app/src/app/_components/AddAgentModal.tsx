"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { type Agent, type AgentWithoutId } from "~/lib/agent";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";

interface AddAgentModalProps {
  children: React.ReactNode;
  onComplete: (agent: Agent) => void;
}

interface InputWithLabelProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function InputWithLabel({ label, value, onChange }: InputWithLabelProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function TextAreaWithLabel({ label, value, onChange }: InputWithLabelProps) {
  return (
    <div className="flex h-48 flex-col gap-2">
      <Label>{label}</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-full"
      />
    </div>
  );
}

export function AddAgentModal({ children, onComplete }: AddAgentModalProps) {
  const [agent, setAgent] = useState<AgentWithoutId>({
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

  const { mutate: createAgent } = api.agent.create.useMutation();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[50vw] min-w-[600px] max-w-screen-xl p-6">
        <DialogTitle>New Agent</DialogTitle>
        <InputWithLabel
          label="Name"
          value={agent?.name ?? ""}
          onChange={(value) => setAgent({ ...agent, name: value })}
        />
        <InputWithLabel
          label="Phone Number"
          value={agent?.phoneNumber ?? ""}
          onChange={(value) => setAgent({ ...agent, phoneNumber: value })}
        />
        <InputWithLabel
          label="Github Repo URL"
          value={agent?.githubRepoUrl ?? ""}
          onChange={(value) => setAgent({ ...agent, githubRepoUrl: value })}
        />
        <TextAreaWithLabel
          label="System Prompt"
          value={agent?.systemPrompt ?? ""}
          onChange={(value) => setAgent({ ...agent, systemPrompt: value })}
        />
        <div className="flex flex-col gap-2">
          <Label>Intents</Label>
          {agent.intents.map((intent, index) => (
            <div key={index} className="flex flex-col gap-2">
              <InputWithLabel
                label="Name"
                value={intent.name}
                onChange={(value) =>
                  setAgent({
                    ...agent,
                    intents: agent.intents.map((i, iIndex) =>
                      iIndex === index ? { ...i, name: value } : i,
                    ),
                  })
                }
              />
              <TextAreaWithLabel
                label="Instructions"
                value={intent.instructions}
                onChange={(value) =>
                  setAgent({
                    ...agent,
                    intents: agent.intents.map((i, iIndex) =>
                      iIndex === index ? { ...i, instructions: value } : i,
                    ),
                  })
                }
              />
            </div>
          ))}
          <Button variant="outline">Add Intent</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
