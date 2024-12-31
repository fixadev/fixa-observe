import { Prisma, type PrismaClient } from "@repo/db/src/index";
import { v4 as uuidv4 } from "uuid";
import { getCreatedUpdatedDeleted } from "./utils";
import {
  ScenarioWithIncludes,
  ScenarioWithIncludesSchema,
} from "@repo/types/src/index";

export class ScenarioService {
  constructor(private db: PrismaClient) {}

  async createScenario({
    agentId,
    scenario,
    userId,
  }: {
    agentId: string;
    scenario: ScenarioWithIncludes;
    userId: string;
  }): Promise<ScenarioWithIncludes> {
    const createdScenario = await this.db.scenario.create({
      data: {
        ...scenario,
        id: uuidv4(),
        agentId,
        ownerId: userId,
        createdAt: new Date(),
        evaluations: {
          createMany: {
            data: scenario.evaluations.map((evaluation) => ({
              ...evaluation,
              id: uuidv4(),
              params: evaluation.params as Prisma.InputJsonValue,
              scenarioId: undefined,
              evaluationTemplate: undefined,
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

    const parsed = ScenarioWithIncludesSchema.safeParse(createdScenario);
    if (!parsed.success) {
      throw new Error(`Could not parse scenario data: ${parsed.error.message}`);
    }
    return parsed.data;
  }

  async createScenarios({
    agentId,
    scenarios,
  }: {
    agentId: string;
    scenarios: ScenarioWithIncludes[];
  }): Promise<ScenarioWithIncludes[]> {
    return await this.db.$transaction(async (tx) => {
      const createdScenarios = await Promise.all(
        scenarios.map((scenario) =>
          tx.scenario.create({
            data: {
              ...scenario,
              id: uuidv4(),
              agentId,
              createdAt: new Date(),
              evaluations: {
                createMany: {
                  data: scenario.evaluations.map((evaluation) => ({
                    ...evaluation,
                    id: uuidv4(),
                    params: evaluation.params as Prisma.InputJsonValue,
                    scenarioId: undefined,
                    evaluationTemplate: undefined,
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

      return createdScenarios.map((scenario) => {
        const parsed = ScenarioWithIncludesSchema.safeParse(scenario);
        if (!parsed.success) {
          throw new Error(
            `Could not parse scenario data: ${parsed.error.message}`,
          );
        }
        return parsed.data;
      });
    });
  }

  async updateScenario({
    scenario,
    userId,
  }: {
    scenario: ScenarioWithIncludes;
    userId: string;
  }): Promise<ScenarioWithIncludes> {
    const priorEvals = await this.db.evaluation.findMany({
      where: { scenarioId: scenario.id },
    });

    const { created, updated, deleted } = getCreatedUpdatedDeleted(
      priorEvals,
      scenario.evaluations,
    );

    const updatedScenario = await this.db.scenario.update({
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
              data: {
                ...evaluation,
                params: evaluation.params as Prisma.InputJsonValue,
                scenarioId: undefined,
                evaluationTemplate: undefined,
              },
            })),
          ],
          createMany: {
            data: created.map((evaluation) => ({
              ...evaluation,
              id: uuidv4(),
              params: evaluation.params as Prisma.InputJsonValue,
              scenarioId: undefined,
              evaluationTemplate: undefined,
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

    const parsed = ScenarioWithIncludesSchema.safeParse(updatedScenario);
    if (!parsed.success) {
      throw new Error(`Could not parse scenario data: ${parsed.error.message}`);
    }
    return parsed.data;
  }

  async deleteScenario({
    id,
    userId,
  }: {
    id: string;
    userId: string;
  }): Promise<void> {
    await this.db.scenario.update({
      where: { id, ownerId: userId },
      data: { deleted: true },
    });
  }
}
