"use client";

import { useCallback, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import Spinner from "~/components/Spinner";
import { useObserveState } from "~/components/hooks/useObserveState";
import { useToast } from "~/components/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface GenerateEvalGroupsFromPromptDialogProps {
  searchId: string;
}

export function GenerateEvalGroupsDialog({
  searchId,
}: GenerateEvalGroupsFromPromptDialogProps) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState(1);
  // const { setSavedSearch } = useObserveState();
  const { toast } = useToast();
  const utils = api.useUtils();

  const { mutate: generateEvaluationGroups, isPending } =
    api.evaluation.createGroupsFromPrompt.useMutation({
      onSuccess: async () => {
        setOpen(false);
        setPrompt("");
        setCount(1);
        await utils.search.getById.invalidate({ id: searchId });
        toast({
          title: "Evaluation groups generated",
          description: "Evaluation groups have been generated",
        });
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Error",
          description: "Error generating evaluation groups",
        });
      },
    });

  const handleGenerateEvaluationGroups = useCallback(() => {
    generateEvaluationGroups({
      savedSearchId: searchId,
      prompt,
      count,
    });
  }, [generateEvaluationGroups, searchId, prompt, count]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>generate with AI</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>generate evaluation groups</DialogTitle>
          <DialogDescription>
            paste your prompt, a brief description of your agent, or what you
            want to evaluate.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to evaluate..."
              className="min-h-[100px]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="count">Number of groups</Label>
            <Select
              value={count.toString()}
              onValueChange={(value) => setCount(Number(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleGenerateEvaluationGroups}
            disabled={!prompt || isPending}
          >
            {isPending && <Spinner className="mr-2" />}
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
