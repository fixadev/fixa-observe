"use client";

import { useCallback, useEffect, useState } from "react";
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
import { type AgentWithIncludes } from "~/lib/types";

import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { type SocketMessage } from "~/lib/agent";
import { type TestWithCalls } from "~/lib/types";

export default function AgentPage({ params }: { params: { agentId: string } }) {
  const [tests, setTests] = useState<TestWithCalls[]>([]);
  const [testInitializing, setTestInitializing] = useState(false);
  const [testAgentsModalOpen, setTestAgentsModalOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  useSocketMessage(
    user?.id,
    useCallback(
      (message: SocketMessage) => {
        setTests((prev) =>
          prev.map((test) =>
            test.id === message.testId
              ? {
                  ...test,
                  calls: test.calls.map((call) =>
                    call.id === message.callId ? message.call : call,
                  ),
                }
              : test,
          ),
        );
      },
      [setTests],
    ),
  );

  const { data: agent } = api.agent.get.useQuery({ id: params.agentId });

  const { data: _tests } = api.test.getAll.useQuery({
    agentId: params.agentId,
  });
  const { mutate: runTest } = api.test.run.useMutation({
    onSuccess: (data) => {
      setTests((prev) => [data, ...prev]);
      toast({
        title: "Test initiated successfully",
        duration: 2000,
      });
      setTestInitializing(false);
    },
  });

  useEffect(() => {
    if (_tests) {
      setTests(_tests);
    }
  }, [_tests]);

  const handleRunTest = useCallback(() => {
    setTestInitializing(true);
    runTest({ agentId: params.agentId });
  }, [params.agentId, runTest, setTestInitializing]);

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
      {tests.length > 0 && (
        <div className="container py-8">
          <div className="rounded-t-md border-x border-t border-input shadow-sm">
            <AnimatePresence mode="popLayout">
              {tests?.map((test) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Link href={`/dashboard/${params.agentId}/tests/${test.id}`}>
                    <TestCard
                      test={test}
                      className="cursor-pointer hover:bg-muted"
                    />
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
      {agent && (
        <TestAgentsModal
          agent={agent}
          open={testAgentsModalOpen}
          onOpenChange={setTestAgentsModalOpen}
        />
      )}
    </div>
  );
}

function TestAgentsModal({
  agent,
  open,
  onOpenChange,
}: {
  agent: AgentWithIncludes;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: testAgents } = api.agent.getTestAgents.useQuery();

  const [enabledAgents, setEnabledAgents] = useState<Set<string>>(
    new Set(agent.enabledTestAgents.map((agent) => agent.id)),
  );

  useEffect(() => {
    setEnabledAgents(new Set(agent.enabledTestAgents.map((agent) => agent.id)));
  }, [agent.enabledTestAgents]);

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
          {testAgents?.map((agent) => (
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
