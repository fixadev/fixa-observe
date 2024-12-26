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
import { type Scenario, type EvaluationTemplate } from "../new-types";
import { EvaluationTemplateCombobox } from "./EvaluationTemplateCombobox";

interface EvaluationTabSectionProps {
  evaluations: Scenario["evaluations"];
  onEditTemplate: (template?: EvaluationTemplate) => void;
  onCreateNewTemplate: (name: string) => void;
}

export function EvaluationTabSection({
  evaluations,
  onEditTemplate,
  onCreateNewTemplate,
}: EvaluationTabSectionProps) {
  const [activeTab, setActiveTab] = useState(evaluations?.[0]?.id);

  if (!evaluations?.length) {
    return <div>no evaluations available</div>;
  }

  return (
    <div className="w-full">
      {/* Custom Tab List */}
      <div className="flex overflow-x-auto pb-4">
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
      {evaluations.map(
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
                      checked={evaluation.evaluationTemplate?.isCritical}
                      onCheckedChange={(checked) => {
                        // Handle switch change
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
