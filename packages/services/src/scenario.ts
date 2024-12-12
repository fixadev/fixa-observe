import { type PrismaClient } from "@repo/db/src/index";
import { v4 as uuidv4 } from "uuid";
import {
  type CreateScenarioSchema,
  type UpdateScenarioSchema,
} from "@repo/types/src/index";

export class ScenarioService {
  constructor(private db: PrismaClient) {}

  async createScenario({
    agentId,
    scenario,
    userId,
  }: {
    agentId: string;
    scenario: CreateScenarioSchema;
    userId: string;
  }) {
    return await this.db.scenario.create({
      data: {
        ...scenario,
        id: uuidv4(),
        agentId,
        ownerId: userId,
        createdAt: new Date(),
        evals: {
          createMany: {
            data: scenario.evals.map((evaluation) => ({
              ...evaluation,
              id: uuidv4(),
              scenarioId: undefined,
            })),
          },
        },
        generalEvalOverrides: {
          createMany: {
            data: scenario.generalEvalOverrides.map((override) => ({
              ...override,
              id: uuidv4(),
              scenarioId: undefined,
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
    return await this.db.$transaction(async (tx) => {
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
                    scenarioId: undefined,
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

  async updateScenario(scenario: UpdateScenarioSchema, userId: string) {
    const priorEvals = await this.db.eval.findMany({
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

    const priorOverrides = await this.db.evalOverride.findMany({
      where: { scenarioId: scenario.id },
    });

    const evalOverridesToDelete = scenario.generalEvalOverrides.filter(
      (override) =>
        priorOverrides.some(
          (priorOverride) => priorOverride.id === override.id,
        ),
    );

    const evalOverridesToUpdate = scenario.generalEvalOverrides.filter(
      (override) =>
        priorOverrides.some(
          (priorOverride) => priorOverride.id === override.id,
        ),
    );

    const evalOverridesToCreate = scenario.generalEvalOverrides.filter(
      (override) =>
        !priorOverrides.some(
          (priorOverride) => priorOverride.id === override.id,
        ),
    );

    return await this.db.scenario.update({
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
              data: { ...evaluation, scenarioId: undefined },
            })),
          ],
          createMany: {
            data: evaluationsToCreate.map((evaluation) => ({
              ...evaluation,
              id: uuidv4(),
              scenarioId: scenario.id,
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
              data: { ...override, scenarioId: undefined },
            })),
          ],
          createMany: {
            data: evalOverridesToCreate.map((override) => ({
              ...override,
              id: uuidv4(),
              scenarioId: undefined,
            })),
          },
        },
      },
      include: {
        evals: { where: { deleted: false }, orderBy: { createdAt: "asc" } },
        generalEvalOverrides: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  async deleteScenario(id: string, userId: string) {
    return await this.db.scenario.update({
      where: { id, ownerId: userId },
      data: { deleted: true },
    });
  }
}
