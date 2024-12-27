import {
  type Agent,
  AgentSchema,
  AgentWithIncludes,
} from "@repo/types/src/index";
import { v4 as uuidv4 } from "uuid";
import { type PrismaClient } from "@repo/db/src/index";
import { type TestAgent } from "@repo/types/src/index";

export class AgentService {
  constructor(private db: PrismaClient) {}
  async createAgent(
    phoneNumber: string,
    name: string,
    systemPrompt: string,
    ownerId: string,
  ): Promise<Agent> {
    const testAgents = await this.db.testAgent.findMany({
      where: {
        OR: [{ ownerId }, { ownerId: "SYSTEM" }],
        defaultSelected: true,
        enabled: true,
      },
    });

    return await this.db.agent.create({
      data: {
        id: uuidv4(),
        phoneNumber,
        name,
        systemPrompt,
        enabledTestAgents: {
          connect: testAgents.map((testAgent) => ({
            id: testAgent.id,
          })),
        },
        ownerId,
      },
    });
  }

  async updateAgentName(
    id: string,
    name: string,
    ownerId: string,
  ): Promise<Agent> {
    return await this.db.agent.update({
      where: { id, ownerId },
      data: { name },
    });
  }

  async upsertAgent({
    customerAgentId,
    userId,
  }: {
    customerAgentId: string;
    userId: string;
  }) {
    try {
      const existingAgent = await this.db.agent.findFirst({
        where: { ownerId: userId, customerAgentId },
      });
      if (existingAgent) {
        return existingAgent;
      }
      return await this.db.agent.create({
        data: {
          customerAgentId: customerAgentId,
          ownerId: userId,
          name: customerAgentId,
          phoneNumber: "",
          systemPrompt: "",
        },
      });
    } catch (error) {
      console.error("Error upserting agent", error);
      throw error;
    }
  }

  async getAgent(
    id: string,
    ownerId: string,
  ): Promise<AgentWithIncludes | null> {
    const result = await this.db.agent.findFirst({
      where: id === "new" ? { ownerId } : { id, ownerId },
      include: {
        scenarios: {
          where: { deleted: false },
          orderBy: { createdAt: "asc" },
          include: {
            evaluations: {
              where: { evaluationTemplate: { deleted: false } },
              orderBy: { createdAt: "asc" },
              include: {
                evaluationTemplate: true,
              },
            },
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
        enabledGeneralEvaluations: {
          where: { evaluationTemplate: { deleted: false } },
          include: {
            evaluationTemplate: true,
          },
        },
      },
    });
    return result;
  }

  async getAllAgents(ownerId: string): Promise<Agent[]> {
    // return await db.agent.findMany({ where: {} });
    return await this.db.agent.findMany({ where: { ownerId } });
  }

  async updateAgent({
    id,
    agent,
    ownerId,
  }: {
    id: string;
    agent: Partial<Agent>;
    ownerId: string;
  }): Promise<Agent> {
    return await this.db.agent.update({
      where: { id, ownerId },
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
  ): Promise<TestAgent> {
    return await this.db.testAgent.create({
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

  async getTestAgents(ownerId: string): Promise<TestAgent[]> {
    return await this.db.testAgent.findMany({
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
    ownerId: string,
  ): Promise<Agent> {
    if (enabled) {
      return await this.db.agent.update({
        where: { id: agentId, ownerId },
        data: {
          enabledTestAgents: {
            connect: { id: testAgentId },
          },
        },
      });
    } else {
      return await this.db.agent.update({
        where: { id: agentId },
        data: {
          enabledTestAgents: {
            disconnect: { id: testAgentId },
          },
        },
      });
    }
  }
  async deleteAgent(id: string, ownerId: string): Promise<void> {
    await this.db.agent.delete({ where: { id, ownerId } });
  }
}
