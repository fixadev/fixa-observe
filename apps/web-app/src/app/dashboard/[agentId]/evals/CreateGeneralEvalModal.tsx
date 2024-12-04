"use client";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { useToast } from "~/components/hooks/use-toast";
import { type EvalWithoutScenarioId, type EvalSchema } from "~/lib/agent";
import { TrashIcon } from "@heroicons/react/24/solid";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogAction,
} from "~/components/ui/alert-dialog";
import { EvalInput } from "~/app/_components/EvalInput";

export const CreateGeneralEvalModal = ({
  existingEval,
  setEvaluations,
  isModalOpen,
  setIsModalOpen,
}: {
  existingEval: EvalSchema | null;
  setEvaluations: React.Dispatch<React.SetStateAction<EvalSchema[]>>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [evaluation, setEvaluation] = useState<
    EvalSchema | EvalWithoutScenarioId
  >(
    existingEval ?? {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      name: "",
      description: "",
      type: "general",
      resultType: "number",
      contentType: "content",
      scenarioId: undefined,
      agentId: null,
      ownerId: null,
      toolCallExpectedResult: "",
    },
  );

  const { toast } = useToast();

  const { mutate: createGeneralEval } = api.eval.createGeneralEval.useMutation({
    onSuccess: (data) => {
      toast({
        title: "eval created",
        description: "eval created successfully",
      });
      setEvaluations((evaluations) => [...evaluations.slice(0, -1), data]);
      setIsModalOpen(false);
    },
  });

  const { mutate: updateGeneralEval } = api.eval.updateGeneralEval.useMutation({
    onSuccess: (data) => {
      toast({
        title: "eval updated",
        description: "eval updated successfully",
      });
      setEvaluations((evaluations) =>
        evaluations.map((e: EvalSchema) => (e.id === data.id ? data : e)),
      );
    },
  });

  const { mutate: deleteGeneralEval } = api.eval.deleteGeneralEval.useMutation({
    onSuccess: () => {
      setEvaluations((evaluations) =>
        evaluations.filter((e) => e.id !== evaluation.id),
      );
      setIsModalOpen(false);
      toast({
        title: "eval deleted",
        description: "eval deleted successfully",
      });
    },
  });

  useEffect(() => {
    if (existingEval) {
      setEvaluation(existingEval);
    } else {
      setEvaluation({
        id: crypto.randomUUID(),
        createdAt: new Date(),
        name: "",
        description: "",
        type: "general",
        resultType: "number",
        contentType: "content",
        scenarioId: null,
        toolCallExpectedResult: "",
        agentId: null,
        ownerId: null,
      });
    }
  }, [existingEval]);

  const handleSave = () => {
    if (existingEval) {
      updateGeneralEval(evaluation as EvalSchema);
    } else {
      setEvaluations((evaluations) => [
        ...evaluations,
        evaluation as EvalSchema,
      ]);
      createGeneralEval(evaluation as EvalWithoutScenarioId);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent>
        <DialogTitle>
          {existingEval ? "update eval" : "create eval"}
        </DialogTitle>
        <EvalInput evaluation={evaluation} setEvaluation={setEvaluation} />
        <div className="flex flex-row justify-between gap-2">
          <DeleteEvalDialog
            deleteEval={() => deleteGeneralEval({ id: evaluation.id })}
          >
            <Button variant="ghost">
              <TrashIcon className="size-5 text-black" />
            </Button>
          </DeleteEvalDialog>
          <div className="flex flex-row gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              cancel
            </Button>
            <Button onClick={handleSave}>save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

function DeleteEvalDialog({
  deleteEval,
  children,
}: {
  deleteEval: () => void;
  children: React.ReactNode;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            evaluation.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteEval()}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
