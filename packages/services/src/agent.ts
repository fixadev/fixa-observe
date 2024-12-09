import { type Agent, AgentSchema, AgentWithIncludes } from "@repo/types";
import { v4 as uuidv4 } from "uuid";
import { type PrismaClient, type TestAgent } from "@repo/db";

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

  async updateAgentName(id: string, name: string): Promise<Agent> {
    return await this.db.agent.update({
      where: { id },
      data: { name },
    });
  }

  async upsertAgent(agent: Partial<Agent>, ownerId: string): Promise<Agent> {
    if (agent.id) {
      return await this.db.agent.upsert({
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
      const existingAgent = await this.db.agent.findFirst({
        where: { customerAgentId: agent.customerAgentId, ownerId },
      });

      if (existingAgent) {
        return await this.db.agent.update({
          where: { id: existingAgent.id },
          data: {
            ...agent,
            extraProperties: agent.extraProperties ?? undefined,
          },
        });
      }
      return await this.db.agent.create({
        data: {
          ...AgentSchema.parse(agent),
          extraProperties: agent.extraProperties ?? undefined,
          ownerId,
        },
      });
    }
    throw new Error("Either id or customerAgentId must be provided");
  }

  async getAgent(id: string): Promise<AgentWithIncludes | null> {
    const result = await this.db.agent.findUnique({
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
    console.log("AGENT", result?.scenarios[0]?.evals);
    return result;
  }

  async getAllAgents(ownerId: string): Promise<Agent[]> {
    // return await db.agent.findMany({ where: {} });
    return await this.db.agent.findMany({ where: { ownerId } });
  }

  async updateAgent({
    id,
    agent,
  }: {
    id: string;
    agent: Partial<Agent>;
  }): Promise<Agent> {
    return await this.db.agent.update({
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
  ): Promise<Agent> {
    if (enabled) {
      return await this.db.agent.update({
        where: { id: agentId },
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
  async deleteAgent(id: string): Promise<void> {
    await this.db.agent.delete({ where: { id } });
  }
}
