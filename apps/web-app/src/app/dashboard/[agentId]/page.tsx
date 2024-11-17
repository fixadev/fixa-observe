"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { PlusIcon, RocketLaunchIcon } from "@heroicons/react/24/solid";
import TestCard from "~/components/dashboard/TestCard";
import { api } from "~/trpc/react";
import { useToast } from "~/components/hooks/use-toast";

import useSocketMessage from "~/app/_components/UseSocketMessage";
import { type AgentWithIncludes } from "~/lib/types";

import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { type CallEndedData, type SocketMessage } from "~/lib/agent";
import { type TestWithCalls } from "~/lib/types";
import Spinner from "~/components/Spinner";
import { Label } from "~/components/ui/label";
import { useAgent } from "~/app/contexts/UseAgent";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { SidebarTrigger } from "~/components/ui/sidebar";

export default function AgentPage({ params }: { params: { agentId: string } }) {
  const [tests, setTests] = useState<TestWithCalls[]>([]);
  const [runTestModalOpen, setRunTestModalOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  useSocketMessage(
    user?.id,
    useCallback(
      (message: SocketMessage) => {
        if (message.type === "call-ended") {
          const data = message.data as CallEndedData;
          setTests((prev) =>
            prev.map((test) =>
              test.id === data.testId
                ? {
                    ...test,
                    calls: test.calls.map((call) =>
                      call.id === data.callId ? data.call : call,
                    ),
                  }
                : test,
            ),
          );
        }
      },
      [setTests],
    ),
  );

  const { agent } = useAgent(params.agentId);

  const { data: _tests } = api.test.getAll.useQuery({
    agentId: params.agentId,
  });

  const { mutateAsync: runTest } = api.test.run.useMutation({
    onSuccess: (data) => {
      setTests((prev) => [data, ...prev]);
      toast({
        title: "Test initiated successfully",
        duration: 2000,
      });
    },
  });

  useEffect(() => {
    if (_tests) {
      setTests(_tests);
    }
  }, [_tests]);

  // const handleRunTest = useCallback(() => {
  //   setRunTestModalOpen(true);
  // }, []);

  const handleRunTest = useCallback(
    async (scenarioIds: string[]) => {
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      // throw new Error("test failed");
      await runTest({ agentId: params.agentId, scenarioIds });
    },
    [params.agentId, runTest],
  );

  return (
    <div>
      {/* header */}
      <div className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-input bg-sidebar px-4 lg:h-[60px]">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <Link href={`/dashboard/${params.agentId}`}>
            <div className="font-medium">test history</div>
          </Link>
        </div>
        <Button
          className="flex min-w-[160px] items-center gap-2"
          onClick={() => setRunTestModalOpen(true)}
        >
          run test <RocketLaunchIcon className="size-4" />
        </Button>
      </div>

      {/* content */}
      {tests.length > 0 && (
        <div className="p-4">
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
        <>
          <RunTestModal
            agent={agent}
            open={runTestModalOpen}
            onOpenChange={setRunTestModalOpen}
            onRunTest={handleRunTest}
          />
        </>
      )}
    </div>
  );
}

function RunTestModal({
  agent,
  open,
  onOpenChange,
  onRunTest,
}: {
  agent: AgentWithIncludes;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRunTest: (scenarioIds: string[]) => Promise<void>;
}) {
  const { toast } = useToast();

  const [selectedScenarios, setSelectedScenarios] = useState<Set<string>>(
    new Set(agent.scenarios.map((scenario) => scenario.id)),
  );

  const toggleScenario = useCallback((scenarioId: string) => {
    setSelectedScenarios((prev) => {
      const next = new Set(prev);
      if (next.has(scenarioId)) {
        next.delete(scenarioId);
      } else {
        next.add(scenarioId);
      }
      return next;
    });
  }, []);

  const { data: testAgents } = api.agent.getTestAgents.useQuery();
  const { mutate: toggleTestAgentEnabled } =
    api.agent.toggleTestAgentEnabled.useMutation();

  const [enabledAgents, setEnabledAgents] = useState<Set<string>>(
    new Set(agent.enabledTestAgents.map((agent) => agent.id)),
  );

  useEffect(() => {
    setEnabledAgents(new Set(agent.enabledTestAgents.map((agent) => agent.id)));
  }, [agent.enabledTestAgents]);

  const toggleAgent = (testAgentId: string) => {
    setEnabledAgents((prev) => {
      const next = new Set(prev);
      if (next.has(testAgentId)) {
        next.delete(testAgentId);
      } else {
        next.add(testAgentId);
      }
      return next;
    });
    toggleTestAgentEnabled({
      agentId: agent.id,
      testAgentId,
      enabled: !enabledAgents.has(testAgentId),
    });
  };

  const [loading, setLoading] = useState(false);
  const handleRunTest = useCallback(async () => {
    setLoading(true);
    try {
      await onRunTest(Array.from(selectedScenarios));
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error running test",
        description: "Please try again later.",
        duration: 2000,
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [onRunTest, selectedScenarios, onOpenChange, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* <DialogContent className="sm:max-w-[800px]"> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>run test</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="text-sm text-muted-foreground">
            select the scenarios to test.
          </div>
          {agent.scenarios.map((scenario) => (
            <div key={scenario.id} className="flex items-center gap-2">
              <Switch
                id={scenario.id}
                checked={selectedScenarios.has(scenario.id)}
                onCheckedChange={() => toggleScenario(scenario.id)}
              />
              <Label htmlFor={scenario.id} className="text-sm font-medium">
                {scenario.name}
              </Label>
            </div>
          ))}
          <Accordion type="single" collapsible>
            <AccordionItem value="test-agents" className="-mx-6 border-none">
              <AccordionTrigger className="px-6">test agents</AccordionTrigger>
              <AccordionContent className="h-[300px] overflow-y-auto px-6">
                <div className="grid grid-cols-1 gap-2">
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Button
            onClick={handleRunTest}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                initializing
                <Spinner className="size-4" />
              </>
            ) : (
              "run test"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
