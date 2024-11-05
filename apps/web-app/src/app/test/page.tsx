"use client";

import { Button } from "~/components/ui/button";
import Link from "next/link";
import { api } from "~/trpc/react";
import { skipToken } from "@tanstack/react-query";
import { NodeModal } from "../_components/NodeModal";

export default function TestPage() {
  const { data: agents } = api.agent.listAgents.useQuery({});

  const { data: states } = api.agent.listCallsPerState.useQuery(
    agents?.[0]?.agent_id ? { agentId: agents[0].agent_id } : skipToken,
  );
  console.log(states);

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-4xl font-medium">Test Page</h1>

      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-2xl">Nodes</h2>
        {states?.map((state) => (
          <NodeModal key={state.name} title={state.name} state={state}>
            <div
              key={state.name}
              className="mb-4 rounded border p-4 hover:cursor-pointer"
            >
              <div className="font-medium">{state.name}</div>
              <div className="text-sm text-muted-foreground">
                {state.calls.length} calls
              </div>
            </div>
          </NodeModal>
        ))}

        <Button asChild className="mt-4">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
