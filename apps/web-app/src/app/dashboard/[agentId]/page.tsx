import { RocketLaunchIcon } from "@heroicons/react/24/solid";
import { useMemo } from "react";
import { Button } from "~/components/ui/button";
import { TEST_AGENT } from "~/lib/test-data";
import TestCard from "./_components/TestCard";

export default function AgentPage({}: { params: { agentId: string } }) {
  const agent = useMemo(() => {
    return TEST_AGENT;
  }, []);

  return (
    <div>
      {/* header */}
      <div className="container flex items-center justify-between py-8">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-medium">{agent.name}</div>
            <div className="text-sm text-muted-foreground">
              {agent.phoneNumber}
            </div>
          </div>
          <Button variant="outline">edit</Button>
        </div>
        <Button size="lg" className="flex items-center gap-2">
          run test <RocketLaunchIcon className="size-4" />
        </Button>
      </div>
      <div className="h-px w-full bg-input" />

      {/* content */}
      <div className="container py-8">
        <TestCard />
      </div>
    </div>
  );
}
