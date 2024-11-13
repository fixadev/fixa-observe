import { db } from "../db";
import { type Intent, type IntentWithoutId } from "~/lib/agent";
import { v4 as uuidv4 } from "uuid";
import { type PrismaClient } from "@prisma/client";
import { generateIntentsFromPrompt } from "../helpers/generateIntents";
// import { createVapiAssistant } from "../helpers/vapiHelpers";

export class AgentService {
  constructor(private db: PrismaClient) {}
  async createAgent(
    phoneNumber: string,
    name: string,
    systemPrompt: string,
    intents: IntentWithoutId[],
    ownerId: string,
  ) {
    const testAgents = await db.testAgent.findMany({
      where: {
        OR: [{ ownerId }, { ownerId: "SYSTEM" }],
      },
    });

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
        enabledTestAgents: {
          connect: testAgents.map((testAgent) => ({
            id: testAgent.id,
          })),
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
        enabledTestAgents: true,
      },
    });
  }

  async getAllAgents(ownerId: string) {
    // return await db.agent.findMany({ where: {} });
    return await db.agent.findMany({ where: { ownerId } });
  }

  // async createTestAgent(
  //   name: string,
  //   prompt: string,
  //   ownerId: string,
  //   headshotUrl: string,
  //   description: string,
  // ) {
  //   const agent = await createVapiAssistant(prompt, name);

  //   return await db.testAgent.create({
  //     data: {
  //       id: agent.id,
  //       name,
  //       prompt,
  //       ownerId,
  //       headshotUrl,
  //       description,
  //     },
  //   });
  // }

  async getTestAgents(ownerId: string) {
    return await db.testAgent.findMany({
      where: {
        OR: [{ ownerId }, { ownerId: "SYSTEM" }],
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
            connect: { id: testAgentId },
          },
        },
      });
    } else {
      return await db.agent.update({
        where: { id: agentId },
        data: {
          enabledTestAgents: {
            disconnect: { id: testAgentId },
          },
        },
      });
    }
  }

  async updateAgentIntents(id: string, intents: Intent[]) {
    return await db.agent.update({
      where: { id },
      data: {
        intents: {
          upsert: intents.map(({ agentId, ...intent }) => ({
            where: { id: intent.id },
            update: intent,
            create: intent,
          })),
        },
      },
    });
  }
}
