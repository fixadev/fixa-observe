"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "~/components/ui/label";
import { InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { cn, getTemplateVariableRanges } from "~/lib/utils";
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

  // When evaluation is added, set the active tab to the new evaluation
  useEffect(() => {
    if (scenario?.evaluations?.length) {
      setActiveTab(scenario.evaluations[scenario.evaluations.length - 1]?.id);
    }
  }, [scenario?.evaluations]);

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
                  <EvaluationDescription
                    description={evaluation.evaluationTemplate?.description}
                    evaluationId={evaluation.id}
                  />

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

function EvaluationDescription({
  description,
  evaluationId,
}: {
  description: string;
  evaluationId: string;
}) {
  const { scenario, setScenario } = useScenario();
  const templateVariables = getTemplateVariableRanges(description);
  const initialParams = useMemo(() => {
    return (
      scenario?.evaluations.find((e) => e.id === evaluationId)?.params ?? {}
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const segments: React.ReactNode[] = [];
  let lastIndex = 0;

  templateVariables.forEach(({ templateVariable, start, end }) => {
    if (start > lastIndex) {
      segments.push(description.slice(lastIndex, start));
    }

    segments.push(
      <span
        key={start}
        contentEditable
        suppressContentEditableWarning
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        onInput={(e) => {
          const newValue = e.currentTarget.textContent ?? "";
          setScenario((prev) =>
            prev
              ? {
                  ...prev,
                  evaluations: prev.evaluations.map((e) =>
                    e.id === evaluationId
                      ? {
                          ...e,
                          params: {
                            ...e.params,
                            [templateVariable]: newValue,
                          },
                        }
                      : e,
                  ),
                }
              : prev,
          );
        }}
        className="mx-1 my-0.5 inline-block cursor-text rounded bg-muted p-2 font-mono text-xs empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]"
        data-placeholder={`{{ ${templateVariable} }}`}
      >
        {initialParams[templateVariable]}
      </span>,
    );

    lastIndex = end;
  });

  if (lastIndex < description.length) {
    segments.push(description.slice(lastIndex));
  }

  return <div className="h-[100px] overflow-y-auto text-sm">{segments}</div>;
}
