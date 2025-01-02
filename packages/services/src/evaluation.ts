import { EvalType, type PrismaClient } from "@repo/db/src/index";
import { v4 as uuidv4 } from "uuid";
import {
  type Evaluation,
  type EvaluationGroupWithIncludes,
  EvaluationTemplate,
  EvaluationWithIncludes,
  EvaluationWithIncludesSchema,
  EvaluationGroupWithIncludesSchema,
} from "@repo/types/src/index";
import { getCreatedUpdatedDeleted } from "./utils";

export class EvaluationService {
  constructor(private db: PrismaClient) {}

  async getGeneralEvals({
    userId,
  }: {
    userId: string;
  }): Promise<EvaluationWithIncludes[]> {
    const evaluations = await this.db.evaluation.findMany({
      where: {
        evaluationTemplate: { ownerId: userId, type: EvalType.general },
      },
      orderBy: { createdAt: "asc" },
      include: {
        evaluationTemplate: true,
      },
    });
    return evaluations
      .map((evaluation) => {
        const parsedEvaluation =
          EvaluationWithIncludesSchema.safeParse(evaluation);
        if (!parsedEvaluation.success) {
          console.error(parsedEvaluation.error);
          return null;
        }
        return parsedEvaluation.data;
      })
      .filter((e) => e !== null);
  }

  async getTemplates({
    userId,
  }: {
    userId: string;
  }): Promise<EvaluationTemplate[]> {
    return await this.db.evaluationTemplate.findMany({
      where: { ownerId: userId, deleted: false },
      orderBy: { createdAt: "asc" },
    });
  }

  async createTemplate({
    template,
    userId,
  }: {
    template: EvaluationTemplate;
    userId: string;
  }): Promise<EvaluationTemplate> {
    return await this.db.evaluationTemplate.create({
      data: { ...template, id: uuidv4(), ownerId: userId },
    });
  }

  async updateTemplate({
    template,
    userId,
  }: {
    template: EvaluationTemplate;
    userId: string;
  }): Promise<EvaluationTemplate> {
    return await this.db.evaluationTemplate.update({
      where: { id: template.id, ownerId: userId },
      data: { ...template },
    });
  }

  async deleteTemplate({
    id,
    userId,
  }: {
    id: string;
    userId: string;
  }): Promise<void> {
    await this.db.evaluationTemplate.update({
      where: { id, ownerId: userId },
      data: { deleted: true },
    });
  }

  async create({
    evaluation,
    userId,
  }: {
    evaluation: Evaluation;
    userId: string;
  }): Promise<Evaluation> {
    return await this.db.evaluation.create({
      data: {
        ...evaluation,
        scenarioId: null,
        params: evaluation.params ?? undefined,
      },
    });
  }

  async update({
    evaluation,
    userId,
  }: {
    evaluation: Evaluation;
    userId: string;
  }): Promise<Evaluation> {
    return await this.db.evaluation.update({
      where: { id: evaluation.id, evaluationTemplate: { ownerId: userId } },
      data: { ...evaluation, params: evaluation.params ?? undefined },
    });
  }

  async toggleEnabled({
    id,
    enabled,
    userId,
  }: {
    id: string;
    agentId: string;
    enabled: boolean;
    userId: string;
  }): Promise<Evaluation> {
    return await this.db.evaluation.update({
      where: { id, evaluationTemplate: { ownerId: userId } },
      data: {
        enabled,
      },
    });
  }

  async delete({
    id,
    userId,
  }: {
    id: string;
    userId: string;
  }): Promise<Evaluation> {
    return await this.db.evaluation.delete({
      where: { id, evaluationTemplate: { ownerId: userId } },
    });
  }

  async getGroups({
    userId,
  }: {
    userId: string;
  }): Promise<EvaluationGroupWithIncludes[]> {
    const evaluationGroups = await this.db.evaluationGroup.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "asc" },
      include: {
        evaluations: {
          include: {
            evaluationTemplate: true,
          },
        },
      },
    });

    return evaluationGroups
      .map((evaluationGroup) => {
        const parsedEvaluationGroup =
          EvaluationGroupWithIncludesSchema.safeParse(evaluationGroup);
        if (!parsedEvaluationGroup.success) {
          console.error(
            "Failed to parse evaluation group",
            parsedEvaluationGroup.error,
          );
          return null;
        }
        return parsedEvaluationGroup.data;
      })
      .filter((e) => e !== null);
  }

  async createGroup({
    group,
    userId,
  }: {
    group: EvaluationGroupWithIncludes;
    userId: string;
  }): Promise<EvaluationGroupWithIncludes> {
    const evaluationGroup = await this.db.evaluationGroup.create({
      data: {
        ...group,
        id: uuidv4(),
        ownerId: userId,
        evaluations: {
          create: group.evaluations.map((evaluation) => ({
            ...evaluation,
            id: uuidv4(),
            params: evaluation.params ?? undefined,
            evaluationTemplate: undefined,
            evaluationGroupId: undefined,
          })),
        },
      },
      include: {
        evaluations: {
          include: {
            evaluationTemplate: true,
          },
        },
      },
    });

    const parsedEvaluationGroup =
      EvaluationGroupWithIncludesSchema.safeParse(evaluationGroup);
    if (!parsedEvaluationGroup.success) {
      throw new Error(
        "Failed to parse evaluation group",
        parsedEvaluationGroup.error,
      );
    }
    return parsedEvaluationGroup.data;
  }

  async updateGroup({
    group,
    userId,
  }: {
    group: EvaluationGroupWithIncludes;
    userId: string;
  }): Promise<EvaluationGroupWithIncludes> {
    const priorEvaluations = await this.db.evaluation.findMany({
      where: { evaluationGroupId: group.id },
    });
    const { created, updated, deleted } = await getCreatedUpdatedDeleted(
      priorEvaluations,
      group.evaluations,
    );
    const evaluationGroup = await this.db.evaluationGroup.update({
      where: { id: group.id, ownerId: userId },
      data: {
        ...group,
        evaluations: {
          deleteMany: { id: { in: deleted.map((e) => e.id) } },
          updateMany: [
            ...updated.map((evaluation) => ({
              where: { id: evaluation.id },
              data: {
                ...evaluation,
                params: evaluation.params ?? undefined,
                evaluationTemplate: undefined,
                evaluationGroupId: undefined,
              },
            })),
          ],
          createMany: {
            data: created.map((evaluation) => ({
              ...evaluation,
              id: uuidv4(),
              params: evaluation.params ?? undefined,
              evaluationTemplate: undefined,
              evaluationGroupId: undefined,
            })),
          },
        },
      },
      include: {
        evaluations: {
          include: {
            evaluationTemplate: true,
          },
        },
      },
    });

    const parsedEvaluationGroup =
      EvaluationGroupWithIncludesSchema.safeParse(evaluationGroup);
    if (!parsedEvaluationGroup.success) {
      throw new Error(
        "Failed to parse evaluation group",
        parsedEvaluationGroup.error,
      );
    }
    return parsedEvaluationGroup.data;
  }

  async deleteGroup({
    id,
    userId,
  }: {
    id: string;
    userId: string;
  }): Promise<void> {
    await this.db.evaluationGroup.delete({ where: { id, ownerId: userId } });
  }
}
