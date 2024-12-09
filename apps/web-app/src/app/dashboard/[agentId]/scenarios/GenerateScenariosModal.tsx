"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import { type AgentWithIncludes } from "@repo/types";
import { type ReactNode, useEffect, useState } from "react";
import { useToast } from "~/components/hooks/use-toast";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import Spinner from "~/components/Spinner";

export const GenerateScenariosModal = ({
  agent,
  setAgent,
  children,
}: {
  agent: AgentWithIncludes;
  setAgent: React.Dispatch<React.SetStateAction<AgentWithIncludes | null>>;
  children: ReactNode;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGeneratingScenarios, setIsGeneratingScenarios] = useState(false);
  const [numberOfScenarios, setNumberOfScenarios] = useState(3);
  const [prompt, setPrompt] = useState("");
  const { toast } = useToast();

  const { mutate: generateScenarios } =
    api.scenario.generateFromPrompt.useMutation({
      onSuccess: (data) => {
        setAgent({
          ...agent,
          scenarios: [...agent.scenarios, ...data],
        });
        setIsGeneratingScenarios(false);
        // toast({
        //   title: "Scenarios generated",
        //   description: "Scenarios generated successfully",
        // });
        setIsModalOpen(false);
        setPrompt("");
      },
    });

  useEffect(() => {
    console.log("PROMPT", prompt);
  }, [prompt]);

  const handleGenerateScenarios = () => {
    console.log("PROMPT", prompt);
    if (prompt.length > 0) {
      setIsGeneratingScenarios(true);
      generateScenarios({ prompt, numberOfScenarios, agentId: agent.id });
    } else {
      toast({
        title: "please enter a prompt to generate scenarios",
        variant: "destructive",
      });
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Generate Scenarios</DialogTitle>
        <div className="flex w-full flex-col justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Label className="text-md">agent prompt</Label>
            {/* <Label className="text-sm font-normal text-muted-foreground">
              the prompt that the agent will use to generate scenarios
            </Label> */}
          </div>

          <Textarea
            value={prompt}
            className="h-64"
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <div className="flex flex-row justify-end gap-2">
          <div className="w-[60px]">
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
          </div>
          <Button
            variant="default"
            onClick={() => handleGenerateScenarios()}
            disabled={isGeneratingScenarios}
          >
            {isGeneratingScenarios ? (
              <div className="flex flex-row items-center gap-2">
                generating...
                <Spinner />
              </div>
            ) : (
              "generate"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
