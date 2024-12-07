import { type PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db";
import {
  type CreateScenarioSchema,
  type UpdateScenarioSchema,
} from "~/lib/scenario";

import {
  type EvalOverrideWithoutScenarioId,
  type CreateEvalOverrideSchema,
} from "~/lib/eval";

export class ScenarioService {
  constructor(private db: PrismaClient) {}

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
        evals: { where: { deleted: false }, orderBy: { createdAt: "asc" } },
        generalEvalOverrides: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  async deleteScenario(id: string) {
    return await db.scenario.update({
      where: { id },
      data: { deleted: true },
    });
  }
}
