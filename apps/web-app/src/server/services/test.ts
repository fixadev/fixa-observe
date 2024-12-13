import { AgentService } from "@repo/services/src/agent";
import { CallStatus, type PrismaClient } from "@prisma/client";
import { initiateVapiCall, queueOfOneKioskCalls } from "../helpers/vapiHelpers";
import { type TestAgent } from "@repo/types/src/generated";
import {
  type OfOneKioskProperties,
  type TestWithIncludes,
} from "@repo/types/src/index";
import { randomUUID } from "crypto";
import { UserService } from "@repo/services/src/user";
import { StripeService } from "@repo/services/src/stripe";

export class TestService {
  constructor(private db: PrismaClient) {
    this.agentServiceInstance = new AgentService(this.db);
    this.userServiceInstance = new UserService(this.db);
    this.stripeServiceInstance = new StripeService(this.db);
  }
  agentServiceInstance: AgentService;
  userServiceInstance: UserService;
  stripeServiceInstance: StripeService;

  async get(id: string, userId: string): Promise<TestWithIncludes | null> {
    return await this.db.test.findUnique({
      where: {
        id,
        agent: {
          ownerId: userId,
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
                evals: true,
              },
            },
            evalResults: {
              include: {
                eval: true,
              },
            },
            latencyBlocks: true,
            interruptions: true,
          },
        },
      },
    });
  }

  async getAll(agentId: string, userId: string) {
    return await this.db.test.findMany({
      where: {
        agentId,
        agent: {
          ownerId: userId,
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

  async getStatus(testId: string, userId: string) {
    const test = await this.db.test.findUnique({
      where: { id: testId, agent: { ownerId: userId } },
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
    userId,
    agentId,
    scenarioIds,
    testAgentIds,
    runFromApi = false,
  }: {
    userId: string;
    agentId: string;
    scenarioIds?: string[];
    testAgentIds?: string[];
    runFromApi?: boolean;
  }) {
    // Make sure user can run this test - check free tests left and subscription
    const userData = await this.userServiceInstance.getPublicMetadata(userId);
    if (!userData) {
      throw new Error("User not found");
    }
    const noFreeTestsLeft =
      !userData.freeTestsLeft ||
      (userData.freeTestsLeft && userData.freeTestsLeft <= 0);
    let hasActiveSubscription = false;
    if (userData.stripeCustomerId) {
      const subscriptions =
        await this.stripeServiceInstance.getSubscriptions(userId);
      if (subscriptions.data.length > 0) {
        hasActiveSubscription = true;
      }
    }
    if (noFreeTestsLeft && !hasActiveSubscription) {
      throw new Error("User has no free tests left and no active subscription");
    }

    // If user has free tests left, deduct one
    if (userData.freeTestsLeft && userData.freeTestsLeft > 0) {
      await this.userServiceInstance.decrementFreeTestsLeft(userId);
    }

    const agent = await this.agentServiceInstance.getAgent(agentId, userId);
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
          calls: true,
        },
      });
      await queueOfOneKioskCalls(deviceIds, callsToStart);
      return test;

      // NORMAL TEST
    } else {
      const calls = await Promise.allSettled(
        tests.map(async (test) => {
          const vapiCall = await initiateVapiCall(
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

  async getLastTest(agentId: string, userId: string) {
    return await this.db.test.findFirst({
      where: {
        agentId,
        agent: {
          ownerId: userId,
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
