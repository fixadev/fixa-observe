"use client";

import { useState, useEffect } from "react";
import { type Outcome } from "@prisma/client";
import OutcomeItem from "./_components/OutcomeItem";
import { Button } from "~/components/ui/button";
import PageHeader from "~/components/PageHeader";
import { PersistentToast } from "./_components/saveToast";
import { api } from "~/trpc/react";
import { useProject } from "~/app/contexts/projectContext";

export default function ConfigPage() {
  const { projectIds } = useProject();
  const [localOutcomes, setLocalOutcomes] = useState<Outcome[]>([]);
  const {
    data: project,
    isLoading,
    refetch: refetchProject,
  } = api.project.getProject.useQuery({
    projectId: projectIds?.[0]?.id ?? "",
  });

  useEffect(() => {
    if (project) {
      setLocalOutcomes(project.possibleOutcomes);
    }
  }, [project]);

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

  const { mutate: updateProject } = api.project.updateProject.useMutation();

  const saveChanges = async () => {
    if (!projectIds?.[0]?.id || !project?.name) {
      console.error("No project ID or name found");
      return;
    }
    updateProject({
      projectId: projectIds[0].id,
      projectName: project?.name,
      outcomes: localOutcomes,
    });
    await refetchProject();
  };

  return (
    <div className="w-full max-w-2xl self-center">
      <PageHeader title="outcomes" />
      <div className="flex flex-col items-start gap-2">
        {localOutcomes.length === 0 && (
          <OutcomeItem
            index={0}
            handleInput={handleInput}
            outcome={{
              id: "",
              createdAt: new Date(),
              updatedAt: new Date(),
              name: "",
              description: "",
              projectId: null,
            }}
          />
        )}
        {localOutcomes.map((outcome, index) => (
          <OutcomeItem
            key={outcome.id}
            index={index}
            handleInput={handleInput}
            outcome={outcome}
          />
        ))}
        <Button
          variant="ghost"
          onClick={() =>
            setLocalOutcomes([
              ...localOutcomes,
              {
                id: "",
                createdAt: new Date(),
                updatedAt: new Date(),
                name: "",
                description: "",
                projectId: null,
              },
            ])
          }
        >
          + add outcome
        </Button>
      </div>
      {JSON.stringify(localOutcomes) !==
        JSON.stringify(project?.possibleOutcomes) && (
        <PersistentToast
          saveChanges={saveChanges}
          discardChanges={() => {
            setLocalOutcomes(project?.possibleOutcomes ?? []);
          }}
        />
      )}
    </div>
  );
}
