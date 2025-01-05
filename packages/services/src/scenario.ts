import { Prisma, type PrismaClient } from "@repo/db/src/index";
import { v4 as uuidv4 } from "uuid";
import { getCreatedUpdatedDeleted } from "./utils";
import {
  CreateScenario,
  ScenarioWithIncludes,
  ScenarioWithIncludesSchema,
} from "@repo/types/src/index";

export class ScenarioService {
  constructor(private db: PrismaClient) {}

  async createScenario({
    agentId,
    scenario,
    ownerId,
  }: {
    agentId: string;
    scenario: CreateScenario;
    ownerId: string;
  }): Promise<ScenarioWithIncludes> {
    const createdScenario = await this.db.scenario.create({
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
    });

    const parsed = ScenarioWithIncludesSchema.safeParse(createdScenario);
    if (!parsed.success) {
      throw new Error(`Could not parse scenario data: ${parsed.error.message}`);
    }
    return parsed.data;
  }

  async updateScenario({
    scenario,
    ownerId,
  }: {
    scenario: ScenarioWithIncludes;
    ownerId: string;
  }): Promise<ScenarioWithIncludes> {
    const priorEvals = await this.db.evaluation.findMany({
      where: { scenarioId: scenario.id, scenario: { agent: { ownerId } } },
    });

    const { created, updated, deleted } = getCreatedUpdatedDeleted(
      priorEvals,
      scenario.evaluations,
    );

    const updatedScenario = await this.db.scenario.update({
      where: { id: scenario.id, agent: { ownerId } },
      data: {
        ...scenario,
        evaluations: {
          deleteMany: { id: { in: deleted.map((e) => e.id) } },
          updateMany: [
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
    ownerId,
  }: {
    id: string;
    ownerId: string;
  }): Promise<void> {
    await this.db.scenario.update({
      where: { id, agent: { ownerId } },
      data: { deleted: true },
    });
  }
}
