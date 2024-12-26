import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { TrashIcon } from "@heroicons/react/24/solid";
import {
  type EvaluationTemplate,
  type Scenario,
  sampleEvaluationTemplates,
} from "../new-types";
import { AdditionalContextSection } from "./AdditionalContextSection";
import { EvaluationTabSection } from "./EvaluationTabSection";
import { EvaluationTemplateDialog } from "./EvaluationTemplateDialog";
import { useState } from "react";
import { EditableText } from "~/components/EditableText";

interface ScenarioDialogProps {
  scenario: Scenario;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (scenario: Scenario) => void;
}

export function ScenarioDialog({
  scenario,
  open,
  onOpenChange,
  onSave,
}: ScenarioDialogProps) {
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<
    EvaluationTemplate | undefined
  >(undefined);

  const handleOpenTemplateDialog = (template?: EvaluationTemplate) => {
    setSelectedTemplate(template);
    setTemplateDialogOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col gap-0 p-0">
        <div className="p-6">
          <EditableText
            placeholder="name this scenario..."
            value={scenario.name}
            onValueChange={(value) => {
              console.log("value", value);
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
                  // You'll need to implement the onChange handler
                  // to update the scenario instructions
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
