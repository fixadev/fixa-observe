"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { type CreateScenarioSchema, type CreateAgentSchema } from "~/lib/agent";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import { ScenarioCard } from "../../../_components/ScenarioCard";
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
import { useAgent } from "~/app/contexts/UseAgent";

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

export default function Page() {
  const [isGeneratingScenarios, setIsGeneratingScenarios] = useState(false);
  const [loadingText, setLoadingText] = useState("generating scenarios");
  const [numberOfScenarios, setNumberOfScenarios] = useState(3);

  const { toast } = useToast();
  const router = useRouter();

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

  const addScenario = () => {
    setAgent({
      ...agent,
      scenarios: [
        ...agent.scenarios,
        {
          name: "",
          instructions: "",
          successCriteria: "",
          isNew: true,
          evals: [],
        },
      ],
    });
  };

  const { mutate: createAgent, isPending: isCreatingAgent } =
    api.agent.create.useMutation({
      onSuccess: (agent) => {
        router.push(`/dashboard/${agent.id}`);
      },
    });

  const { mutate: generateScenarios } =
    api.agent.generateScenariosFromPrompt.useMutation({
      onSuccess: (data) => {
        setAgent({ ...agent, scenarios: [...agent.scenarios, ...data] });
        setIsGeneratingScenarios(false);
      },
    });

  const handleGenerateScenarios = (prompt: string) => {
    if (prompt.length > 0) {
      setIsGeneratingScenarios(true);
      generateScenarios({ prompt, numberOfScenarios });
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

  const setAgentScenarios = (scenarios: CreateScenarioSchema[]) => {
    setAgent({ ...agent, scenarios });
  };

  return (
    <div className="flex h-[95vh] w-[95vw] min-w-[95vw] flex-col p-0">
      <h1 className="p-6 pb-2">new agent</h1>
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
                value={numberOfScenarios.toString()}
                onValueChange={(value) => setNumberOfScenarios(parseInt(value))}
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
                onClick={() => handleGenerateScenarios(agent.systemPrompt)}
              >
                generate from prompt
              </Button>
            </div>
          </div>
          {isGeneratingScenarios ? (
            <div className="flex w-full flex-1 flex-grow flex-col items-center justify-center gap-2 rounded-md bg-gray-100 p-4">
              <Spinner className="size-8" />
              <p className="text-sm text-gray-500">{loadingText}</p>
            </div>
          ) : (
            <div className="flex w-full flex-col gap-2">
              {agent.scenarios.map((scenario, index) => (
                <ScenarioCard
                  key={index}
                  scenario={scenario}
                  index={index}
                  scenarios={agent.scenarios}
                  setScenarios={setAgentScenarios}
                />
              ))}
              <Button variant="outline" onClick={addScenario}>
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
    </div>
  );
}
