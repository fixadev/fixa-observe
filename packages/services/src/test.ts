import { CallStatus, type PrismaClient } from "@repo/db/src/index";
import { VapiService } from "./vapi";
import { type TestAgent } from "@repo/types/src/generated";
import {
  TestWithIncludesSchema,
  type OfOneKioskProperties,
  type TestWithIncludes,
} from "@repo/types/src/index";
import { randomUUID } from "crypto";
import { AgentService } from "./agent";
import { ClerkService } from "./clerk";
import { StripeService } from "./ee/stripe";
import axios from "axios";
import { type PostHog } from "posthog-node";

export class TestService {
  private env: { NODE_SERVER_URL: string; NODE_SERVER_SECRET: string };

  constructor(
    private db: PrismaClient,
    private posthogClient: PostHog,
  ) {
    this.env = {
      NODE_SERVER_URL:
        process.env.NODE_SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL!,
      NODE_SERVER_SECRET: process.env.NODE_SERVER_SECRET!,
    };
    this.checkEnv();
    this.agentServiceInstance = new AgentService(this.db);
    this.orgServiceInstance = new ClerkService(this.db);
    this.stripeServiceInstance = new StripeService(this.db);
    this.vapiServiceInstance = new VapiService(this.db);
  }

  private checkEnv = () => {
    if (!process.env.NODE_SERVER_URL && !process.env.NEXT_PUBLIC_SERVER_URL) {
      throw new Error("NODE_SERVER_URL or NEXT_PUBLIC_SERVER_URL is not set");
    }
    if (!process.env.NODE_SERVER_SECRET) {
      throw new Error("NODE_SERVER_SECRET is not set");
    }
  };
  agentServiceInstance: AgentService;
  orgServiceInstance: ClerkService;
  stripeServiceInstance: StripeService;
  vapiServiceInstance: VapiService;

  async get(id: string, ownerId: string): Promise<TestWithIncludes | null> {
    const test = await this.db.test.findUnique({
      where: {
        id,
        agent: {
          ownerId,
        },
      },
      include: {
        calls: {
          include: {
            testAgent: true,
            messages: {
              orderBy: {
                time: "asc",
              },
            },
            errors: true,
            scenario: {
              include: {
                evaluations: {
                  include: {
                    evaluationTemplate: true,
                  },
                },
              },
            },
            evaluationResults: {
              include: {
                evaluation: {
                  include: {
                    evaluationTemplate: true,
                  },
                },
              },
            },
            latencyBlocks: true,
            interruptions: true,
          },
        },
      },
    });

    const parsed = TestWithIncludesSchema.safeParse(test);
    if (!parsed.success) {
      throw new Error(`Couldn't parse test data: ${parsed.error.message}`);
    }
    return parsed.data;
  }

