import { AgentService } from "./agent";
import { db } from "../db";
import { CallStatus, type PrismaClient } from "@prisma/client";
import { initiateVapiCall, queueOfOneKioskCalls } from "../helpers/vapiHelpers";
import { type TestAgent } from "prisma/generated/zod";
import { type OfOneKioskProperties, type TestWithIncludes } from "~/lib/types";
import { randomUUID } from "crypto";

const agentServiceInstance = new AgentService(db);

export class TestService {
  constructor(private db: PrismaClient) {}

  async get(id: string): Promise<TestWithIncludes | null> {
    return await db.test.findUnique({
      where: {
        id,
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

  async getAll(agentId: string) {
    return await db.test.findMany({
      where: {
        agentId,
      },
      include: {
        calls: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getStatus(testId: string) {
    const test = await db.test.findUnique({
      where: { id: testId },
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
    agentId,
    scenarioIds,
    testAgentIds,
    runFromApi = false,
  }: {
    agentId: string;
    scenarioIds?: string[];
    testAgentIds?: string[];
    runFromApi?: boolean;
  }) {
    const agent = await agentServiceInstance.getAgent(agentId);
    if (!agent) {
      throw new Error("Agent not found");
    }

    let enabledTestAgents: TestAgent[] = [];
    if (testAgentIds && testAgentIds.length > 0) {
      const testAgents = await agentServiceInstance.getTestAgents(
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
      const test = await db.test.create({
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

      return await db.test.create({
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

  async getLastTest(agentId: string) {
    return await db.test.findFirst({
      where: { agentId },
      orderBy: { createdAt: "desc" },
    });
  }
}
