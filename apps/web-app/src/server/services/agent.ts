import { db } from "../db";
import {
  type CreateScenarioSchema,
  type UpdateScenarioSchema,
  type EvalSchema,
  type EvalOverrideWithoutScenarioId,
  type CreateEvalOverrideSchema,
  type CreateGeneralEvalSchema,
} from "~/lib/agent";
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

  async createScenario(agentId: string, scenario: CreateScenarioSchema) {
    return await db.scenario.create({
      data: {
        ...scenario,
        id: uuidv4(),
        agentId,
        createdAt: new Date(),
        evals: {
          createMany: {
            data: scenario.evals.map((evaluation) => ({
              ...evaluation,
              id: uuidv4(),
            })),
          },
        },
        generalEvalOverrides: {
          createMany: {
            data: scenario.generalEvalOverrides.map((override) => ({
              ...override,
              id: uuidv4(),
            })),
          },
        },
      },
      include: {
        evals: { orderBy: { createdAt: "asc" } },
        generalEvalOverrides: { orderBy: { createdAt: "asc" } },
      },
    });
  }

  async createScenarios(agentId: string, scenarios: CreateScenarioSchema[]) {
    return await db.$transaction(async (tx) => {
      return await Promise.all(
        scenarios.map((scenario) =>
          tx.scenario.create({
            data: {
              ...scenario,
              id: uuidv4(),
              agentId,
              createdAt: new Date(),
              evals: {
                createMany: {
                  data: scenario.evals.map((evaluation) => ({
                    ...evaluation,
                    id: uuidv4(),
                  })),
                },
              },
              generalEvalOverrides: {},
            },
            include: {
              evals: { orderBy: { createdAt: "asc" } },
              generalEvalOverrides: { orderBy: { createdAt: "asc" } },
            },
          }),
        ),
      );
    });
  }

  async updateScenario(scenario: UpdateScenarioSchema) {
    const priorEvals = await db.eval.findMany({
      where: { scenarioId: scenario.id },
    });

    const evaluationsToDelete = priorEvals.filter(
      (priorEvaluation) =>
        !scenario.evals.some(
          (newEvaluation) => newEvaluation.id === priorEvaluation.id,
        ),
    );

    const evaluationsToUpdate = scenario.evals.filter((evaluation) =>
      priorEvals.some((priorEval) => priorEval.id === evaluation.id),
    );

    const evaluationsToCreate = scenario.evals.filter(
      (evaluation) =>
        !priorEvals.some((priorEval) => priorEval.id === evaluation.id),
    );

    const priorOverrides = await db.evalOverride.findMany({
      where: { scenarioId: scenario.id },
    });

    // TODO: fix this
    const evalOverridesToDelete = scenario.generalEvalOverrides.filter(
      (override) =>
        "id" in override &&
        priorOverrides.some(
          (priorOverride) => priorOverride.id === override.id,
        ),
    ) as EvalOverrideWithoutScenarioId[];

    const evalOverridesToUpdate = scenario.generalEvalOverrides.filter(
      (override) =>
        "id" in override &&
        priorOverrides.some(
          (priorOverride) => priorOverride.id === override.id,
        ),
    ) as EvalOverrideWithoutScenarioId[];

    const evalOverridesToCreate = scenario.generalEvalOverrides.filter(
      (override) => !("id" in override),
    ) as CreateEvalOverrideSchema[];

    return await db.scenario.update({
      where: { id: scenario.id },
      data: {
        ...scenario,
        evals: {
          updateMany: [
            ...evaluationsToDelete.map((evaluation) => ({
              where: { id: evaluation.id },
              data: { deleted: true },
            })),
            ...evaluationsToUpdate.map((evaluation) => ({
              where: { id: evaluation.id },
              data: evaluation,
            })),
          ],
          createMany: {
            data: evaluationsToCreate.map((evaluation) => ({
              ...evaluation,
              id: uuidv4(),
            })),
          },
        },
        generalEvalOverrides: {
          updateMany: [
            ...evalOverridesToDelete.map((override) => ({
              where: { id: override.id },
              data: { deleted: true },
            })),
            ...evalOverridesToUpdate.map((override) => ({
              where: { id: override.id },
              data: override,
            })),
          ],
          createMany: {
            data: evalOverridesToCreate.map((override) => ({
              ...override,
              id: uuidv4(),
            })),
          },
        },
      },
      include: {
        evals: { orderBy: { createdAt: "asc" } },
        generalEvalOverrides: { orderBy: { createdAt: "asc" } },
      },
    });
  }

  async getGeneralEvals(userId: string) {
    return await db.eval.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "asc" },
    });
  }

  async createGeneralEval(userId: string, evaluation: CreateGeneralEvalSchema) {
    return await db.eval.create({
      data: {
        ...evaluation,
        id: uuidv4(),
        ownerId: userId,
      },
    });
  }

  async updateGeneralEval(evaluation: EvalSchema) {
    return await db.eval.update({
      where: { id: evaluation.id },
      data: evaluation,
    });
  }

  async toggleGeneralEval({
    id,
    agentId,
    enabled,
  }: {
    id: string;
    agentId: string;
    enabled: boolean;
  }) {
    if (enabled) {
      return await db.agent.update({
        where: { id: agentId },
        data: {
          enabledGeneralEvals: {
            connect: { id },
          },
        },
      });
    } else {
      return await db.agent.update({
        where: { id: agentId },
        data: {
          enabledGeneralEvals: {
            disconnect: { id },
          },
        },
      });
    }
  }

  async deleteGeneralEval(id: string) {
    return await db.eval.update({ where: { id }, data: { deleted: true } });
  }
  async deleteScenario(id: string) {
    return await db.scenario.update({
      where: { id },
      data: { deleted: true },
    });
  }

  async deleteAgent(id: string) {
    return await db.agent.delete({ where: { id } });
  }
}
