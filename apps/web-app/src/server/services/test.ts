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
        testAgentId: testAgent.testAgentId,
        intentId: intent.id,
        testAgentPrompt: testAgent.testAgent.prompt,
        intentPrompt: intent.instructions,
      })),
    );

    console.log("TESTS", tests);

    const calls = await Promise.all(
      tests.map(async (test) => {
        const vapiCall = await initiateVapiCall(
          test.testAgentId,
          agent.phoneNumber,
          test.testAgentPrompt,
          test.intentPrompt,
        );

        console.log("VAPI CALL INITIATED", vapiCall);

        const callId = vapiCall.id;

        return {
          id: callId,
          testAgentId: test.testAgentId,
          intentId: test.intentId,
          status: CallStatus.in_progress,
        };
      }),
    );

    return await db.test.create({
      data: {
        agentId,
        calls: {
          createMany: {
            data: calls.map((call) => ({
              id: call.id,
              status: call.status,
              stereoRecordingUrl: "",
              testAgentId: call.testAgentId,
              intentId: call.intentId,
            })),
          },
        },
      },
    });
  }
}
