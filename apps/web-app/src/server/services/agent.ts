import { db } from "../db";
import { type TestAgent, type IntentWithoutId } from "~/lib/agent";
import { createTestAgents } from "../helpers/createTestAgents";
import { v4 as uuidv4 } from "uuid";

export class AgentService {
  async createAgent(
    phoneNumber: string,
    prompt: string,
    intents: IntentWithoutId[],
  ) {
    return await db.agent.create({
      data: {
        id: uuidv4(),
        phoneNumber,
        systemPrompt: prompt,
        intents: {
          createMany: {
            data: intents,
          },
        },
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

    const testAgentsToCreate: TestAgent[] = await createTestAgents(
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
