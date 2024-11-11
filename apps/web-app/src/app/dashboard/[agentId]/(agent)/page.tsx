"use client";

import { RocketLaunchIcon } from "@heroicons/react/24/solid";
import { Button } from "~/components/ui/button";
import TestCard from "~/components/dashboard/TestCard";
import Link from "next/link";
import { TEST_TESTS } from "~/lib/test-data";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";
import useSocketMessage from "~/app/_components/UseSocketMessage";
import { useState } from "react";

export default function AgentPage({ params }: { params: { agentId: string } }) {
  const [testInitializing, setTestInitializing] = useState(false);
  const { toast } = useToast();
  const { triggered, setTriggered } = useSocketMessage();
  const { mutate: runTest } = api.test.run.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Test initiated successfully",
        duration: 2000,
      });
      setTestInitializing(false);
    },
  });

  const handleRunTest = () => {
    setTestInitializing(true);
    runTest({ agentId: params.agentId });
  };

  return (
    <div>
      {/* header */}
      <div className="container flex items-center justify-between py-8">
        <div className="text-2xl font-medium">tests</div>
        <div className="flex gap-2">
          <Button variant="outline" size="lg">
            configure test agents
          </Button>
          <Button
            size="lg"
            className="flex items-center gap-2"
            disabled={testInitializing}
            onClick={handleRunTest}
          >
            run test <RocketLaunchIcon className="size-4" />
          </Button>
        </div>
      </div>
      <div className="h-px w-full bg-input" />

      {/* content */}
      <div className="container py-8">
        <div className="rounded-t-md border-x border-t border-input shadow-sm">
          {Array.from({ length: 26 }).map((_, i) => (
            <Link href={`/dashboard/${params.agentId}/tests/${i + 1}`} key={i}>
              <TestCard
                test={TEST_TESTS[0]!}
                className="cursor-pointer hover:bg-muted"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
