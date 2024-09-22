"use client";

import { useState, useEffect } from "react";
import { type OutcomeInput } from "~/lib/types/project";
import OutcomeItem from "./_components/OutcomeItem";
import { Button } from "~/components/ui/button";
import PageHeader from "~/components/PageHeader";
import { PersistentToast } from "./_components/saveToast";
import { api } from "~/trpc/react";
import { useProject } from "~/app/contexts/projectContext";
import { skipToken } from "@tanstack/react-query";

export default function ConfigPage() {
  const { selectedProjectId } = useProject();
  const [localOutcomes, setLocalOutcomes] = useState<OutcomeInput[]>([]);
  const {
    data: project,
    isLoading,
    refetch: refetchProject,
  } = api.project.getProject.useQuery(
    selectedProjectId
      ? {
          projectId: selectedProjectId,
        }
      : skipToken,
  );

  useEffect(() => {
    console.log("PROJECT DETAILS ARE", project);
    if (
      project &&
      project.possibleOutcomes &&
      project.possibleOutcomes.length > 0
    ) {
      setLocalOutcomes(project.possibleOutcomes);
    } else {
      setLocalOutcomes([
        {
          name: "",
          description: "",
        },
      ]);
    }
  }, [project, selectedProjectId]);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) => {
    const value = e.target.value;
    const name = e.target.name;
    console.log("HANDLING INPUT", index, name, value);
    setLocalOutcomes((prev) => {
      const newOutcomes = prev.map((outcome, i) =>
        i === index ? { ...outcome, [name]: value } : outcome,
      );
      console.log("NEW OUTCOMES", newOutcomes);
      return newOutcomes;
    });
  };

  const handleDelete = (index: number) => {
    setLocalOutcomes((prev) => prev.filter((_, i) => i !== index));
  };

  const { mutate: updateProject } = api.project.updateProject.useMutation({
    onSuccess: async () => {
      await refetchProject();
    },
    onError: (error) => {
      console.error("Error updating project", error);
    },
  });

  const saveChanges = async () => {
    if (!selectedProjectId || !project?.name) {
      console.error("No project ID or name found");
      return;
    }
    console.log("SAVING OUTCOMES", localOutcomes);
    updateProject({
      projectId: selectedProjectId,
      projectName: project?.name,
      outcomes: localOutcomes,
    });
  };

  const checkIfOutcomesChanged = () => {
    return (
      JSON.stringify(localOutcomes) !==
        JSON.stringify(project?.possibleOutcomes) &&
      localOutcomes.some(
        (outcome) => outcome.name !== "" || outcome.description !== "",
      )
    );
  };

  return (
    <div className="w-full max-w-2xl self-center">
      <PageHeader title="outcomes" />
      <div className="flex flex-col items-start gap-2">
        {localOutcomes.map((outcome, index) => (
          <OutcomeItem
            key={index}
            index={index}
            handleInput={handleInput}
            handleDelete={handleDelete}
            outcome={outcome}
          />
        ))}
        <Button
          variant="ghost"
          onClick={() =>
            setLocalOutcomes([
              ...localOutcomes,
              {
                name: "",
                description: "",
              },
            ])
          }
        >
          + add outcome
        </Button>
      </div>
      {checkIfOutcomesChanged() && (
        <PersistentToast
          saveChanges={() => {
            saveChanges().catch((error) => {
              console.error("Error saving changes", error);
            });
          }}
          discardChanges={() => {
            setLocalOutcomes(project?.possibleOutcomes ?? []);
          }}
        />
      )}
    </div>
  );
}
