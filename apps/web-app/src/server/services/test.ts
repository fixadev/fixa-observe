import { AgentService } from "./agent";
import { db } from "../db";
import { CallStatus, type PrismaClient } from "@prisma/client";
import { initiateVapiCall } from "../helpers/vapiHelpers";

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
    });
  }

  async run(agentId: string) {
    const agent = await agentServiceInstance.getAgent(agentId);
    if (!agent) {
      throw new Error("Agent not found");
    }
    const tests = agent.enabledTestAgents.flatMap((testAgent) =>
      agent.intents.map((intent) => ({
        testAgentVapiId: testAgent.vapiId,
        intentId: intent.id,
        testAgentPrompt: testAgent.prompt,
        intentPrompt: intent.instructions,
      })),
    );

    console.log("TESTS", tests);

    const calls = await Promise.allSettled(
      tests.map(async (test) => {
        const vapiCall = await initiateVapiCall(
          test.testAgentVapiId,
          agent.phoneNumber,
          test.testAgentPrompt,
          test.intentPrompt,
        );

        console.log("VAPI CALL INITIATED", vapiCall);

        const callId = vapiCall.id;

        return {
          id: callId,
          testAgentVapiId: test.testAgentVapiId,
          intentId: test.intentId,
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
      intentId: string;
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
              intentId: call.value.intentId,
            })),
          },
        },
      },
    });
  }
}
