import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { TrashIcon } from "@heroicons/react/24/solid";
import { AdditionalContextSection } from "./AdditionalContextSection";
import { useCallback, useMemo, useState } from "react";
import { EditableText } from "~/components/EditableText";
import { useScenario } from "./ScenarioContext";
import {
  type EvaluationWithIncludes,
  type EvaluationTemplate,
} from "@repo/types/src";
import {
  instantiateEvaluation,
  instantiateEvaluationTemplate,
} from "~/lib/instantiate";
import { api } from "~/trpc/react";
import Spinner from "~/components/Spinner";
import { useAgent } from "~/app/contexts/UseAgent";
import { useParams } from "next/navigation";
import { isTempId } from "~/lib/utils";
import { useToast } from "~/components/hooks/use-toast";
import { EvaluationTabSection } from "~/components/evaluations/EvaluationTabSection";
import { EvaluationTemplateDialog } from "~/components/evaluations/EvaluationTemplateDialog";

interface ScenarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScenarioDialog({ open, onOpenChange }: ScenarioDialogProps) {
  const { agentId } = useParams();
  const { setAgent } = useAgent(agentId as string);
  const { scenario, setScenario } = useScenario();
  const { toast } = useToast();

  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<
    EvaluationTemplate | undefined
  >(undefined);

  const { mutate: createScenario, isPending: isCreatingScenario } =
    api.scenario.create.useMutation({
      onSuccess: (createdScenario) => {
        setAgent((prev) =>
          prev
            ? {
                ...prev,
                scenarios: [...prev.scenarios, createdScenario],
              }
            : prev,
        );
        onOpenChange(false);
      },
      onError: () => {
        toast({
          title: "error creating scenario",
          description: "please try again later",
          variant: "destructive",
        });
      },
    });
  const { mutate: updateScenario, isPending: isUpdatingScenario } =
    api.scenario.update.useMutation({
      onSuccess: (updatedScenario) => {
        setAgent((prev) =>
          prev
            ? {
                ...prev,
                scenarios: prev.scenarios.map((s) =>
                  s.id === updatedScenario.id ? updatedScenario : s,
                ),
              }
            : prev,
        );
        onOpenChange(false);
      },
      onError: () => {
        toast({
          title: "error updating scenario",
          description: "please try again later",
          variant: "destructive",
        });
      },
    });
  const { mutate: deleteScenario, isPending: isDeletingScenario } =
    api.scenario.delete.useMutation({
      onSuccess: () => {
        setAgent((prev) =>
          prev
            ? {
                ...prev,
                scenarios: prev.scenarios.filter((s) => s.id !== scenario?.id),
              }
            : prev,
        );
        onOpenChange(false);
      },
      onError: () => {
        toast({
          title: "error deleting scenario",
          description: "please try again later",
          variant: "destructive",
        });
      },
    });

  const isSaving = useMemo(
    () => isCreatingScenario || isUpdatingScenario,
    [isCreatingScenario, isUpdatingScenario],
  );

  const handleOpenTemplateDialog = useCallback(
    (template?: EvaluationTemplate) => {
      setSelectedTemplate(template);
      setTemplateDialogOpen(true);
    },
    [],
  );

  const handleCreateNewTemplate = useCallback((name: string) => {
    setSelectedTemplate(instantiateEvaluationTemplate({ name }));
    setTemplateDialogOpen(true);
  }, []);

  const handleUpdateTemplate = useCallback(
    (template: EvaluationTemplate) => {
      setScenario((prev) =>
        prev
          ? {
              ...prev,
              evaluations: prev.evaluations.map((e) =>
                e.evaluationTemplate.id === template.id
                  ? { ...e, evaluationTemplate: template }
                  : e,
              ),
            }
          : prev,
      );
    },
    [setScenario],
  );

