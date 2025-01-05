import {
  type Agent,
  AgentWithIncludes,
  AgentWithIncludesSchema,
} from "@repo/types/src/index";
import { v4 as uuidv4 } from "uuid";
import { type PrismaClient } from "@repo/db/src/index";
import { type TestAgent } from "@repo/types/src/index";

export class AgentService {
  constructor(private db: PrismaClient) {}
  async createAgent({
    phoneNumber,
    name,
    customerAgentId,
    systemPrompt,
    ownerId,
  }: {
    phoneNumber: string;
    name?: string;
    customerAgentId?: string;
    systemPrompt: string;
    ownerId: string;
  }): Promise<Agent> {
    const existingAgent = await this.db.agent.findFirst({
      where: { customerAgentId, ownerId },
    });

    if (customerAgentId && existingAgent) {
      throw new Error(`Agent ${customerAgentId} already exists!`);
    }

    const testAgents = await this.db.testAgent.findMany({
      where: {
        OR: [{ ownerId }, { ownerId: "SYSTEM" }],
        defaultSelected: true,
        enabled: true,
      },
    });

    const fixaAgentId = uuidv4();

    return await this.db.agent.create({
      data: {
        id: fixaAgentId,
        phoneNumber,
        name: name ?? customerAgentId ?? fixaAgentId,
        customerAgentId: customerAgentId ?? fixaAgentId,
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
    ownerId,
  }: {
    customerAgentId: string;
    ownerId: string;
  }) {
    try {
      const existingAgent = await this.db.agent.findFirst({
        where: { ownerId, customerAgentId },
      });
      if (existingAgent) {
        return existingAgent;
      }
      return await this.db.agent.create({
        data: {
          customerAgentId: customerAgentId,
          ownerId,
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
        generalEvaluations: {
          where: { evaluation: { evaluationTemplate: { deleted: false } } },
          include: {
            evaluation: {
              include: {
                evaluationTemplate: true,
              },
            },
          },
        },
      },
    });
    const parsed = AgentWithIncludesSchema.safeParse(result);
    if (!parsed.success) {
      throw new Error(`Invalid agent data: ${parsed.error.message}`);
    }
    return parsed.data;
  }

  async getAgentByCustomerId(
    customerAgentId: string,
    ownerId: string,
  ): Promise<AgentWithIncludes | null> {
    const result = await this.db.agent.findFirst({
      where: { customerAgentId, ownerId },
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
        generalEvaluations: {
          where: { evaluation: { evaluationTemplate: { deleted: false } } },
          include: {
            evaluation: {
              include: {
                evaluationTemplate: true,
              },
            },
          },
        },
      },
    });
    const parsed = AgentWithIncludesSchema.safeParse(result);
    if (!parsed.success) {
      throw new Error(`Invalid agent data: ${parsed.error.message}`);
    }
    return parsed.data;
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
        generalEvaluations: {
          where: { evaluation: { evaluationTemplate: { deleted: false } } },
          include: {
            evaluation: {
              include: {
                evaluationTemplate: true,
              },
            },
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
