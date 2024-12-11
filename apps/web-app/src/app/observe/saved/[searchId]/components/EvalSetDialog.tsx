"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "~/components/ui/dialog";
import { EvalSetWithIncludes, Filter } from "@repo/types/src";
import { useEffect, useState } from "react";
import { instantiateEvalSet } from "~/lib/instantiate";
import { isTempId } from "~/lib/utils";
import { api } from "~/trpc/react";
import EvalSetCard from "./EvalSetCard";
import { Button } from "~/components/ui/button";
import Spinner from "~/components/Spinner";

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
  selectedEvalSet: EvalSetWithIncludes | null;
  voidSelectedEvalSet: () => void;
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
}) {
  const [evalSet, setEvalSet] = useState<EvalSetWithIncludes>(
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

  const handleSubmit = () => {
    if (isTempId(evalSet.id)) {
      createEvalSet(evalSet);
    } else {
      updateEvalSet(evalSet);
    }
  };

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
          <Button
            className="mt-4"
            onClick={handleSubmit}
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating ? <Spinner /> : "save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
