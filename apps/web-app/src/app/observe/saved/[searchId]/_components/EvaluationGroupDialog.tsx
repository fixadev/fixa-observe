"use client";
import { Dialog, DialogContent, DialogFooter } from "~/components/ui/dialog";
import {
  type EvaluationGroupWithIncludes,
  type EvaluationTemplate,
  type EvaluationWithIncludes,
} from "@repo/types/src/index";
import { useCallback, useEffect, useState } from "react";
import {
  instantiateEvaluation,
  instantiateEvaluationGroup,
} from "@repo/utils/src/instantiate";
import { cn, isTempId } from "~/lib/utils";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import Spinner from "~/components/Spinner";
import { TrashIcon } from "@heroicons/react/24/solid";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { EditableText } from "~/components/EditableText";
import { CardHeader, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { EvaluationTabSection } from "~/components/evaluations/EvaluationTabSection";
import { useObserveState } from "~/components/hooks/useObserveState";

export function EvaluationGroupDialog({
  open,
  setOpen,
  savedSearchId,
  selectedEvaluationGroup,
  voidSelectedEvaluationGroup,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  savedSearchId: string;
  selectedEvaluationGroup: EvaluationGroupWithIncludes | null;
  voidSelectedEvaluationGroup: () => void;
}) {
  const { setSavedSearch } = useObserveState();
  const [evaluationGroup, setEvaluationGroup] =
    useState<EvaluationGroupWithIncludes>(
      selectedEvaluationGroup ?? instantiateEvaluationGroup({ savedSearchId }),
    );

  useEffect(() => {
    if (selectedEvaluationGroup) {
      setEvaluationGroup(selectedEvaluationGroup);
    }
  }, [selectedEvaluationGroup]);

  const { mutate: createEvaluationGroup, isPending: isCreating } =
    api.evaluation.createGroup.useMutation({
      onSuccess: (data) => {
        setSavedSearch((prev) =>
          prev
            ? {
                ...prev,
                evaluationGroups: prev.evaluationGroups
                  ? [...prev.evaluationGroups, data]
                  : [data],
              }
            : prev,
        );
        voidSelectedEvaluationGroup();
        setOpen(false);
      },
    });

  const { mutate: updateEvaluationGroup, isPending: isUpdating } =
    api.evaluation.updateGroup.useMutation({
      onSuccess: (data) => {
        setSavedSearch((prev) =>
          prev
            ? {
                ...prev,
                evaluationGroups: prev.evaluationGroups?.map((es) =>
                  es.id === data.id ? data : es,
                ),
              }
            : prev,
        );
        voidSelectedEvaluationGroup();
        setOpen(false);
      },
    });

  const { mutate: deleteEvaluationGroup, isPending: isDeleting } =
    api.evaluation.deleteGroup.useMutation({
      onSuccess: () => {
        setSavedSearch((prev) =>
          prev
            ? {
                ...prev,
                evaluationGroups: prev.evaluationGroups?.filter(
                  (es) => es.id !== evaluationGroup.id,
                ),
              }
            : prev,
        );
        voidSelectedEvaluationGroup();
        setOpen(false);
      },
    });

  const handleSubmit = useCallback(() => {
    if (isTempId(evaluationGroup.id)) {
      createEvaluationGroup(evaluationGroup);
    } else {
      updateEvaluationGroup(evaluationGroup);
    }
  }, [evaluationGroup, createEvaluationGroup, updateEvaluationGroup]);

  const handleAddEvaluation = useCallback(
    (template: EvaluationTemplate) => {
      const evaluation = instantiateEvaluation({
        evaluationTemplateId: template.id,
        evaluationTemplate: template,
        evaluationGroupId: evaluationGroup.id,
      });

      setEvaluationGroup((prev) => ({
        ...prev,
        evaluations: [...prev.evaluations, evaluation],
      }));
    },
    [evaluationGroup.id],
  );

  const handleUpdateEvaluation = useCallback(
    (evaluationId: string, evaluation: EvaluationWithIncludes) => {
      setEvaluationGroup((prev) => ({
        ...prev,
        evaluations: prev.evaluations.map((e) =>
          e.id === evaluationId ? evaluation : e,
        ),
      }));
    },
    [],
  );

  const handleDeleteEvaluation = useCallback((evaluationId: string) => {
    setEvaluationGroup((prev) => ({
      ...prev,
      evaluations: prev.evaluations.filter((e) => e.id !== evaluationId),
    }));
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex min-h-[400px] min-w-[600px] flex-col">
        <div
          className={cn(
            "p-0 text-sm transition-opacity",
            !evaluationGroup.enabled && "opacity-60",
          )}
        >
          <CardHeader className="flex flex-col gap-2 px-0 py-2">
            <div className="flex items-center gap-1">
              <EditableText
                value={evaluationGroup.name}
                onValueChange={(value) =>
                  setEvaluationGroup({ ...evaluationGroup, name: value })
                }
                initialEditing={isTempId(evaluationGroup.id)}
                className="text-base font-medium"
                inputClassName="text-base"
                placeholder="enter evaluation group name..."
                inputPlaceholder={`appointment booking`}
              />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 p-0">
            <div className="text-xs font-medium text-muted-foreground">IF</div>
            <Input
              className="text-muted-foreground"
              value={evaluationGroup.condition}
              onChange={(e) =>
                setEvaluationGroup({
                  ...evaluationGroup,
                  condition: e.target.value,
                })
              }
              placeholder="user asks to book appointment"
            />
            <div className="text-xs font-medium text-muted-foreground">
              THEN
            </div>
            <EvaluationTabSection
              evaluations={evaluationGroup.evaluations}
              onAddEvaluation={handleAddEvaluation}
              onUpdateEvaluation={handleUpdateEvaluation}
              onDeleteEvaluation={handleDeleteEvaluation}
            />
          </CardContent>
        </div>

        <DialogFooter className="mt-auto">
          <div className="flex w-full justify-between">
            {!isTempId(evaluationGroup.id) ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isCreating || isUpdating || isDeleting}
                  >
                    {isDeleting ? (
                      <Spinner />
                    ) : (
                      <TrashIcon className="size-4" />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      this will permanently delete this evaluation.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        deleteEvaluationGroup({ id: evaluationGroup.id })
                      }
                    >
                      delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <div />
            )}
            <Button
              onClick={handleSubmit}
              disabled={isCreating || isUpdating || isDeleting}
            >
              {isCreating || isUpdating ? <Spinner /> : "save"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
