"use client";

import { useState } from "react";
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
  const { data: dbOutcomes, isLoading } = api.project.getProject.useQuery({
    projectId: projectIds?.[0]?.id ?? "",
  });

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
    </div>
  );
}
