import { db } from "../db";
import {
  type CreateScenarioSchema,
  type UpdateScenarioSchema,
} from "~/lib/agent";
import { v4 as uuidv4 } from "uuid";
import { type PrismaClient } from "@prisma/client";

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

  async getAgent(id: string) {
    return await db.agent.findUnique({
      where: { id },
      include: {
        scenarios: {
          include: {
            evals: true,
          },
        },
        enabledTestAgents: true,
      },
    });
  }

  async getAllAgents(ownerId: string) {
    // return await db.agent.findMany({ where: {} });
    return await db.agent.findMany({ where: { ownerId } });
  }

  async updateAgentSettings({
    id,
    phoneNumber,
    name,
  }: {
    id: string;
    phoneNumber: string;
    name: string;
  }) {
    return await db.agent.update({
      where: { id },
      data: { phoneNumber, name },
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

  async createScenario(agentId: string, scenario: CreateScenarioSchema) {
    return await db.scenario.create({
      data: {
        id: uuidv4(),
        agentId,
        name: scenario.name,
        instructions: scenario.instructions,
        successCriteria: scenario.successCriteria,
        evals: {
          createMany: {
            data: scenario.evals.map((evaluation) => ({
              ...evaluation,
              id: uuidv4(),
            })),
          },
        },
      },
      include: {
        evals: true,
      },
    });
  }

  async createScenarios(agentId: string, scenarios: CreateScenarioSchema[]) {
    const transactions = scenarios.map((scenario) => {
      return db.scenario.create({
        data: {
          id: uuidv4(),
          agentId,
          name: scenario.name,
          instructions: scenario.instructions,
          successCriteria: scenario.successCriteria,
          evals: {
            createMany: {
              data: scenario.evals.map((evaluation) => ({
                ...evaluation,
                id: uuidv4(),
              })),
            },
          },
        },
        include: {
          evals: true,
        },
      });
    });
    return await db.$transaction(transactions);
  }

  async updateScenario(scenario: UpdateScenarioSchema) {
    return await db.scenario.update({
      where: { id: scenario.id },
      data: {
        name: scenario.name,
        instructions: scenario.instructions,
        successCriteria: scenario.successCriteria,
        evals: {
          deleteMany: {},
          createMany: { data: scenario.evals },
        },
      },
      include: {
        evals: true,
      },
    });
  }

  async deleteScenario(id: string) {
    return await db.scenario.delete({ where: { id } });
  }
}
