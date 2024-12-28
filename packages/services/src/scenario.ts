import { Prisma, type PrismaClient } from "@repo/db/src/index";
import { v4 as uuidv4 } from "uuid";
import { getCreatedUpdatedDeleted } from "./utils";
import { ScenarioWithIncludes } from "@repo/types/src/index";

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
    return await this.db.scenario.create({
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
              scenarioId: undefined,
              params: evaluation.params as Prisma.InputJsonValue,
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
    scenarios: ScenarioWithIncludes[];
  }): Promise<ScenarioWithIncludes[]> {
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
                  data: scenario.evaluations.map((evaluation) => ({
                    ...evaluation,
                    id: uuidv4(),
                    scenarioId: undefined,
                    params: evaluation.params as Prisma.InputJsonValue,
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
    scenario: ScenarioWithIncludes;
    userId: string;
  }): Promise<ScenarioWithIncludes> {
    const priorEvals = await this.db.evaluation.findMany({
      where: { scenarioId: scenario.id },
    });

    const { created, updated, deleted } = await getCreatedUpdatedDeleted(
      priorEvals,
      scenario.evaluations,
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
              data: {
                ...evaluation,
                scenarioId: undefined,
                params: evaluation.params as Prisma.InputJsonValue,
              },
            })),
          ],
          createMany: {
            data: created.map((evaluation) => ({
              ...evaluation,
              id: uuidv4(),
              scenarioId: scenario.id,
              params: evaluation.params as Prisma.InputJsonValue,
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
