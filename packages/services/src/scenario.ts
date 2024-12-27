import { type PrismaClient } from "@repo/db/src/index";
import { v4 as uuidv4 } from "uuid";
import {
  type CreateScenarioSchema,
  type UpdateScenarioSchema,
} from "@repo/types/src/index";
import { getCreatedUpdatedDeleted } from "./utils";

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
        evaluations: {
          createMany: {
            data: scenario.evals.map((evaluation) => ({
              ...evaluation,
              id: uuidv4(),
              scenarioId: undefined,
            })),
          },
        },
      },
      include: {
        evaluations: {
          include: { evaluationTemplate: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  async createScenarios({
    agentId,
    scenarios,
  }: {
    agentId: string;
    scenarios: CreateScenarioSchema[];
  }) {
    return await this.db.$transaction(async (tx) => {
      return await Promise.all(
        scenarios.map((scenario) =>
          tx.scenario.create({
            data: {
              ...scenario,
              id: uuidv4(),
              agentId,
              createdAt: new Date(),
              evaluations: {
                createMany: {
                  data: scenario.evals.map((evaluation) => ({
                    ...evaluation,
                    id: uuidv4(),
                    scenarioId: undefined,
                  })),
                },
              },
            },
            include: {
              evaluations: {
                include: { evaluationTemplate: true },
                orderBy: { createdAt: "asc" },
              },
            },
          }),
        ),
      );
    });
  }

  async updateScenario({
    scenario,
    userId,
  }: {
    scenario: UpdateScenarioSchema;
    userId: string;
  }) {
    const priorEvals = await this.db.evaluation.findMany({
      where: { scenarioId: scenario.id },
    });

    const { created, updated, deleted } = await getCreatedUpdatedDeleted(
      priorEvals,
      scenario.evals,
    );

    return await this.db.scenario.update({
      where: { id: scenario.id },
      data: {
        ...scenario,
        evaluations: {
          updateMany: [
            ...deleted.map((evaluation) => ({
              where: { id: evaluation.id },
              data: { deleted: true },
            })),
            ...updated.map((evaluation) => ({
              where: { id: evaluation.id },
              data: { ...evaluation, scenarioId: undefined },
            })),
          ],
          createMany: {
            data: created.map((evaluation) => ({
              ...evaluation,
              id: uuidv4(),
              scenarioId: scenario.id,
            })),
          },
        },
      },
      include: {
        evaluations: {
          include: { evaluationTemplate: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  async deleteScenario({ id, userId }: { id: string; userId: string }) {
    return await this.db.scenario.update({
      where: { id, ownerId: userId },
      data: { deleted: true },
    });
  }
}
