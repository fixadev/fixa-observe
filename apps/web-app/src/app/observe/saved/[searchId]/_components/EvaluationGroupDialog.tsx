"use client";
import { Dialog, DialogContent, DialogFooter } from "~/components/ui/dialog";
import {
  type EvaluationGroupWithIncludes,
  type Filter,
} from "@repo/types/src/index";
import { useCallback, useEffect, useState } from "react";
import { instantiateEvaluationGroup } from "~/lib/instantiate";
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
import { CriteriaBlock } from "./CriteriaBlock";

export function EvaluationGroupDialog({
  open,
  setOpen,
  savedSearchId,
  selectedEvaluationGroup,
  voidSelectedEvaluationGroup,
  filter,
  setFilter,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  savedSearchId: string;
  selectedEvaluationGroup: EvaluationGroupWithIncludes | null;
  voidSelectedEvaluationGroup: () => void;
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
}) {
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
    api.eval.createGroup.useMutation({
      onSuccess: (data) => {
        setFilter({
          ...filter,
          evaluationGroups: filter.evaluationGroups
            ? [...filter.evaluationGroups, data]
            : [data],
        });
        voidSelectedEvaluationGroup();
        setOpen(false);
      },
    });

  const { mutate: updateEvaluationGroup, isPending: isUpdating } =
    api.eval.updateGroup.useMutation({
      onSuccess: (data) => {
        setFilter({
          ...filter,
          evaluationGroups: filter.evaluationGroups?.map((es) =>
            es.id === data.id ? data : es,
          ),
        });
        voidSelectedEvaluationGroup();
        setOpen(false);
      },
    });

  const { mutate: deleteEvaluationGroup, isPending: isDeleting } =
    api.eval.deleteGroup.useMutation({
      onSuccess: () => {
        setFilter({
          ...filter,
          evaluationGroups: filter.evaluationGroups?.filter(
            (es) => es.id !== evaluationGroup.id,
          ),
        });
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

  const addCriteria = useCallback(() => {
    setEvaluationGroup({
      ...evaluationGroup,
      evaluations: [
        ...evaluationGroup.evaluations,
        instantiateEvaluation({ evaluationGroupId: evaluationGroup.id }),
      ],
    });
  }, [evaluationGroup]);

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
            <div className="flex flex-col gap-2">
              {evaluationGroup.evaluations.map((criteria) => (
                <CriteriaBlock
                  key={criteria.id}
                  criteria={criteria}
                  onUpdate={(updated) => {
                    setEvaluationGroup({
                      ...evaluationGroup,
                      evaluations: evaluationGroup.evaluations.map((e) =>
                        e.id === updated.id ? updated : e,
                      ),
                    });
                  }}
                  onDelete={() => {
                    setEvaluationGroup({
                      ...evaluationGroup,
                      evaluations: evaluationGroup.evaluations.filter(
                        (e) => e.id !== criteria.id,
                      ),
                    });
                  }}
                />
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="w-fit text-muted-foreground opacity-50 transition-opacity hover:text-muted-foreground hover:opacity-100"
                onClick={addCriteria}
              >
                + add criteria
              </Button>
            </div>
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
