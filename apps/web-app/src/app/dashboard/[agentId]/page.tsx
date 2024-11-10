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
            <div className="text-2xl font-medium">tests</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="lg">
            configure test agents
          </Button>
          <Button size="lg" className="flex items-center gap-2">
            run test <RocketLaunchIcon className="size-4" />
          </Button>
        </div>
      </div>
      <div className="h-px w-full bg-input" />

      {/* content */}
      <div className="container py-8">
        <div className="rounded-t-md border-x border-t border-input shadow-sm">
          <TestCard />
          <TestCard />
          <TestCard />
          <TestCard />
          <TestCard />
          <TestCard />
        </div>
      </div>
    </div>
  );
}
