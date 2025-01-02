import { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EvaluationTabSection } from "@/components/evaluations/EvaluationTabSection";
import {
  type EvaluationTemplate,
  type EvaluationWithIncludes,
} from "@repo/types/src";
import { instantiateEvaluation } from "~/lib/instantiate";
import { useParams } from "next/navigation";
import { useAgent } from "~/app/contexts/UseAgent";
import { api } from "~/trpc/react";

interface GeneralEvaluationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (evaluations: EvaluationWithIncludes[]) => void;
}

export function GeneralEvaluationsDialog({
  open,
  onOpenChange,
  onSave,
}: GeneralEvaluationsDialogProps) {
  const { agentId } = useParams();
  const { agent, setAgent } = useAgent(agentId as string);

  const [evaluations, setEvaluations] = useState<EvaluationWithIncludes[]>(
    agent?.enabledGeneralEvaluations ?? [],
  );
  useEffect(() => {
    setEvaluations(agent?.enabledGeneralEvaluations ?? []);
  }, [agent?.enabledGeneralEvaluations]);

  const handleAddEvaluation = useCallback((template: EvaluationTemplate) => {
    setEvaluations((prev) => [
      ...prev,
      instantiateEvaluation({ evaluationTemplate: template }),
    ]);
  }, []);
  const handleUpdateEvaluation = useCallback(
    (evaluationId: string, evaluation: EvaluationWithIncludes) => {
      setEvaluations((prev) =>
        prev.map((e) => (e.id === evaluationId ? evaluation : e)),
      );
    },
    [],
  );
  const handleDeleteEvaluation = useCallback((evaluationId: string) => {
    setEvaluations((prev) => prev.filter((e) => e.id !== evaluationId));
  }, []);

  const handleCancel = useCallback(() => {
    setEvaluations(agent?.enabledGeneralEvaluations ?? []);
    onOpenChange(false);
  }, [agent?.enabledGeneralEvaluations, onOpenChange]);
  const handleSave = useCallback(() => {
    onSave(evaluations);
    onOpenChange(false);
  }, [evaluations, onSave, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>general evaluations</DialogTitle>
        </DialogHeader>
        <EvaluationTabSection
          evaluations={evaluations}
          onAddEvaluation={handleAddEvaluation}
          onUpdateEvaluation={handleUpdateEvaluation}
          onDeleteEvaluation={handleDeleteEvaluation}
        />
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            cancel
          </Button>
          <Button onClick={handleSave}>save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
