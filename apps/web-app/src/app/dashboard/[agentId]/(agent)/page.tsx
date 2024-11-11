"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { PlusIcon, RocketLaunchIcon } from "@heroicons/react/24/solid";
import TestCard from "~/components/dashboard/TestCard";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";

import useSocketMessage from "~/app/_components/UseSocketMessage";
import { TEST_TEST_AGENTS } from "~/lib/test-data";
import { TEST_TESTS } from "~/lib/test-data";

export default function AgentPage({ params }: { params: { agentId: string } }) {
  const [testInitializing, setTestInitializing] = useState(false);
  const [testAgentsModalOpen, setTestAgentsModalOpen] = useState(false);

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
          <Button
            variant="outline"
            size="lg"
            onClick={() => setTestAgentsModalOpen(true)}
          >
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
      <TestAgentsModal
        open={testAgentsModalOpen}
        onOpenChange={setTestAgentsModalOpen}
      />
    </div>
  );
}

function TestAgentsModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [enabledAgents, setEnabledAgents] = useState<Set<string>>(new Set());

  const toggleAgent = (agentId: string) => {
    setEnabledAgents((prev) => {
      const next = new Set(prev);
      if (next.has(agentId)) {
        next.delete(agentId);
      } else {
        next.add(agentId);
      }
      return next;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] lg:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>test agents</DialogTitle>
          <DialogDescription>
            configure the test agents that will interact with your agent.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {TEST_TEST_AGENTS.map((agent) => (
            <div
              key={agent.id}
              onClick={() => toggleAgent(agent.id)}
              className="flex cursor-pointer items-center gap-4 rounded-md border border-input p-4 hover:bg-muted"
            >
              <div className="shrink-0">
                <Image
                  src={agent.headshotUrl}
                  alt={agent.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="text-sm font-medium">{agent.name}</div>
                <div className="text-xs text-muted-foreground">
                  {agent.description}
                </div>
              </div>
              <Switch checked={enabledAgents.has(agent.id)} />
            </div>
          ))}
          <div className="flex h-full cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-muted/50 p-4 text-sm text-muted-foreground hover:bg-muted">
            <PlusIcon className="size-4" />
            <span>create custom test agent</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
