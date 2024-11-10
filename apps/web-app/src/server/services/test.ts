import { type TestAgent, type IntentWithoutId } from "~/lib/agent";
import { createTestAgents } from "../helpers/createTestAgents";
import { v4 as uuidv4 } from "uuid";
import { AgentService } from "./agent";
import { db } from "../db";
import { CallResult, CallStatus, type PrismaClient } from "@prisma/client";
import { initiateVapiCall } from "../helpers/vapiHelpers";

const agentServiceInstance = new AgentService(db);

export class TestService {
  constructor(private db: PrismaClient) {}

  async getTest(id: string) {
    return await db.test.findUnique({
      where: {
        id,
      },
    });
  }

  async runTestSuite(agentId: string) {
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