  const handleAddEvaluation = useCallback(
    (template: EvaluationTemplate) => {
      const evaluation = instantiateEvaluation({
        evaluationTemplateId: template.id,
        evaluationTemplate: template,
        scenarioId: scenario?.id,
      });

      setScenario((prev) =>
        prev
          ? { ...prev, evaluations: [...prev.evaluations, evaluation] }
          : prev,
      );
    },
    [scenario?.id, setScenario],
  );
  const handleUpdateEvaluation = useCallback(
    (evaluationId: string, evaluation: EvaluationWithIncludes) => {
      setScenario((prev) =>
        prev
          ? {
              ...prev,
              evaluations: prev.evaluations.map((e) =>
                e.id === evaluationId ? evaluation : e,
              ),
            }
          : prev,
      );
    },
    [setScenario],
  );
  const handleRemoveEvaluation = useCallback(
    (evaluationId: string) => {
      setScenario((prev) =>
        prev
          ? {
              ...prev,
              evaluations: prev.evaluations.filter(
                (e) => e.id !== evaluationId,
              ),
            }
          : prev,
      );
    },
    [setScenario],
  );

  const handleSave = useCallback(() => {
    if (!scenario) {
      return;
    }

    if (isTempId(scenario.id)) {
      createScenario({ agentId: agentId as string, scenario });
    } else {
      updateScenario(scenario);
    }
  }, [scenario, createScenario, agentId, updateScenario]);

  const handleDelete = useCallback(() => {
    if (!scenario?.id) {
      return;
    }

    deleteScenario({ id: scenario.id });
  }, [scenario?.id, deleteScenario]);

  if (!scenario) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[90vh] max-w-2xl flex-col gap-0 p-0"
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <div className="p-6">
          <EditableText
            placeholder="name this scenario..."
            initialEditing={!scenario.name}
            value={scenario.name}
            onValueChange={(value) => {
              setScenario((prev) =>
                prev ? { ...prev, name: value } : undefined,
              );
            }}
            className="inline-block rounded-md bg-muted text-sm font-medium"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-2">
          <div className="space-y-6">
            {/* Test Persona Instructions */}
            <div className="space-y-2">
              <div>
                <Label>test persona instructions</Label>
                <div className="text-sm text-muted-foreground">
                  this will be used as the system prompt for our test persona
                  when it calls your agent
                </div>
              </div>
              <Textarea
                placeholder="order a dozen donuts with sprinkles and a coffee"
                value={scenario.instructions}
                onChange={(e) => {
                  setScenario((prev) =>
                    prev
                      ? { ...prev, instructions: e.target.value }
                      : undefined,
                  );
                }}
                onFocus={(e) => {
                  // Go to the end of the text when focused
                  const length = e.target.value.length;
                  e.target.setSelectionRange(length, length);
                }}
                className="min-h-[100px]"
              />
            </div>

            <AdditionalContextSection />

            {/* Evaluations Section */}
            <div className="space-y-2">
              <div>
                <Label>evaluations</Label>
                <div className="text-sm text-muted-foreground">
                  the criteria on which the conversation will be evaluated on
                </div>
              </div>
              <div>
                <EvaluationTabSection
                  evaluations={scenario.evaluations}
                  onUpdateEvaluation={handleUpdateEvaluation}
                  onDeleteEvaluation={handleRemoveEvaluation}
                  onEditTemplate={handleOpenTemplateDialog}
                  onCreateNewTemplate={handleCreateNewTemplate}
                  onAddEvaluation={handleAddEvaluation}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t p-6 pt-4">
          <div className="flex w-full justify-between gap-2">
            {!isTempId(scenario.id) ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={isDeletingScenario}
              >
                {isDeletingScenario ? (
                  <Spinner />
                ) : (
                  <TrashIcon className="h-4 w-4" />
                )}
              </Button>
            ) : (
              <div className="flex-1" />
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Spinner /> : "save"}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
      <EvaluationTemplateDialog
        template={selectedTemplate}
        open={templateDialogOpen}
        onOpenChange={setTemplateDialogOpen}
        onCreateTemplate={handleAddEvaluation}
        onUpdateTemplate={handleUpdateTemplate}
      />
    </Dialog>
  );
}
