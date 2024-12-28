import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "~/components/ui/label";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { cn } from "~/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { EvaluationTemplateCombobox } from "./EvaluationTemplateCombobox";
import { useScenario } from "./ScenarioContext";
import { type EvaluationTemplate } from "@repo/types/src";

interface EvaluationTabSectionProps {
  onEditTemplate: (template?: EvaluationTemplate) => void;
  onCreateNewTemplate: (name: string) => void;
}

export function EvaluationTabSection({
  onEditTemplate,
  onCreateNewTemplate,
}: EvaluationTabSectionProps) {
  const { scenario, setScenario } = useScenario();
  const [activeTab, setActiveTab] = useState(scenario?.evaluations?.[0]?.id);

  if (!scenario) {
    return null;
  }

  if (!scenario.evaluations?.length) {
    return <div>no evaluations added yet.</div>;
  }

  return (
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
            </Button>
          ))}
          <EvaluationTemplateCombobox
            onSelect={(templateId) => {
              // TODO: Implement adding evaluation
              console.log("Selected template:", templateId);
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
  );
}
