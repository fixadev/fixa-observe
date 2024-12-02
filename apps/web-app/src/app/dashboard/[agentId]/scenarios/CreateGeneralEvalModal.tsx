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
import { type ReactNode, useEffect, useState } from "react";
import { useToast } from "~/components/hooks/use-toast";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { type EvalWithoutScenarioId, type EvalSchema } from "~/lib/agent";
import { InputWithLabel } from "~/app/_components/InputWithLabel";
import { TextAreaWithLabel } from "~/app/_components/TextAreaWithLabel";

export const CreateGeneralEvalModal = ({
  existingEval,
  setExistingEval,
  children,
}: {
  existingEval: EvalSchema | null;
  setExistingEval: React.Dispatch<React.SetStateAction<EvalSchema | null>>;
  children: ReactNode;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [evaluation, setEvaluation] = useState<
    EvalSchema | EvalWithoutScenarioId
  >(
    existingEval ?? {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      name: "",
      description: "",
      type: "general",
      resultType: "number",
      contentType: "tool",
      enabled: true,
      scenarioId: null,
      agentId: null,
      ownerId: null,
    },
  );
  const { toast } = useToast();

  const { mutate: createGeneralEval } = api.eval.createGeneralEval.useMutation({
    onSuccess: (data) => {
      toast({
        title: "eval created",
        description: "eval created successfully",
      });
      setExistingEval(data);
    },
  });

  const { mutate: updateGeneralEval } = api.eval.updateGeneralEval.useMutation({
    onSuccess: () => {
      toast({
        title: "eval updated",
        description: "eval updated successfully",
      });
    },
  });

  const handleSave = () => {
    if (existingEval) {
      updateGeneralEval(evaluation);
    } else {
      createGeneralEval(evaluation as EvalWithoutScenarioId);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>create general eval</DialogTitle>
        <div className="flex w-full flex-row justify-between gap-4">
          <InputWithLabel
            label="name"
            value={evaluation.name}
            onChange={(e) => setEvaluation({ ...evaluation, name: e })}
          />
          <div className="flex flex-col gap-2">
            <Label>type</Label>
            <Select
              value={evaluation.contentType}
              onValueChange={(value) =>
                setEvaluation({
                  ...evaluation,
                  contentType: value as "tool" | "content",
                })
              }
            >
              <SelectTrigger>
                <SelectValue defaultValue="content" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem id="tool" value="tool">
                  tool
                </SelectItem>
                <SelectItem id="content" value="content">
                  content
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>result type</Label>
            <Select disabled={evaluation.resultType === "boolean"}>
              <SelectTrigger>
                <SelectValue placeholder="result type" />
              </SelectTrigger>
            </Select>
          </div>
        </div>
        {evaluation.contentType === "tool" ? (
          <div className="flex flex-col gap-2">
            <TextAreaWithLabel
              label="when should this tool be called?"
              value={evaluation.description}
              onChange={(e) => setEvaluation({ ...evaluation, description: e })}
            />
            <TextAreaWithLabel
              label="parameters"
              value={evaluation.description}
              onChange={(e) => setEvaluation({ ...evaluation, description: e })}
            />
            <TextAreaWithLabel
              label="expected result of tool call"
              value={evaluation.description}
              onChange={(e) => setEvaluation({ ...evaluation, description: e })}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <TextAreaWithLabel
              label="success description"
              value={evaluation.description}
              onChange={(e) => setEvaluation({ ...evaluation, description: e })}
            />
          </div>
        )}

        <div className="flex flex-row justify-end gap-2">
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            cancel
          </Button>
          <Button onClick={handleSave}>save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
