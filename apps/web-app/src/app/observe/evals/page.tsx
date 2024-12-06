"use client";

import Link from "next/link";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { z } from "zod";
import { Card, CardTitle, CardHeader, CardContent } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { Button } from "~/components/ui/button";

export default function EvalsPage() {
  return (
    <>
      <div className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background p-4">
        <SidebarTrigger />
        <Link href="/observe/evals">
          <div className="font-medium">evaluation criteria</div>
        </Link>
      </div>
      <div className="flex flex-col gap-4 p-4">
        {testData.map((g) => (
          <EvalGroupCard key={g.id} group={g} />
        ))}
      </div>
    </>
  );
}

function EvalGroupCard({ group }: { group: EvalGroup }) {
  return (
    <Card className="text-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle>{group.name}</CardTitle>
        <Switch checked={group.enabled} onCheckedChange={() => null} />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="group flex items-center gap-2">
          <div className="text-xs font-medium text-muted-foreground">IF</div>
          {group.conditions.map((c, i) => {
            if (c.type === "text") {
              return (
                <MonoTextBlock key={i}>
                  <div className="flex items-baseline gap-1">
                    <div className="text-xs text-muted-foreground">
                      condition:
                    </div>
                    {c.text}
                  </div>
                </MonoTextBlock>
              );
            } else if (c.type === "filter") {
              return (
                <MonoTextBlock key={i}>
                  <div className="flex items-baseline gap-1">
                    <div className="text-xs text-muted-foreground">filter:</div>
                    {c.property} == {c.value}
                  </div>
                </MonoTextBlock>
              );
            }
            return null;
          })}
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground opacity-50 transition-opacity hover:opacity-100"
          >
            + add condition
          </Button>
        </div>
        <div className="text-xs font-medium text-muted-foreground">THEN</div>
        <div className="flex flex-col gap-2">
          {group.criteria.map((c) => (
            <div className="flex flex-col gap-1 rounded border p-2" key={c.id}>
              <MonoTextBlock>{c.name}</MonoTextBlock>
              <pre className="px-2 text-muted-foreground">{c.description}</pre>
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="w-fit text-muted-foreground opacity-50 transition-opacity hover:opacity-100"
          >
            + add criteria
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function MonoTextBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-fit rounded-md bg-muted px-2 py-1 font-mono">
      {children}
    </div>
  );
}

// IDEA: create an default eval group when people first sign in
type EvalGroup = {
  id: string;
  name: string;
  conditions: EvalCondition[];
  criteria: EvalCriteria[];
  enabled: boolean;
};

type EvalCriteria = {
  id: string;
  name: string;
  description: string;
};

const evalFilterCondition = z.object({
  type: z.literal("filter"),
  property: z.string(),
  value: z.string(),
});

const evalTextCondition = z.object({
  type: z.literal("text"),
  text: z.string(),
});

const evalConditionSchema = z.discriminatedUnion("type", [
  evalFilterCondition,
  evalTextCondition,
]);

type EvalCondition = z.infer<typeof evalConditionSchema>;

const testData: EvalGroup[] = [
  {
    id: "1",
    name: "test",
    conditions: [
      {
        type: "text",
        text: "true",
      },
    ],
    criteria: [
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
        type: "filter",
        property: "customerId",
        value: "321fdsa69420",
      },
      {
        type: "filter",
        property: "agentId",
        value: "42069asdf123",
      },
    ],
    criteria: [
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
        type: "text",
        text: "agent tries to schedule a meeting",
      },
    ],
    criteria: [
      {
        id: "c1",
        name: "ask for time zone",
        description: "agent asked the caller for what their time zone is",
      },
    ],
    enabled: true,
  },
];
