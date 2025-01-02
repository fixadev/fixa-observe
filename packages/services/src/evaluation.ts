import { EvalType, type PrismaClient } from "@repo/db/src/index";
import { v4 as uuidv4 } from "uuid";
import {
  type Evaluation,
  type EvaluationGroupWithIncludes,
  EvaluationTemplate,
  EvaluationWithIncludes,
  EvaluationGroupWithIncludesSchema,
  GeneralEvaluationWithIncludes,
  GeneralEvaluationWithIncludesSchema,
  EvaluationWithIncludesSchema,
} from "@repo/types/src/index";
import { getCreatedUpdatedDeleted } from "./utils";

export class EvaluationService {
  constructor(private db: PrismaClient) {}

  async updateGeneralEvaluations({
    agentId,
    generalEvaluations,
    userId,
  }: {
    agentId: string;
    generalEvaluations: GeneralEvaluationWithIncludes[];
    userId: string;
  }): Promise<GeneralEvaluationWithIncludes[]> {
    const agent = await this.db.agent.findUnique({
      where: { id: agentId, ownerId: userId },
      include: {
        generalEvaluations: {
          include: { evaluation: { include: { evaluationTemplate: true } } },
        },
      },
    });
    if (!agent) {
      throw new Error("Agent not found");
    }

    const { created, updated, deleted } = getCreatedUpdatedDeleted(
      agent.generalEvaluations,
      generalEvaluations,
    );

    const updatedGeneralEvaluations: GeneralEvaluationWithIncludes[] = [];

    await this.db.$transaction(async (tx) => {
      // Create new evaluations
      const createdEvaluations = await tx.evaluation.createManyAndReturn({
        data: created.map((e) => ({
          ...e.evaluation,
          id: undefined,
          evaluationTemplate: undefined,
          params: e.evaluation.params ?? undefined,
        })),
      });

      // Create general evaluation links
      const createdGeneralEvaluations =
        await tx.generalEvaluation.createManyAndReturn({
          data: createdEvaluations.map((e) => ({
            agentId,
            evaluationId: e.id,
          })),
          include: { evaluation: { include: { evaluationTemplate: true } } },
        });

      // Add created general evaluations to the list
      for (const generalEvaluation of createdGeneralEvaluations) {
        const parsedGeneralEvaluation =
          GeneralEvaluationWithIncludesSchema.safeParse(generalEvaluation);
        if (!parsedGeneralEvaluation.success) {
          console.error(
            "Failed to parse general evaluation",
            parsedGeneralEvaluation.error,
          );
          continue;
        }
        updatedGeneralEvaluations.push(parsedGeneralEvaluation.data);
      }

      // Update existing evaluations
      for (const generalEvaluation of updated) {
        const updatedEvaluation = await tx.evaluation.update({
          where: { id: generalEvaluation.evaluation.id },
          data: {
            ...generalEvaluation.evaluation,
            params: generalEvaluation.evaluation.params ?? undefined,
            evaluationTemplate: undefined,
          },
          include: { evaluationTemplate: true },
        });
        const parsedUpdatedEvaluation =
          EvaluationWithIncludesSchema.safeParse(updatedEvaluation);
        if (!parsedUpdatedEvaluation.success) {
          console.error(
            "Failed to parse updated evaluation",
            parsedUpdatedEvaluation.error,
          );
          continue;
        }
        updatedGeneralEvaluations.push({
          ...generalEvaluation,
          evaluation: parsedUpdatedEvaluation.data,
        });
      }

      // Delete removed evaluations
      if (deleted.length > 0) {
        await tx.generalEvaluation.deleteMany({
          where: {
            agentId,
            evaluationId: { in: deleted.map((e) => e.id) },
          },
        });
        await tx.evaluation.deleteMany({
          where: { id: { in: deleted.map((e) => e.id) } },
        });
      }
    });

    return updatedGeneralEvaluations;
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
    const { created, updated, deleted } = getCreatedUpdatedDeleted(
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
