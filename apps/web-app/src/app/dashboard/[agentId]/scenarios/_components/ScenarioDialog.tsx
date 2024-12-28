import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { TrashIcon } from "@heroicons/react/24/solid";
import {
  EvalContentType,
  EvalResultType,
  EvalType,
  type EvaluationTemplate,
  type Scenario,
} from "../new-types";
import { AdditionalContextSection } from "./AdditionalContextSection";
import { EvaluationTabSection } from "./EvaluationTabSection";
import { EvaluationTemplateDialog } from "./EvaluationTemplateDialog";
import { useCallback, useState } from "react";
import { EditableText } from "~/components/EditableText";
import { useScenario } from "./ScenarioContext";

interface ScenarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (scenario: Scenario) => void;
}

export function ScenarioDialog({
  open,
  onOpenChange,
  onSave,
}: ScenarioDialogProps) {
  const { scenario, setScenario } = useScenario();

  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<
    EvaluationTemplate | undefined
  >(undefined);

  const handleOpenTemplateDialog = useCallback(
    (template?: EvaluationTemplate) => {
      setSelectedTemplate(template);
      setTemplateDialogOpen(true);
    },
    [],
  );

  const handleCreateNewTemplate = useCallback((name: string) => {
    setSelectedTemplate({
      id: "new",
      name,
      description: "",
      isCritical: false,
      createdAt: new Date(),
      params: [],
      type: EvalType.scenario,
      resultType: EvalResultType.boolean,
      contentType: EvalContentType.content,
      toolCallExpectedResult: "",
      deleted: false,
    });
    setTemplateDialogOpen(true);
  }, []);

  if (!scenario) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col gap-0 p-0">
        <div className="p-6">
          <EditableText
            placeholder="name this scenario..."
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
                value={scenario.instructions}
                onChange={(e) => {
                  setScenario((prev) =>
                    prev
                      ? { ...prev, instructions: e.target.value }
                      : undefined,
                  );
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
                  onEditTemplate={handleOpenTemplateDialog}
                  onCreateNewTemplate={handleCreateNewTemplate}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t p-6 pt-4">
          <div className="flex w-full justify-between gap-2">
            <Button variant="ghost" size="icon">
              <TrashIcon className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                cancel
              </Button>
              <Button onClick={() => onSave?.(scenario)}>save</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
      <EvaluationTemplateDialog
        isOpen={templateDialogOpen}
        template={selectedTemplate}
        onOpenChange={setTemplateDialogOpen}
      />
    </Dialog>
  );
}
