"use client";

import Link from "next/link";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { z } from "zod";
import EvalGroupCard from "./_components/EvalGroupCard";
import { useState } from "react";

export default function EvalsPage() {
  const [evalGroups, setEvalGroups] = useState<EvalGroup[]>(testData);

  return (
    <>
      <div className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background p-4">
        <SidebarTrigger />
        <Link href="/observe/evals">
          <div className="font-medium">evaluation criteria</div>
        </Link>
      </div>
      <div className="flex flex-col gap-4 p-4">
        {evalGroups.map((g) => (
          <EvalGroupCard
            key={g.id}
            group={g}
            onUpdate={(updated) => {
              setEvalGroups(
                evalGroups.map((g) => (g.id === updated.id ? updated : g)),
              );
            }}
          />
        ))}
      </div>
    </>
  );
}

// IDEA: create an default eval group when people first sign in
export type EvalGroup = {
  id: string;
  name: string;
  conditions: EvalCondition[];
  evals: Eval[];
  enabled: boolean;
};

export type Eval = {
  id: string;
  name: string;
  description: string;
};

const evalFilterCondition = z.object({
  id: z.string(),
  type: z.literal("filter"),
  property: z.string(),
  value: z.string(),
});

const evalTextCondition = z.object({
  id: z.string(),
  type: z.literal("text"),
  text: z.string(),
});

const evalConditionSchema = z.discriminatedUnion("type", [
  evalFilterCondition,
  evalTextCondition,
]);

export type EvalCondition = z.infer<typeof evalConditionSchema>;

const testData: EvalGroup[] = [
  {
    id: "1",
    name: "test",
    conditions: [
      {
        id: "1",
        type: "text",
        text: "true",
      },
    ],
    evals: [
      {
        id: "c1",
        name: "placeholder text",
        description:
          "agent did not say any placeholder text, like 'customer_name' or the like",
      },
    ],
    enabled: true,
  },
  {
    id: "2",
    name: "test",
    conditions: [
      {
        id: "1",
        type: "filter",
        property: "customerId",
        value: "321fdsa69420",
      },
      {
        id: "2",
        type: "filter",
        property: "agentId",
        value: "42069asdf123",
      },
    ],
    evals: [
      {
        id: "c1",
        name: "correct questions",
        description:
          "check if agent asked the following questions:\n1. what is your name?\n2. what company do you work at?\n3. how many calls do you do per day?",
      },
    ],
    enabled: true,
  },
  {
    id: "3",
    name: "test",
    conditions: [
      {
        id: "1",
        type: "text",
        text: "agent tries to schedule a meeting",
      },
    ],
    evals: [
      {
        id: "c1",
        name: "ask for time zone",
        description: "agent asked the caller for what their time zone is",
      },
      {
        id: "c2",
        name: "ask for name",
        description: "agent asked the caller for their name",
      },
    ],
    enabled: true,
  },
];
