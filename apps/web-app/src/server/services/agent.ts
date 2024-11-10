import { db } from "../db";
import { type IntentWithoutId, type TestAgentWithoutId } from "~/lib/agent";
import { v4 as uuidv4 } from "uuid";
import { type PrismaClient } from "@prisma/client";
import { generateIntentsFromPrompt } from "../helpers/generateIntents";
import { createVapiAssistant } from "../helpers/vapiHelpers";

export class AgentService {
  constructor(private db: PrismaClient) {}
  async createAgent(
    phoneNumber: string,
    name: string,
    systemPrompt: string,
    intents: IntentWithoutId[],
    ownerId: string,
  ) {
    return await db.agent.create({
      data: {
        id: uuidv4(),
        phoneNumber,
        name,
        systemPrompt,
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
        enabledTestAgents: {
          include: {
            testAgent: true,
          },
        },
      },
    });
  }

  async createTestAgent(
    name: string,
    prompt: string,
    ownerId: string,
    headshotUrl: string,
    description: string,
  ) {
    const agent = await createVapiAssistant(prompt);

    return await db.testAgent.create({
      data: {
        id: uuidv4(),
        name,
        prompt,
        ownerId,
        headshotUrl,
        description,
        vapiId: agent.id,
      },
    });
  }

  async toggleTestAgentEnabled(
    agentId: string,
    testAgentId: string,
    enabled: boolean,
  ) {
    if (enabled) {
      return await db.agent.update({
        where: { id: agentId },
        data: {
          enabledTestAgents: {
            create: { testAgentId },
          },
        },
      });
    } else {
      return await db.agent.update({
        where: { id: agentId },
        data: {
          enabledTestAgents: {
            deleteMany: { testAgentId },
          },
        },
      });
    }
  }

  async generateIntentsFromPrompt(prompt: string) {
    return await generateIntentsFromPrompt(prompt);
  }
}
