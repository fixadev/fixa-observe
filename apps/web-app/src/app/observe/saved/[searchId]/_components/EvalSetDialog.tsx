"use client";
import { Dialog, DialogContent, DialogFooter } from "~/components/ui/dialog";
import {
  type EvaluationGroupWithIncludes,
  type Filter,
} from "@repo/types/src/index";
import { useCallback, useEffect, useState } from "react";
import { instantiateEvalSet } from "~/lib/instantiate";
import { isTempId } from "~/lib/utils";
import { api } from "~/trpc/react";
import EvalSetCard from "./EvalSetDetailsCard";
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

export function CreateEditEvaluationDialog({
  open,
  setOpen,
  savedSearchId,
  selectedEvalSet,
  voidSelectedEvalSet,
  filter,
  setFilter,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  savedSearchId: string;
  selectedEvalSet: EvaluationGroupWithIncludes | null;
  voidSelectedEvalSet: () => void;
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
}) {
  const [evalSet, setEvalSet] = useState<EvaluationGroupWithIncludes>(
    selectedEvalSet ?? instantiateEvalSet({ savedSearchId }),
  );

  useEffect(() => {
    if (selectedEvalSet) {
      setEvalSet(selectedEvalSet);
    }
  }, [selectedEvalSet]);

  const { mutate: createEvalSet, isPending: isCreating } =
    api.eval.createSet.useMutation({
      onSuccess: (data) => {
        setFilter({
          ...filter,
          evalSets: filter.evalSets ? [...filter.evalSets, data] : [data],
        });
        voidSelectedEvalSet();
        setOpen(false);
      },
    });

  const { mutate: updateEvalSet, isPending: isUpdating } =
    api.eval.updateSet.useMutation({
      onSuccess: (data) => {
        setFilter({
          ...filter,
          evalSets: filter.evalSets?.map((es) =>
            es.id === data.id ? data : es,
          ),
        });
        voidSelectedEvalSet();
        setOpen(false);
      },
    });

  const { mutate: deleteEvalSet, isPending: isDeleting } =
    api.eval.deleteSet.useMutation({
      onSuccess: () => {
        setFilter({
          ...filter,
          evalSets: filter.evalSets?.filter((es) => es.id !== evalSet.id),
        });
        voidSelectedEvalSet();
        setOpen(false);
      },
    });

  const handleSubmit = useCallback(() => {
    if (isTempId(evalSet.id)) {
      createEvalSet(evalSet);
    } else {
      updateEvalSet(evalSet);
    }
  }, [evalSet, createEvalSet, updateEvalSet]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex min-h-[400px] min-w-[600px] flex-col">
        {/* <DialogHeader>
          <DialogTitle className="text-lg font-medium leading-none tracking-tight">
            {selectedEvalSet ? "edit evaluation" : "create evaluation"}
          </DialogTitle>
        </DialogHeader> */}

        <div className="flex flex-col gap-4">
          <EvalSetCard evalSet={evalSet} onUpdate={setEvalSet} />
        </div>
        <DialogFooter className="mt-auto">
          <div className="flex w-full justify-between">
            {!isTempId(evalSet.id) ? (
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
                      onClick={() => deleteEvalSet({ id: evalSet.id })}
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
