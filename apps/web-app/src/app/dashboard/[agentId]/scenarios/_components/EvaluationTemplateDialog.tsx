"use client";

import { Label } from "~/components/ui/label";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { InformationCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { EditableText } from "~/components/EditableText";
import { type EvaluationTemplate } from "@repo/types/src";
import { getTemplateVariableRanges, isTempId } from "~/lib/utils";
import { api } from "~/trpc/react";
import Spinner from "~/components/Spinner";
import { useToast } from "~/components/hooks/use-toast";
import { useScenario } from "./ScenarioContext";

interface EvaluationTemplateDialogProps {
  open: boolean;
  template?: EvaluationTemplate;
  onOpenChange: (open: boolean) => void;
  onCreateTemplate: (template: EvaluationTemplate) => void;
}

export function EvaluationTemplateDialog({
  open,
  template,
  onOpenChange,
  onCreateTemplate,
}: EvaluationTemplateDialogProps) {
  const { toast } = useToast();
  const { setScenario } = useScenario();

  const utils = api.useUtils();

  // Local template
  const [_template, setTemplate] = useState(template);
  useEffect(() => {
    setTemplate(template);
  }, [template]);

  const { mutate: createTemplate, isPending: isCreatingTemplate } =
    api.eval.createTemplate.useMutation({
      onSuccess: (template) => {
        onOpenChange(false);
        onCreateTemplate(template);
        void utils.eval.getTemplates.invalidate();
      },
      onError: (error) => {
        toast({
          title: "failed to create template",
          description: "please try again later.",
          variant: "destructive",
        });
        console.error(error);
      },
    });
  const { mutate: updateTemplate, isPending: isUpdatingTemplate } =
    api.eval.updateTemplate.useMutation({
      onSuccess: () => {
        onOpenChange(false);
        setScenario((prev) =>
          prev
            ? {
                ...prev,
                evaluations: prev.evaluations.map((e) =>
                  e.evaluationTemplate.id === _template?.id
                    ? { ...e, evaluationTemplate: _template }
                    : e,
                ),
              }
            : undefined,
        );
      },
      onError: (error) => {
        toast({
          title: "failed to update template",
          description: "please try again later.",
          variant: "destructive",
        });
        console.error(error);
      },
    });
  const isSaving = useMemo(
    () => isCreatingTemplate || isUpdatingTemplate,
    [isCreatingTemplate, isUpdatingTemplate],
  );

  const handleSave = useCallback(() => {
    if (!_template) return;
    const templateVariables = getTemplateVariableRanges(
      _template.description,
    ).map((range) => range.templateVariable);

    if (isTempId(_template.id)) {
      createTemplate({ ..._template, params: templateVariables });
    } else {
      updateTemplate({ ..._template, params: templateVariables });
    }
  }, [_template, createTemplate, updateTemplate]);

  if (!_template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[600px]"
        // onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="space-y-6">
          {/* Tag section */}
          <EditableText
            placeholder="enter name..."
            value={_template.name}
            onValueChange={(value) =>
              setTemplate((prev) =>
                prev ? { ...prev, name: value } : undefined,
              )
            }
            className="inline-block rounded-md bg-muted text-sm"
          />

          {/* Success criteria section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>success criteria</Label>
              <Tooltip>
                <TooltipTrigger tabIndex={-1}>
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
              tabIndex={0}
              value={_template.description}
              onChange={(e) =>
                setTemplate((prev) =>
                  prev ? { ...prev, description: e.target.value } : undefined,
                )
              }
              onFocus={(e) => {
                // Go to the end of the text when focused
                const length = e.target.value.length;
                e.target.setSelectionRange(length, length);
              }}
              className="min-h-[200px] w-full rounded-lg border p-4"
              placeholder="the agent confirmed the caller's order of {{customerOrder}}"
            />
          </div>

          {!isTempId(_template.id) && (
            <div className="text-sm text-muted-foreground">
              note: editing this evaluation template will edit it in all the
              places that it is used.
            </div>
          )}

          {/* Button section */}
          <div className="flex items-center justify-between pt-4">
            {isTempId(_template.id) ? (
              <div className="flex-1" />
            ) : (
              <Button variant="ghost" size="icon">
                <TrashIcon className="size-4" />
              </Button>
            )}
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Spinner /> : "save"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
