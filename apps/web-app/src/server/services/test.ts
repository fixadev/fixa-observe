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
    const testAgents = await db.testAgent.findMany({
      where: {
        agentId,
      },
    });

    const calls = await Promise.all(
      testAgents.map(async (testAgent) => {
        const { id: callId } = await initiateVapiCall(
          testAgent.vapiId,
          agent.phoneNumber,
        );
        return {
          id: callId,
          testAgentId: testAgent.id,
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
              status: CallStatus.in_progress,
              stereoRecordingUrl: "",
              testAgentId: call.testAgentId,
            })),
          },
        },
      },
    });
  }
}
