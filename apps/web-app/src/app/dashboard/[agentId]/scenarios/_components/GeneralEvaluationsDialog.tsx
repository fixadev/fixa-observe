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
  type GeneralEvaluationWithIncludes,
  type EvaluationTemplate,
  type EvaluationWithIncludes,
} from "@repo/types/src";
import {
  instantiateEvaluation,
  instantiateGeneralEvaluation,
} from "~/lib/instantiate";
import { useParams } from "next/navigation";
import { useAgent } from "~/app/contexts/UseAgent";
import { api } from "~/trpc/react";
import Spinner from "~/components/Spinner";
import { useToast } from "~/components/hooks/use-toast";

interface GeneralEvaluationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GeneralEvaluationsDialog({
  open,
  onOpenChange,
}: GeneralEvaluationsDialogProps) {
  const { agentId } = useParams();
  const { agent, setAgent } = useAgent(agentId as string);
  const { toast } = useToast();

  const [generalEvaluations, setGeneralEvaluations] = useState<
    GeneralEvaluationWithIncludes[]
  >(agent?.generalEvaluations ?? []);
  useEffect(() => {
    setGeneralEvaluations(agent?.generalEvaluations ?? []);
  }, [agent?.generalEvaluations]);

  const {
    mutate: updateGeneralEvaluations,
    isPending: isUpdatingGeneralEvaluations,
  } = api.eval.updateGeneralEvaluations.useMutation({
    onSuccess: (updatedGeneralEvaluations) => {
      setAgent((prev) =>
        prev
          ? { ...prev, generalEvaluations: updatedGeneralEvaluations }
          : null,
      );
      toast({
        title: "general evaluations updated",
      });
    },
    onError: (error) => {
      toast({
        title: "error updating general evaluations",
        description: "please try again later",
      });
      console.error(error);
    },
  });

  const handleAddEvaluation = useCallback(
    (template: EvaluationTemplate) => {
      setGeneralEvaluations((prev) => [
        ...prev,
        instantiateGeneralEvaluation({
          agentId: agentId as string,
          evaluation: instantiateEvaluation({ evaluationTemplate: template }),
        }),
      ]);
    },
    [agentId],
  );
  const handleUpdateEvaluation = useCallback(
    (evaluationId: string, evaluation: EvaluationWithIncludes) => {
      setGeneralEvaluations((prev) =>
        prev.map((e) =>
          e.evaluationId === evaluationId ? { ...e, evaluation } : e,
        ),
      );
    },
    [],
  );
  const handleDeleteEvaluation = useCallback((evaluationId: string) => {
    setGeneralEvaluations((prev) => prev.filter((e) => e.id !== evaluationId));
  }, []);

  const handleCancel = useCallback(() => {
    setGeneralEvaluations(agent?.generalEvaluations ?? []);
    onOpenChange(false);
  }, [agent?.generalEvaluations, onOpenChange]);
  const handleSave = useCallback(() => {
    updateGeneralEvaluations({
      agentId: agentId as string,
      generalEvaluations: generalEvaluations,
    });
    onOpenChange(false);
  }, [generalEvaluations, agentId, updateGeneralEvaluations, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>general evaluations</DialogTitle>
        </DialogHeader>
        <EvaluationTabSection
          evaluations={generalEvaluations.map((e) => e.evaluation)}
          onAddEvaluation={handleAddEvaluation}
          onUpdateEvaluation={handleUpdateEvaluation}
          onDeleteEvaluation={handleDeleteEvaluation}
        />
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isUpdatingGeneralEvaluations}
          >
            cancel
          </Button>
          <Button onClick={handleSave} disabled={isUpdatingGeneralEvaluations}>
            {isUpdatingGeneralEvaluations ? <Spinner /> : "save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
