"use client";

import { useState, useEffect } from "react";
import { type OutcomeInput } from "~/lib/types/project";
import OutcomeItem from "./_components/OutcomeItem";
import { Button } from "~/components/ui/button";
import PageHeader from "~/components/PageHeader";
import { UnsavedChangesToast } from "./_components/saveToast";
import { api } from "~/trpc/react";
import { useProject } from "~/app/contexts/projectContext";
import { skipToken } from "@tanstack/react-query";

export default function ConfigPage() {
  const { selectedProject } = useProject();
  const [localOutcomes, setLocalOutcomes] = useState<OutcomeInput[]>([]);
  const {
    data: project,
    isLoading,
    refetch: refetchProject,
  } = api.project.getProject.useQuery(
    selectedProject?.id
      ? {
          projectId: selectedProject.id,
        }
      : skipToken,
  );

  useEffect(() => {
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
  }, [project, selectedProject?.id]);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) => {
    const value = e.target.value;
    const name = e.target.name;
    setLocalOutcomes((prev) => {
      const newOutcomes = prev.map((outcome, i) =>
        i === index ? { ...outcome, [name]: value } : outcome,
      );
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
    if (!selectedProject?.id || !project?.name) {
      console.error("No project ID or name found");
      return;
    }
    updateProject({
      projectId: selectedProject.id,
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
      <div className="mb-20 flex flex-col items-start gap-2">
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
        <UnsavedChangesToast
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
