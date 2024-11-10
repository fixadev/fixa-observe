import { type TestAgent, type IntentWithoutId } from "~/lib/agent";
import { createTestAgents } from "../helpers/createTestAgents";
import { v4 as uuidv4 } from "uuid";
import { AgentService } from "./agent";
import { db } from "../db";
import { type PrismaClient } from "@prisma/client";
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
      testAgents.map((testAgent) =>
        initiateVapiCall(testAgent.vapiId, agent.phoneNumber),
      ),
    );

    const callIds = calls.map((call) => call.id);

    return await db.test.create({
      data: {
        agentId,
        inProgressCallIds: callIds,
      },
    });
  }
}
