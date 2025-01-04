"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
import {
  type EvaluationWithIncludes,
  type EvaluationTemplate,
} from "@repo/types/src";
import { EvaluationDescription } from "./EvaluationDescription";
import { EvaluationTemplateDialog } from "./EvaluationTemplateDialog";
import { instantiateEvaluationTemplate } from "~/lib/instantiate";

interface EvaluationTabSectionProps {
  evaluations: EvaluationWithIncludes[];
  onAddEvaluation: (template: EvaluationTemplate) => void;
  onUpdateEvaluation: (
    evaluationId: string,
    evaluation: EvaluationWithIncludes,
  ) => void;
  onDeleteEvaluation: (evaluationId: string) => void;
}

export function EvaluationTabSection({
  evaluations,
  onAddEvaluation,
  onUpdateEvaluation,
  onDeleteEvaluation,
}: EvaluationTabSectionProps) {
  const [activeTab, setActiveTab] = useState(evaluations?.[0]?.id);
  const [selectedTemplate, setSelectedTemplate] = useState<
    EvaluationTemplate | undefined
  >(undefined);

  const handleUpdateTemplate = useCallback(
    (template: EvaluationTemplate) => {
      // Update all evaluations that use this template
      evaluations.forEach((evaluation) => {
        if (evaluation.evaluationTemplate.id === template.id) {
          onUpdateEvaluation(evaluation.id, {
            ...evaluation,
            evaluationTemplate: template,
          });
        }
      });
      setSelectedTemplate(undefined);
    },
    [evaluations, onUpdateEvaluation],
  );

  const handleDeleteTemplate = useCallback(
    (templateId: string) => {
      // Remove all evaluations that use this template
      evaluations
        .filter((e) => e.evaluationTemplate.id === templateId)
        .forEach((e) => onDeleteEvaluation(e.id));
      setSelectedTemplate(undefined);
    },
    [evaluations, onDeleteEvaluation],
  );

  // When evaluation is added, set the active tab to the new evaluation
  const oldLength = useRef(evaluations.length);
  useEffect(() => {
    if (oldLength.current !== evaluations.length) {
      setActiveTab(evaluations[evaluations.length - 1]?.id);
      oldLength.current = evaluations.length;
    }
  }, [evaluations]);

  return (
    <div className="flex w-full flex-col">
      {/* Custom Tab List */}
      <div className="mb-2 flex overflow-x-auto pb-2">
        <div className="flex flex-nowrap gap-2">
          {evaluations.map((evaluation) => (
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
                  onDeleteEvaluation(evaluation.id);
                }}
              >
                <XMarkIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            </Button>
          ))}
          <EvaluationTemplateCombobox
            templatesToExclude={evaluations.map((e) => e.evaluationTemplate)}
            onSelect={onAddEvaluation}
            onCreateNew={(name) =>
              setSelectedTemplate(instantiateEvaluationTemplate({ name }))
            }
          />
        </div>
      </div>

      {/* Tab Content */}
      {evaluations.map(
        (evaluation) =>
          activeTab === evaluation.id && (
            <div key={evaluation.id}>
              <Card className="space-y-4 p-4">
                <EvaluationDescription
                  description={evaluation.evaluationTemplate?.description}
                  initialParams={evaluation.params}
                  onParamUpdate={(templateVariable, newValue) => {
                    onUpdateEvaluation(evaluation.id, {
                      ...evaluation,
                      params: {
                        ...evaluation.params,
                        [templateVariable]: newValue,
                      },
                    });
                  }}
                />

                <div className="flex justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`is-critical-${evaluation.id}`}
                      checked={evaluation.isCritical}
                      onCheckedChange={(checked) => {
                        onUpdateEvaluation(evaluation.id, {
                          ...evaluation,
                          isCritical: checked,
                        });
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
                      setSelectedTemplate(evaluation.evaluationTemplate)
                    }
                  >
                    edit template
                  </Button>
                </div>
              </Card>
            </div>
          ),
      )}

      <EvaluationTemplateDialog
        template={selectedTemplate}
        open={!!selectedTemplate}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTemplate(undefined);
          }
        }}
        onCreateTemplate={onAddEvaluation}
        onUpdateTemplate={handleUpdateTemplate}
        onDeleteTemplate={handleDeleteTemplate}
      />
    </div>
  );
}
