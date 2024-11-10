"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
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

  const { mutate: createAgent } = api.agent.create.useMutation();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[50vw] min-w-[600px] max-w-screen-xl overflow-y-auto p-6">
        <DialogTitle>new agent</DialogTitle>
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
        />
        <div className="flex flex-col gap-2">
          <Label>intents</Label>
          {agent.intents.map((intent, index) => (
            <IntentCard
              key={index}
              intent={intent}
              index={index}
              agent={agent}
              setAgent={setAgent}
            />
          ))}
          <Button variant="outline" onClick={addIntent}>
            add intent
          </Button>
        </div>
      </DialogContent>
      <DialogFooter>
        <Button onClick={() => createAgent(agent)}>create agent</Button>
      </DialogFooter>
    </Dialog>
  );
}
