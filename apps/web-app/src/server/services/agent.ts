import { db } from "../db";
import { type IntentWithoutId, type TestAgentWithoutId } from "~/lib/agent";
import { createTestAgents } from "../helpers/createTestAgents";
import { v4 as uuidv4 } from "uuid";
import { type PrismaClient } from "@prisma/client";

export class AgentService {
  constructor(private db: PrismaClient) {}
  async createAgent(
    phoneNumber: string,
    name: string,
    prompt: string,
    intents: IntentWithoutId[],
    ownerId: string,
  ) {
    return await db.agent.create({
      data: {
        id: uuidv4(),
        phoneNumber,
        name,
        systemPrompt: prompt,
        intents: {
          createMany: {
            data: intents,
          },
        },
        ownerId,
      },
    });
  }

  async getAgent(id: string) {
    return await db.agent.findUnique({
      where: { id },
      include: {
        intents: true,
      },
    });
  }

  async createTestAgents(agentId: string) {
    const agent = await this.getAgent(agentId);
    if (!agent) {
      throw new Error("Agent not found");
    }
    const testAgentTemplates = await db.testAgent.findMany();

    const testAgentsToCreate: TestAgentWithoutId[] = await createTestAgents(
      testAgentTemplates,
      agent,
      agent?.intents,
    );

    return await db.testAgent.createMany({
      data: testAgentsToCreate.map((testAgent) => ({
        ...testAgent,
      })),
    });
  }
}
