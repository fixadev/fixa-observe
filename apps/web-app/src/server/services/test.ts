import { AgentService } from "./agent";
import { db } from "../db";
import { CallStatus, type PrismaClient } from "@prisma/client";
import { initiateVapiCall } from "../helpers/vapiHelpers";
import { type TestAgent } from "prisma/generated/zod";

const agentServiceInstance = new AgentService(db);

export class TestService {
  constructor(private db: PrismaClient) {}

  async get(id: string) {
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
            scenario: true,
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
            status: true,
          },
        },
      },
    });

    if (!test) return "not_found";

    return test.calls.every((call) => call.status === CallStatus.completed)
      ? CallStatus.completed
      : CallStatus.in_progress;
  }

  async run(agentId: string, scenarioIds?: string[], testAgentIds?: string[]) {
    const agent = await agentServiceInstance.getAgent(agentId);
    if (!agent) {
      throw new Error("Agent not found");
    }

    let enabledTestAgents: TestAgent[] = [];
    if (testAgentIds) {
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

    console.log("TESTS", tests);

    const calls = await Promise.allSettled(
      tests.map(async (test) => {
        const vapiCall = await initiateVapiCall(
          test.testAgentVapiId,
          agent.phoneNumber,
          test.testAgentPrompt,
          test.scenarioPrompt,
        );

        console.log("VAPI CALL INITIATED", vapiCall);

        const callId = vapiCall.id;

        return {
          id: callId,
          testAgentVapiId: test.testAgentVapiId,
          scenarioId: test.scenarioId,
          status: CallStatus.in_progress,
        };
      }),
    );

    console.log("CALLS", calls);

    const fulfilledCalls = calls.filter(
      (call) => call.status === "fulfilled",
    ) as PromiseFulfilledResult<{
      id: string;
      testAgentVapiId: string;
      scenarioId: string;
      status: CallStatus;
    }>[];

    return await db.test.create({
      data: {
        agentId,
        calls: {
          createMany: {
            data: fulfilledCalls.map((call) => ({
              id: call.value.id,
              status: call.value.status,
              stereoRecordingUrl: "",
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