  async getAll(agentId: string, ownerId: string) {
    return await this.db.test.findMany({
      where: {
        agentId,
        agent: {
          ownerId,
        },
      },
      include: {
        calls: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getStatus(testId: string, ownerId: string) {
    const test = await this.db.test.findUnique({
      where: { id: testId, agent: { ownerId } },
      select: {
        calls: {
          select: {
            id: true,
            result: true,
            status: true,
          },
        },
      },
    });

    if (!test) {
      return { status: "not_found" };
    }

    const isCompleted = test.calls.every(
      (call) => call.status === CallStatus.completed,
    );

    return isCompleted
      ? { status: CallStatus.completed, calls: test.calls }
      : { status: CallStatus.in_progress, calls: test.calls };
  }

  async run({
    ownerId,
    agentId,
    scenarioIds,
    testAgentIds,
    runFromApi = false,
  }: {
    ownerId: string;
    agentId: string;
    scenarioIds?: string[];
    testAgentIds?: string[];
    runFromApi?: boolean;
  }) {
    // Make sure user can run this test - check free tests left and subscription
    const orgData = await this.orgServiceInstance.getPublicMetadata({
      orgId: ownerId,
    });
    if (!orgData) {
      throw new Error("Org not found");
    }

    const bypassPayment = await this.posthogClient.getFeatureFlag(
      "bypass-payment",
      ownerId,
      {
        groups: {
          organization: ownerId,
        },
      },
    );
    if (!bypassPayment) {
      // Check if user has free tests left or subscription
      const noFreeTestsLeft =
        !orgData.freeTestsLeft ||
        (orgData.freeTestsLeft && orgData.freeTestsLeft <= 0);
      let hasActiveSubscription = false;
      if (orgData.stripeCustomerId) {
        const subscriptions =
          await this.stripeServiceInstance.getSubscriptions(ownerId);
        if (subscriptions.data.length > 0) {
          hasActiveSubscription = true;
        }
      }
      if (noFreeTestsLeft && !hasActiveSubscription) {
        throw new Error(
          "User has no free tests left and no active subscription",
        );
      }

      // If user has free tests left, deduct one
      if (orgData.freeTestsLeft && orgData.freeTestsLeft > 0) {
        await this.orgServiceInstance.decrementFreeTestsLeft({
          orgId: ownerId,
        });
      }
    }

    const agent = await this.agentServiceInstance.getAgent(agentId, ownerId);
    if (!agent) {
      throw new Error("Agent not found");
    }

    let enabledTestAgents: TestAgent[] = [];
    if (testAgentIds && testAgentIds.length > 0) {
      const testAgents = await this.agentServiceInstance.getTestAgents(
        agent.ownerId,
      );
      enabledTestAgents = testAgents.filter((testAgent) =>
        testAgentIds.includes(testAgent.id),
      );
    } else {
      enabledTestAgents = agent.enabledTestAgents;
    }

    const tests = enabledTestAgents.flatMap((testAgent) =>
      (scenarioIds && scenarioIds.length > 0
        ? agent.scenarios.filter((scenario) =>
            scenarioIds.includes(scenario.id),
          )
        : agent.scenarios
      ).map((scenario) => ({
        testAgentVapiId: testAgent.id,
        scenarioId: scenario.id,
        testAgentPrompt: testAgent.prompt,
        scenarioPrompt: scenario.instructions,
      })),
    );

    // OFONE KIOSK TEST
    if (
      agent.extraProperties &&
      (agent.extraProperties as Record<string, unknown>).type === "ofone-kiosk"
    ) {
      const extraProperties = agent.extraProperties as OfOneKioskProperties;
      const deviceIds = extraProperties.deviceIds;
      console.log(
        " <<<<<<<<<<<<<<<<<<<< running KIOSK TEST >>>>>>>>>>>>>>>>>>>>> ",
      );

      const callsToStart = tests.map((test) => ({
        callId: randomUUID(),
        ownerId: agent.ownerId,
        assistantId: test.testAgentVapiId,
        testAgentPrompt: test.testAgentPrompt,
        scenarioPrompt: test.scenarioPrompt,
        baseUrl: extraProperties.baseUrl,
        scenarioId: test.scenarioId,
      }));

      // create calls first and then queue them
      const test = await this.db.test.create({
        data: {
          agentId,
          runFromApi,
          calls: {
            createMany: {
              data: callsToStart.map((call) => ({
                id: call.callId,
                status: CallStatus.queued,
                stereoRecordingUrl: "",
                testAgentId: call.assistantId,
                scenarioId: call.scenarioId,
                ownerId: agent.ownerId,
              })),
            },
          },
        },
        include: {
          calls: {
            include: {
              scenario: {
                include: {
                  evaluations: {
                    include: {
                      evaluationTemplate: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      await this.queueOfOneKioskCalls(deviceIds, callsToStart);
      return test;

      // NORMAL TEST
    } else {
      const calls = await Promise.allSettled(
        tests.map(async (test) => {
          const vapiCall = await this.vapiServiceInstance.initiateVapiCall(
            test.testAgentVapiId,
            agent.phoneNumber,
            test.testAgentPrompt,
            test.scenarioPrompt,
          );

          return {
            id: randomUUID(),
            vapiCallId: vapiCall.id,
            testAgentVapiId: test.testAgentVapiId,
            scenarioId: test.scenarioId,
            status: CallStatus.in_progress,
          };
        }),
      );

      const fulfilledCalls = calls.filter(
        (call) => call.status === "fulfilled",
      ) as PromiseFulfilledResult<{
        id: string;
        testAgentVapiId: string;
        scenarioId: string;
        status: CallStatus;
        vapiCallId: string;
      }>[];

      return await this.db.test.create({
        data: {
          agentId,
          runFromApi,
          calls: {
            createMany: {
              data: fulfilledCalls.map((call) => ({
                id: call.value.id,
                status: call.value.status,
                stereoRecordingUrl: "",
                vapiCallId: call.value.vapiCallId,
                testAgentId: call.value.testAgentVapiId,
                scenarioId: call.value.scenarioId,
                ownerId: agent.ownerId,
              })),
            },
          },
        },
        include: {
          calls: true,
        },
      });
    }
  }

  async getLastTest(agentId: string, ownerId: string) {
    return await this.db.test.findFirst({
      where: {
        agentId,
        agent: {
          ownerId,
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async queueOfOneKioskCalls(
    deviceIds: string[],
    callsToStart: {
      callId: string;
      ownerId: string;
      assistantId: string;
      testAgentPrompt: string;
      scenarioPrompt: string;
      baseUrl: string;
    }[],
  ) {
    try {
      return await axios.post(
        this.env.NODE_SERVER_URL + "/internal/queue-ofone-kiosk-calls",
        {
          deviceIds,
          callsToStart,
        },
        {
          headers: {
            "x-internal-secret": this.env.NODE_SERVER_SECRET,
          },
        },
      );
    } catch (error) {
      console.error("Error queuing OFONE kiosk calls", error);
      throw error;
    }
  }
}
