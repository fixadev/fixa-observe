"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import { useState, type ReactNode } from "react";
import { useToast } from "~/components/hooks/use-toast";
import { type AgentWithIncludes } from "~/lib/types";

export const CreateTestAgentModal = ({
  agent,
  setAgent,
  children,
}: {
  agent: AgentWithIncludes;
  setAgent: (agent: AgentWithIncludes) => void;
  children: ReactNode;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [headshotUrl, setHeadshotUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const { toast } = useToast();

  const { mutate: createTestAgent } = api.agent.createTestAgent.useMutation({
    onSuccess: (data) => {
      setAgent({
        ...agent,
        enabledTestAgents: [...agent.enabledTestAgents, data],
      });
      toast({
        title: "Test agent created",
        description: "Test agent created successfully",
      });
      setIsModalOpen(false);
      resetForm();
    },
  });

  const resetForm = () => {
    setName("");
    setDescription("");
    setHeadshotUrl("");
    setPrompt("");
  };

  const handleCreateTestAgent = () => {
    if (!name || !description || !headshotUrl || !prompt) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    createTestAgent({
      name,
      description,
      headshotUrl,
      prompt,
      agentId: agent.id,
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Create Test Agent</DialogTitle>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter test agent name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter test agent description"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Headshot URL</Label>
            <Input
              value={headshotUrl}
              onChange={(e) => setHeadshotUrl(e.target.value)}
              placeholder="Enter headshot URL"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Prompt</Label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter test agent prompt"
              className="h-32"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTestAgent}>Create</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
