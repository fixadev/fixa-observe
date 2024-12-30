"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "~/components/ui/label";
import { InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { cn } from "~/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { EvaluationTemplateCombobox } from "./EvaluationTemplateCombobox";
import { useScenario } from "./ScenarioContext";
import {
  type EvaluationWithIncludes,
  type EvaluationTemplate,
} from "@repo/types/src";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface EvaluationTabSectionProps {
  onEditTemplate: (template?: EvaluationTemplate) => void;
  onCreateNewTemplate: (name: string) => void;
  onAddEvaluation: (template: EvaluationTemplate) => void;
}

export function EvaluationTabSection({
  onEditTemplate,
  onCreateNewTemplate,
  onAddEvaluation,
}: EvaluationTabSectionProps) {
  const { scenario, setScenario } = useScenario();
  const [activeTab, setActiveTab] = useState(scenario?.evaluations?.[0]?.id);
  const [evaluationToRemove, setEvaluationToRemove] =
    useState<EvaluationWithIncludes | null>(null);

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
      setEvaluationToRemove(null);
    },
    [setScenario],
  );

  if (!scenario) {
    return null;
  }

  if (!scenario.evaluations?.length) {
    return <div>no evaluations added yet.</div>;
  }

  return (
    <>
      <div className="w-full">
        {/* Custom Tab List */}
        <div className="flex overflow-x-auto pb-4">
          <div className="flex flex-nowrap gap-2">
            {scenario.evaluations.map((evaluation) => (
              <Button
                key={evaluation.id}
                onClick={() => setActiveTab(evaluation.id)}
                variant="outline"
                size="sm"
                className={cn(
                  "group flex flex-shrink-0 items-center gap-2",
                  activeTab === evaluation.id && "bg-muted",
                )}
              >
                {evaluation.evaluationTemplate?.name}
                <div
                  className="-mr-2 rounded-full p-0.5 hover:bg-gray-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEvaluationToRemove(evaluation);
                  }}
                >
                  <XMarkIcon className="h-4 w-4 text-muted-foreground" />
                </div>
              </Button>
            ))}
            <EvaluationTemplateCombobox
              onSelect={(template) => {
                onAddEvaluation(template);
              }}
              onCreateNew={onCreateNewTemplate}
            />
          </div>
        </div>

        {/* Tab Content */}
        {scenario.evaluations.map(
          (evaluation) =>
            activeTab === evaluation.id && (
              <div key={evaluation.id}>
                <Card className="space-y-4 p-4">
                  <div className="h-[100px] overflow-y-auto text-sm">
                    {evaluation.evaluationTemplate?.description}
                  </div>

                  <div className="flex justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`is-critical-${evaluation.id}`}
                        checked={evaluation.isCritical}
                        onCheckedChange={(checked) => {
                          setScenario((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  evaluations: prev.evaluations.map((e) =>
                                    e.id === evaluation.id
                                      ? { ...e, isCritical: checked }
                                      : e,
                                  ),
                                }
                              : prev,
                          );
                        }}
                      />
                      <Label htmlFor={`is-critical-${evaluation.id}`}>
                        is critical
                      </Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <InformationCircleIcon className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          if this evaluation fails, the call will be marked as
                          failed
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() =>
                        onEditTemplate(evaluation.evaluationTemplate)
                      }
                    >
                      edit template
                    </Button>
                  </div>
                </Card>
              </div>
            ),
        )}
      </div>
      <AlertDialog
        open={!!evaluationToRemove}
        onOpenChange={() => setEvaluationToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              remove &ldquo;{evaluationToRemove?.evaluationTemplate?.name}
              &rdquo;
            </AlertDialogTitle>
            <AlertDialogDescription>
              are you sure you want to remove this evaluation? this action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                evaluationToRemove &&
                handleRemoveEvaluation(evaluationToRemove.id)
              }
            >
              remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
