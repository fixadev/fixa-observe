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
import { isTempId } from "~/lib/utils";
import { getTemplateVariableRanges } from "@repo/services/src/utils";
import { api } from "~/trpc/react";
import Spinner from "~/components/Spinner";
import { useToast } from "~/components/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { AlertDialogTrigger } from "~/components/ui/alert-dialog";

interface EvaluationTemplateDialogProps {
  open: boolean;
  template?: EvaluationTemplate;
  onOpenChange: (open: boolean) => void;
  onCreateTemplate: (template: EvaluationTemplate) => void;
  onUpdateTemplate: (template: EvaluationTemplate) => void;
  onDeleteTemplate: (id: string) => void;
}

export function EvaluationTemplateDialog({
  open,
  template: _template,
  onOpenChange,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
}: EvaluationTemplateDialogProps) {
  const { toast } = useToast();

  const utils = api.useUtils();

  // Local template
  const [template, setTemplate] = useState(_template);
  useEffect(() => {
    setTemplate(_template);
  }, [_template]);

  const { mutate: createTemplate, isPending: isCreatingTemplate } =
    api.evaluation.createTemplate.useMutation({
      onSuccess: (template) => {
        onOpenChange(false);
        onCreateTemplate(template);
        void utils.evaluation.getTemplates.invalidate();
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
    api.evaluation.updateTemplate.useMutation({
      onSuccess: () => {
        onOpenChange(false);
        if (template) {
          onUpdateTemplate(template);
        }
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
  const { mutate: deleteTemplate, isPending: isDeletingTemplate } =
    api.evaluation.deleteTemplate.useMutation({
      onSuccess: (id) => {
        onDeleteTemplate(id);
      },
      onError: (error) => {
        toast({
          title: "failed to delete template",
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
    if (!template) return;
    const templateVariables = getTemplateVariableRanges(
      template.description,
    ).map((range) => range.templateVariable);

    console.log(template);
    if (isTempId(template.id)) {
      createTemplate({ ...template, params: templateVariables });
    } else {
      updateTemplate({ ...template, params: templateVariables });
    }
  }, [template, createTemplate, updateTemplate]);

  if (!template) return null;

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
            value={template.name}
            onValueChange={(value) =>
              setTemplate((prev) =>
                prev ? { ...prev, name: value } : undefined,
              )
            }
            initialEditing={!template.name}
            className="inline-block rounded-md bg-muted text-sm"
          />

          {/* Success criteria section */}
          <div className="space-y-2">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Label>success criteria</Label>
                <Tooltip>
                  <TooltipTrigger tabIndex={-1}>
                    <InformationCircleIcon className="size-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[400px]">
                    the system prompt passed to the evaluator when evaluating
                    this evaluation. try to be as thorough as possible.
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="text-sm text-muted-foreground">
                use brackets to denote template variables, i.e. {`{{`}{" "}
                templateVariable {`}}`}
              </div>
            </div>
            <Textarea
              tabIndex={0}
              value={template.description}
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

          {!isTempId(template.id) && (
            <div className="text-sm text-muted-foreground">
              note: editing this evaluation template will edit it in all the
              places that it is used.
            </div>
          )}

          {/* Button section */}
          <div className="flex items-center justify-between pt-4">
            {isTempId(template.id) ? (
              <div className="flex-1" />
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <TrashIcon className="size-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      this action cannot be undone. this will permanently delete
                      this template.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteTemplate({ id: template.id })}
                      disabled={isDeletingTemplate}
                    >
                      {isDeletingTemplate ? <Spinner /> : "delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
