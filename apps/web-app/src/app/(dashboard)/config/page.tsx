"use client";

import { useState } from "react";
import { type Outcome } from "@prisma/client";
import OutcomeItem from "./_components/OutcomeItem";
import { Button } from "~/components/ui/button";
import PageHeader from "~/components/PageHeader";

export default function ConfigPage() {
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);

  return (
    <div className="w-full max-w-2xl self-center">
      <PageHeader title="outcomes" />
      <div className="flex flex-col items-start gap-2">
        {outcomes.length === 0 && (
          <OutcomeItem
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
        {outcomes.map((outcome) => (
          <OutcomeItem key={outcome.id} outcome={outcome} />
        ))}
        <Button variant="ghost">+ add outcome</Button>
      </div>
    </div>
  );
}
