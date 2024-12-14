"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { useToast } from "~/components/hooks/use-toast";

import useSocketMessage from "~/app/_components/UseSocketMessage";
import {
  type PublicMetadata,
  type AgentWithIncludes,
} from "@repo/types/src/index";

import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { type CallEndedData, type SocketMessage } from "@repo/types/src/index";
import { type TestWithCalls } from "@repo/types/src/index";
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
import { useRouter } from "next/navigation";
import { AddAgentModal } from "../(agents)/_components/AddAgentModal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { env } from "~/env";

export default function AgentPage({ params }: { params: { agentId: string } }) {
  const [tests, setTests] = useState<TestWithCalls[]>([]);
  const [runTestModalOpen, setRunTestModalOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const { agent, setAgent } = useAgent(params.agentId);
  const router = useRouter();

  // hacky fix
  useEffect(() => {
    if (params.agentId === "new" && agent?.id && agent?.id !== "new") {
      router.push(`/dashboard/${agent?.id}`);
    }
  }, [params.agentId, agent, router]);

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

  const { data: _tests, isLoading } = api.test.getAll.useQuery({
    agentId: params.agentId,
  });

  const { mutateAsync: runTest } = api.test.run.useMutation({
    onSuccess: (data) => {
      setTests((prev) => [data, ...prev]);
      if (agent) {
        setAgent({
          ...agent,
          tests: [...agent.tests, data],
        });
      }
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

  const { data: agents } = api.agent.getAll.useQuery();

  const canRunTest = useMemo(() => {
    const metadata = user?.publicMetadata as PublicMetadata | undefined;
    return (
      !!metadata?.stripeCustomerId ||
      (metadata?.freeTestsLeft ?? 0) > 0 ||
      user?.id === env.NEXT_PUBLIC_OFONE_USER_ID
    );
  }, [user]);

  const handleRunTest = useCallback(
    async (scenarioIds: string[], testAgentIds: string[]) => {
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      // throw new Error("test failed");
      await runTest({
        agentId: params.agentId,
        scenarioIds,
        testAgentIds,
      });
      await user?.reload();
    },
    [params.agentId, runTest, user],
  );

  const { mutate: getCheckoutUrl, isPending: isGeneratingStripeUrl } =
    api.stripe.createCheckoutUrl.useMutation({
      onSuccess: (data) => {
        window.location.href = data.checkoutUrl;
      },
    });
  const upgradePlan = useCallback(async () => {
    const redirectUrl = window.location.href;
    getCheckoutUrl({ redirectUrl });
  }, [getCheckoutUrl]);

  return (
    <div className="h-full">
      {/* header */}
      <div className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-input bg-sidebar px-4 lg:h-[60px]">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <Link href={`/dashboard/${params.agentId}`}>
            <div className="font-medium">test history</div>
          </Link>
        </div>
        {canRunTest ? (
          <Button
            disabled={!agent}
            className="flex min-w-[160px] items-center gap-2"
            onClick={() => setRunTestModalOpen(true)}
          >
            run test <RocketLaunchIcon className="size-4" />
          </Button>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="flex min-w-[160px] items-center gap-2"
                disabled={!agent}
              >
                run test <RocketLaunchIcon className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="bottom" align="end">
              <div className="flex flex-col gap-2">
                <div className="font-medium">no more free tests</div>
                <div className="text-sm text-muted-foreground">
                  upgrade now to continue using fixa
                </div>
                <Button
                  variant="outline"
                  onClick={upgradePlan}
                  disabled={isGeneratingStripeUrl}
                >
                  {isGeneratingStripeUrl ? <Spinner /> : "upgrade"}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* content */}
      {isLoading ? null : agents && agents.length === 0 ? (
        <div className="flex size-full items-center justify-center">
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-lg font-medium">no agents yet.</div>
              <div className="text-sm text-muted-foreground">
                add an agent to get testing!
              </div>
            </div>
            <AddAgentModal>
              <Button
                className="flex shrink-0 items-center gap-2"
                onClick={() => setRunTestModalOpen(true)}
                disabled={!canRunTest}
              >
                <PlusIcon className="size-4" />
                <span>add agent</span>
              </Button>
            </AddAgentModal>
          </div>
        </div>
      ) : tests.length > 0 ? (
        <div className="container mx-auto p-4">
          <div className="rounded-t-md border-x border-t border-input shadow-sm">
            <AnimatePresence mode="popLayout" initial={false}>
              {tests.map((test) => (
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
      ) : (
        <div className="container mx-auto flex h-full items-center justify-center p-4">
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-lg font-medium">no tests yet.</div>
              <div className="text-sm text-muted-foreground">
                run a test to get started
              </div>
            </div>
            <Button
              className="flex min-w-[216px] shrink-0 items-center gap-2"
              onClick={() => setRunTestModalOpen(true)}
              disabled={!canRunTest}
            >
              run test <RocketLaunchIcon className="size-4" />
            </Button>
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
  onRunTest: (scenarioIds: string[], testAgentIds: string[]) => Promise<void>;
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
    toggleTestAgentEnabled({
      agentId: agent.id,
      testAgentId,
      enabled: !enabledAgents.has(testAgentId),
    });
    setEnabledAgents((prev) => {
      const next = new Set(prev);
      if (next.has(testAgentId)) {
        next.delete(testAgentId);
      } else {
        next.add(testAgentId);
      }
      return next;
    });
  };

  const [loading, setLoading] = useState(false);
  const handleRunTest = useCallback(async () => {
    setLoading(true);
    try {
      await onRunTest(Array.from(selectedScenarios), Array.from(enabledAgents));
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
  }, [onRunTest, selectedScenarios, enabledAgents, onOpenChange, toast]);

  const numTestCalls = useMemo(
    () => selectedScenarios.size * enabledAgents.size,
    [selectedScenarios, enabledAgents],
  );

  const selectAll = useCallback(() => {
    setSelectedScenarios(
      new Set(agent.scenarios.map((scenario) => scenario.id)),
    );
  }, [agent.scenarios]);
  const deselectAll = useCallback(() => {
    setSelectedScenarios(new Set());
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* <DialogContent className="sm:max-w-[800px]"> */}
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <DialogTitle>run test</DialogTitle>
              <DialogDescription>
                select the scenarios to test.
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={selectAll}>
                select all
              </Button>
              <Button variant="ghost" size="sm" onClick={deselectAll}>
                deselect all
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="flex max-h-[80vh] flex-col gap-4 overflow-hidden">
          {agent.scenarios.length > 0 ? (
            <div className="flex flex-col gap-4 overflow-y-auto py-4">
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
            </div>
          ) : (
            <div className="flex h-32 w-fit flex-col items-start justify-center self-center">
              <div className="text-base font-medium">no scenarios yet.</div>
              <Link
                href={`/dashboard/${agent.id}/scenarios`}
                className="text-sm text-muted-foreground underline"
              >
                go to scenarios page
              </Link>
            </div>
          )}
          <Accordion type="single" collapsible>
            <AccordionItem value="test-agents" className="-mx-6 border-none">
              <AccordionTrigger className="px-6 pt-0">
                personas
              </AccordionTrigger>
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
                  {/* <div className="flex h-full cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-muted/50 p-4 text-sm text-muted-foreground hover:bg-muted">
                    <PlusIcon className="size-4" />
                    <span>create custom test agent</span>
                  </div> */}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Button
            onClick={handleRunTest}
            disabled={loading || numTestCalls === 0}
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                initializing
                <Spinner className="size-4" />
              </>
            ) : numTestCalls === 0 ? (
              "run test"
            ) : (
              `run ${numTestCalls} test call${numTestCalls > 1 ? "s" : ""}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
