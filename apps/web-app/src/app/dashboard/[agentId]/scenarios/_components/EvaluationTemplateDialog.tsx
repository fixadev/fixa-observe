import { Label } from "~/components/ui/label";
import { type EvaluationTemplate } from "../new-types";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { InformationCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { EditableText } from "~/components/EditableText";

interface EvaluationTemplateDialogProps {
  isOpen: boolean;
  template?: EvaluationTemplate;
  onOpenChange: (open: boolean) => void;
}

export function EvaluationTemplateDialog({
  isOpen,
  template,
  onOpenChange,
}: EvaluationTemplateDialogProps) {
  const [description, setDescription] = useState(template?.description ?? "");

  useEffect(() => {
    setDescription(template?.description ?? "");
  }, [template]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[600px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="space-y-6">
          {/* Tag section */}
          <EditableText
            placeholder="enter name..."
            value={template?.name ?? ""}
            onValueChange={(value) => {
              console.log("value", value);
            }}
            className="inline-block rounded-md bg-muted text-sm"
          />

          {/* Success criteria section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>success criteria</Label>
              <Tooltip>
                <TooltipTrigger>
                  <InformationCircleIcon className="size-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[400px]">
                  the system prompt passed to the evaluator when evaluating this
                  evaluation. try to be as thorough as possible. use brackets to
                  denote template variables, i.e. {`{{`} templateVariable {`}}`}
                </TooltipContent>
              </Tooltip>
            </div>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[200px] w-full rounded-lg border p-4"
              placeholder="the agent confirmed the caller's order of {{customerOrder}}"
            />
          </div>

          {/* Button section */}
          <div className="flex items-center justify-between pt-4">
            <Button variant="ghost" size="icon">
              <TrashIcon className="size-4" />
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                cancel
              </Button>
              <Button>save</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
