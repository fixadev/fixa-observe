import { db } from "../db";
import { type CreateScenarioSchema } from "~/lib/scenario";
import { v4 as uuidv4 } from "uuid";
import { type PrismaClient } from "@prisma/client";
import { type Agent, AgentSchema } from "prisma/generated/zod";

export class AgentService {
  constructor(private db: PrismaClient) {}
  async createAgent(
    phoneNumber: string,
    name: string,
    systemPrompt: string,
    scenarios: CreateScenarioSchema[],
    ownerId: string,
  ) {
    const testAgents = await db.testAgent.findMany({
      where: {
        OR: [{ ownerId }, { ownerId: "SYSTEM" }],
        defaultSelected: true,
        enabled: true,
      },
    });

    return await db.agent.create({
      data: {
        id: uuidv4(),
        phoneNumber,
        name,
        systemPrompt,
        scenarios: {
          createMany: {
            data: scenarios,
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

  async updateAgentName(id: string, name: string) {
    return await db.agent.update({
      where: { id },
      data: { name },
    });
  }

  async upsertAgent(agent: Partial<Agent>, ownerId: string) {
    if (agent.id) {
      return await db.agent.upsert({
        where: { id: agent.id },
        update: {
          ...agent,
          extraProperties: agent.extraProperties ?? undefined,
        },
        create: {
          ...AgentSchema.parse(agent),
          extraProperties: agent.extraProperties ?? undefined,
          ownerId,
        },
      });
    } else if (agent.customerAgentId) {
      const existingAgent = await db.agent.findFirst({
        where: { customerAgentId: agent.customerAgentId, ownerId },
      });

      if (existingAgent) {
        return await db.agent.update({
          where: { id: existingAgent.id },
          data: {
            ...agent,
            extraProperties: agent.extraProperties ?? undefined,
          },
        });
      }
      return await db.agent.create({
        data: {
          ...AgentSchema.parse(agent),
          extraProperties: agent.extraProperties ?? undefined,
          ownerId,
        },
      });
    }
    throw new Error("Either id or customerAgentId must be provided");
  }

  async getAgent(id: string) {
    return await db.agent.findUnique({
      where: { id },
      include: {
        scenarios: {
          where: { deleted: false },
          orderBy: { createdAt: "asc" },
          include: {
            evals: { where: { deleted: false }, orderBy: { createdAt: "asc" } },
            generalEvalOverrides: true,
          },
        },
        tests: {
          include: {
            calls: true,
          },
        },
        enabledTestAgents: {
          where: { enabled: true },
        },
        enabledGeneralEvals: true,
      },
    });
  }

  async getAllAgents(ownerId: string) {
    // return await db.agent.findMany({ where: {} });
    return await db.agent.findMany({ where: { ownerId } });
  }

  async updateAgent({ id, agent }: { id: string; agent: Partial<Agent> }) {
    return await db.agent.update({
      where: { id },
      data: {
        ...agent,
        extraProperties: agent.extraProperties ?? undefined,
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
    return await db.testAgent.create({
      data: {
        id: uuidv4(),
        name,
        prompt,
        ownerId,
        headshotUrl,
        description,
      },
    });
  }

  async getTestAgents(ownerId: string) {
    return await db.testAgent.findMany({
      where: {
        OR: [{ ownerId }, { ownerId: "SYSTEM" }],
        enabled: true,
      },
      orderBy: { order: "asc" },
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
  async deleteAgent(id: string) {
    return await db.agent.delete({ where: { id } });
  }
}
